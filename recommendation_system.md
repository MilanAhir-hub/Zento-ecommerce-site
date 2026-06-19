# Recommendation System Audit

## 1. Executive Summary

The application has an early but usable recommendation foundation. Backend support exists for an authenticated `GET /api/recommendations` endpoint that returns three lists: `recommended`, `trending`, and `recentlyViewed`. The engine combines content-based category affinity, basic collaborative filtering, global trending, and recently viewed products. Frontend support exists only on `/user/home`, where those three lists are rendered through reusable landing sections.

The main architectural issue is not the absence of a recommendation engine; it is the gap between available commerce data and the data actually used for ranking. Cart, wishlist, order, review, search history, vendor analytics, and product metadata exist, but most of those signals are not connected to recommendations. Interaction logging is also incomplete and insecure: the public interaction endpoint trusts a client-supplied `userId`, does not require authentication, does not validate product/action consistency, and is mostly called from `ProductCard`.

Current recommendation quality is likely low to moderate. The engine can personalize by broad category and recent interactions, but it does not understand price affinity, subcategory, vendor/store affinity, ratings, wishlist intent, cart context, search intent, purchase recency, conversion rate, product quality, margin, inventory depth, or session behavior. Product detail has a local category-based “You May Also Like” implementation, but it bypasses the recommendation API. Cart, checkout, wishlist, search, category, and profile pages are missing proper recommendation placements.

Final recommendation score: **4/10**.

## 2. Current Recommendation Architecture

### Backend Entry Points

Primary route:

- `server/routes/recommendation.routes.ts`
- `GET /api/recommendations`
- Protected by `isAuthenticated`
- Controller: `server/controllers/recommendation.controller.ts`
- Service entry: `server/services/recommendation/hybridEngine.ts`

The controller reads `req.userId`, calls `getHybridRecommendations(userId)`, and returns:

- `recommended`: merged content-based, collaborative, and trending fallback products
- `trending`: globally trending products
- `recentlyViewed`: recently viewed or clicked products

There is a small dead-path mismatch: the route requires authentication, but the controller still contains logic for missing `userId` and guest fallback. In practice, unauthenticated requests should be rejected by middleware before reaching the fallback branch.

### Backend Recommendation Services

Current services:

- `contentBased.ts`: recommends products from categories inferred from weighted user interactions.
- `collaborative.ts`: recommends products liked by users who overlapped with the current user on at least two interacted products.
- `trending.ts`: ranks products by weighted interactions in a recent time window.
- `recentlyViewed.ts`: deduplicates recent `view` and `click` interactions.
- `scoringEngine.ts`: builds category and product scores from `Interaction` records.
- `hybridEngine.ts`: runs strategies in parallel and merges results.

### Frontend Entry Points

Recommendation API client:

- `client/src/services/recommendation.api.ts`

React Query hook:

- `client/src/hooks/useRecommendations.ts`
- Enabled only when authenticated
- Cache key is `['recommendations']`
- Stale time is 5 minutes

Current UI components:

- `client/src/sections/Landing/Recommended.tsx`
- `client/src/sections/Landing/TrendingProducts.tsx`
- `client/src/sections/Landing/RecentlyViewed.tsx`

Current page placement:

- `client/src/pages/user/UserHome.tsx`

Recommendation UI is currently not shared across cart, checkout, listing/search, category, wishlist, profile, or guest home.

## 3. Existing Data Sources

### Product Data

Model: `server/models/Product.ts`

Available fields:

- `title`
- `description`
- `price`
- `imageUrl`
- `images`
- `stock`
- `vendorId`
- `category`
- `subcategory`
- `imageEmbedding`
- timestamps

Recommendation usage today:

- `category` is used for content-based recommendations.
- `stock` is used to filter available products in most recommendation services.
- `createdAt` is used as fallback/newest sorting.
- `imageEmbedding` exists for visual search but is not used in recommendations.
- `subcategory`, `vendorId`, text fields, and price are not used in ranking.

### Interaction Data

Model: `server/models/Interaction.ts`

Available fields:

- `userId`
- `productId`
- `action`: `view`, `click`, `add_to_cart`, `remove_from_cart`, `checkout`, `purchase`, `search_query`
- `quantity`
- `price`
- `metadata.searchQuery`
- `timestamp`

Indexes:

- `{ userId: 1, action: 1 }`
- `{ productId: 1, action: 1 }`
- `{ userId: 1, productId: 1 }`
- `{ timestamp: -1 }`

Recommendation usage today:

- Primary source for content-based, collaborative, trending, and recently viewed.
- `search_query` is excluded from user profiles and trending.
- `quantity`, `price`, and `metadata.searchQuery` are not used.

Logging implementation:

- `server/controllers/interaction.controller.ts`
- `POST /api/interactions/log`
- No authentication middleware.
- Trusts `userId` from request body.
- No validation for action, product existence, ownership, price, quantity, or duplicate spam.

Frontend logging:

- `client/src/hooks/useInteractionLogger.ts`
- `client/src/services/interaction.api.ts`
- `ProductCard` logs:
  - `view` when the product card link is clicked.
  - `add_to_cart` before calling cart mutation.

Important gap:

- Product detail page add-to-cart does not log an interaction.
- Wishlist add/remove does not log an interaction.
- Cart remove/update does not log an interaction.
- Checkout/purchase is not logged to `Interaction`.
- Search queries are stored in `User.searchHistory`, not logged to `Interaction`.

### Search History

Model field: `User.searchHistory`

Controller methods:

- `getSearchHistory`
- `addSearchHistory`
- `syncSearchHistory`
- `removeSearchHistory`

Frontend:

- `client/src/services/searchHistory.api.ts`
- `client/src/components/navbar/SearchMenu.tsx`

Current behavior:

- Authenticated history stored on user record.
- Local history also exists for guests/browser state.
- Only last 5 terms are preserved.
- Search history is not connected to recommendations.
- Search history is not normalized into categories, brands, subcategories, price intent, or embeddings.

### Cart

Model: `server/models/Cart.ts`

Available fields:

- `user`
- `items.product`
- `items.quantity`
- timestamps

Controller methods:

- `getMyCart`
- `addToCart`
- `updateCartItem`
- `removeFromCart`
- `clearCart`

Current recommendation usage:

- None directly.
- Cart add from `ProductCard` creates an `Interaction` indirectly through frontend logging.
- Cart add from product detail does not create an interaction.
- Cart updates/removals are not used as negative or quantity signals.

### Wishlist

Model: `server/models/Wishlist.ts`

Available fields:

- `user`
- `items`
- timestamps

Controller methods:

- `getMyWishlist`
- `addToWishlist`
- `removeFromWishlist`
- `clearWishlist`

Current recommendation usage:

- None.
- Wishlist add/remove is not logged to `Interaction`.
- Wishlist is not used for “similar to saved,” “price drop,” “back in stock,” or “complete wishlist” recommendations.

### Orders

Model: `server/models/Order.ts`

Available fields:

- `user`
- `vendorId`
- `items.product`
- `items.quantity`
- `items.price`
- `totalAmount`
- `status`
- timestamps

Order creation:

- `server/services/order.service.ts`
- `createOrdersFromCart` groups cart items by vendor, creates orders, decrements stock, and clears cart.

Current recommendation usage:

- None directly.
- Purchase signals should be available through orders, but no `purchase` interaction is written when orders are created or payment is verified.
- Content-based recommendations exclude purchased products only if `Interaction` rows with action `purchase` exist. Normal order creation does not appear to create those rows.

### Reviews

Model: `server/models/Review.ts`

Available fields:

- `user`
- `product`
- `rating`
- `comment`
- timestamps

Controller methods:

- `addReview`
- `updateReview`
- `deleteReview`
- `getProductReviews`

Current recommendation usage:

- None.
- Review ratings are not used as positive/negative preference signals.
- Product average rating is computed on demand for review display, not stored or consumed by recommendation ranking.

### Analytics

Vendor analytics:

- `server/controllers/vendor.controller.ts`
- `getTopSellingProducts`
- `getVendorAnalytics`

Admin analytics:

- `server/controllers/admin.controller.ts`

Current recommendation usage:

- None.
- Sales velocity, revenue, product conversion, cancellation rates, vendor performance, and top-selling products are not used in ranking.

### UserActivity Model

Model: `server/models/UserActivity.ts`

Available actions:

- `view`
- `click`
- `add_to_cart`
- `remove_from_cart`
- `wishlist_add`
- `wishlist_remove`
- `purchase`

Current recommendation usage:

- None.
- This appears to be an older or unused duplicate of `Interaction`.
- It includes wishlist actions that `Interaction` does not include, but it is not integrated.

## 4. Current Ranking Logic

### Action Weights

Current weights in `scoringEngine.ts`:

- `view`: 1
- `click`: 2
- `add_to_cart`: 3
- `remove_from_cart`: -1
- `checkout`: 4
- `purchase`: 5

Current trending weights in `trending.ts` are similar and hardcoded separately:

- `purchase`: 5
- `checkout`: 4
- `add_to_cart`: 3
- `click`: 2
- `view`: 1
- `remove_from_cart`: -1

Issue:

- Weights are duplicated in two files.
- Strategy weights exist in `hybridEngine.ts` but are not actually used for scoring.

### Content-Based Logic

Flow:

1. Fetch last 200 non-search interactions with product IDs.
2. Fetch product categories for interacted products.
3. Sum action weights per category.
4. Take top 5 categories.
5. Find in-stock products in those categories.
6. Exclude products with `purchase` interactions.
7. Sort by newest `createdAt`.

Strengths:

- Simple and explainable.
- Works with sparse data.
- Fast enough for early-stage traffic.

Weaknesses:

- Only category-level affinity.
- Ignores subcategory, vendor, price band, text similarity, image embedding, inventory depth, review quality, margin, and conversion.
- Does not exclude products already viewed, carted, or wishlisted unless purchased.
- Purchase exclusion depends on `purchase` interactions that are not currently created by order flow.

### Collaborative Logic

Flow:

1. Fetch current user products with actions `view`, `click`, `add_to_cart`, `purchase`.
2. Find other users who interacted with the same products.
3. Require at least two overlapping products.
4. Fetch other products those similar users added to cart or purchased.
5. Exclude products the current user already interacted with.
6. Rank by frequency.
7. Return in-stock products sorted by frequency.

Strengths:

- Captures co-interest patterns.
- Uses higher-intent actions for final candidate products.

Weaknesses:

- Requires enough traffic and overlap.
- Frequency-only scoring is easy to bias toward popular products.
- Similar users are capped at 50 without sorting by overlap strength.
- No time decay.
- No category/price/vendor constraints.
- No rating/order status quality checks.

### Trending Logic

Flow:

1. Look at interactions in the last 7 days.
2. Exclude `search_query`.
3. Apply action weights.
4. Group by product.
5. Sort by trend score.
6. Fetch in-stock products.
7. Fallback to newest products if no interactions exist.

Strengths:

- Useful for guests and cold start.
- Uses recency window.

Weaknesses:

- Not normalized by impressions.
- Not protected against repeated interaction spam.
- No stock-depth or product-quality guard except `stock > 0`.
- No category-specific trending endpoint.

### Recently Viewed Logic

Flow:

1. Find user `view` and `click` interactions.
2. Sort newest first.
3. Group by product.
4. Fetch products and preserve order.

Strengths:

- Useful re-entry module.

Weaknesses:

- Does not filter out out-of-stock products.
- Product card logs `view` on click, so “view” means clicked from a card, not necessarily product page rendered.
- Product detail direct visits may not be logged if reached outside `ProductCard`.

### Hybrid Merge Logic

Current merge:

- Interleaves content-based and collaborative candidates.
- Fills remaining slots with trending.
- Deduplicates by `_id`.
- Caps at 10.

Issue:

- `STRATEGY_WEIGHTS` is declared but unused.
- No numeric score is carried across strategies.
- No explanation metadata is returned.
- No diversity controls beyond interleaving.

## 5. Missing User Signals

High-impact missing signals:

- Authenticated product detail view on page load.
- Product card impression, not just click.
- Product detail dwell time.
- Add-to-cart from product detail.
- Cart quantity updates.
- Cart remove/abandonment.
- Wishlist add/remove.
- Checkout started.
- Payment success.
- Purchase from orders.
- Cancelled orders as negative or neutralized purchase.
- Returned/refunded order signals if returns are added later.
- Review rating and review sentiment.
- Search query intent.
- Search result click position.
- Search no-results event.
- Visual search query and clicked visual matches.
- Category page view.
- Category/subcategory filter preference.
- Price band affinity.
- Vendor/store affinity.
- Repeat purchase cadence.
- Session-level behavior for guests.
- Product impressions and CTR.
- Recommendation impressions/clicks/conversions for measuring module quality.

Recommended canonical event taxonomy:

- `product_impression`
- `product_click`
- `product_view`
- `product_dwell`
- `add_to_cart`
- `cart_quantity_increase`
- `cart_quantity_decrease`
- `remove_from_cart`
- `wishlist_add`
- `wishlist_remove`
- `checkout_start`
- `purchase`
- `order_cancel`
- `review_create`
- `review_update`
- `search_query`
- `search_result_click`
- `visual_search_query`
- `visual_search_click`
- `recommendation_impression`
- `recommendation_click`
- `recommendation_add_to_cart`
- `recommendation_purchase`

## 6. Missing Recommendation Types

### Personalized For You

- Business value: High. Drives engagement on home, profile, and empty states.
- Complexity: Medium.
- Priority: P0.
- Required data: Interactions, cart, wishlist, orders, reviews, search history, product metadata.
- Frontend placement: Home, Profile, Wishlist empty state, Cart empty state.

### Similar Products

- Business value: High. Helps product discovery and reduces bounce on product detail.
- Complexity: Medium.
- Priority: P0.
- Required data: Product category, subcategory, price, vendor, title/description embeddings, image embeddings.
- Frontend placement: Product Detail below product info, Search no-results, Category product cards as fallback.

### Frequently Bought Together

- Business value: High. Increases average order value.
- Complexity: Medium to High.
- Priority: P0.
- Required data: Orders grouped by product pairs, cart contents, product stock, price.
- Frontend placement: Product Detail near add-to-cart, Cart above summary, Checkout as low-friction add-on only before payment.

### Complete The Look / Complementary Products

- Business value: High for fashion/lifestyle merchandising.
- Complexity: Medium.
- Priority: P1.
- Required data: Category complement rules, co-purchase data, curated tags, product embeddings.
- Frontend placement: Product Detail, Cart, Category editorial sections.

### Customers Also Bought

- Business value: High.
- Complexity: Medium.
- Priority: P1.
- Required data: Orders, non-cancelled purchase events, product co-occurrence.
- Frontend placement: Product Detail, Cart, Order history, Profile.

### Recently Viewed

- Business value: Medium.
- Complexity: Low.
- Priority: P0 because it already exists but needs better logging/filtering.
- Required data: Product detail views, product clicks, stock.
- Frontend placement: Home, Profile, Product Detail footer, Cart empty state.

### Trending Now

- Business value: Medium.
- Complexity: Low to Medium.
- Priority: P0.
- Required data: Weighted interactions, purchases, impressions, time windows.
- Frontend placement: Home, Search, Category, Guest landing, Profile.

### Trending In Category

- Business value: High on category pages.
- Complexity: Medium.
- Priority: P1.
- Required data: Interactions filtered by category/subcategory, order velocity, stock.
- Frontend placement: Category, Search results when category filtered.

### Based On Your Search

- Business value: High. Converts active intent.
- Complexity: Medium.
- Priority: P1.
- Required data: Search history, query embeddings, clicked results, product text/category.
- Frontend placement: Search menu, Listing page, Home, Profile.

### Because You Wishlisted

- Business value: Medium to High.
- Complexity: Medium.
- Priority: P1.
- Required data: Wishlist items, similar products, price bands, stock.
- Frontend placement: Wishlist, Home, Profile.

### Cart Add-Ons

- Business value: High. Direct average order value impact.
- Complexity: Medium.
- Priority: P0.
- Required data: Cart items, co-purchase pairs, complementary categories, stock, price cap.
- Frontend placement: Cart below item list or beside summary.

### Checkout Last-Minute Add-Ons

- Business value: Medium. Can increase AOV but risks checkout distraction.
- Complexity: Medium.
- Priority: P2.
- Required data: Cart context, low-friction accessory products, inventory, price threshold.
- Frontend placement: Checkout below order summary, limited to 2-3 items.

### Buy Again

- Business value: Medium.
- Complexity: Low to Medium.
- Priority: P2.
- Required data: Orders, replenishable categories, purchase recency.
- Frontend placement: Profile, My Orders.

### Top Rated

- Business value: Medium.
- Complexity: Low.
- Priority: P2.
- Required data: Reviews, average rating, review count, stock.
- Frontend placement: Home, Category, Search no-results.

### New Arrivals For You

- Business value: Medium.
- Complexity: Low to Medium.
- Priority: P2.
- Required data: Product timestamps, user category/subcategory affinity.
- Frontend placement: Home, Profile, Category.

### Vendor/Store Recommendations

- Business value: Medium.
- Complexity: Medium.
- Priority: P2.
- Required data: Vendor affinity, vendor product catalog, vendor conversion/satisfaction metrics.
- Frontend placement: Product Detail seller block, Profile, Category.

## 7. Frontend Placement Strategy

### Home

Current state:

- `/user/home` renders `Recommended`, `TrendingProducts`, and `RecentlyViewed`.
- Guest landing uses generic sections, not the recommendation API.

Missing:

- Guest-safe trending endpoint or public fallback.
- Personalized new arrivals.
- Search-based recommendations.
- Wishlist-based recommendations.

Recommended placement:

1. Top after dashboard cards: `Recommended For You`.
2. Middle: `Trending Now`.
3. Lower: `Recently Viewed`.
4. Optional: `Because You Searched For...` if search history exists.
5. Optional: `New In Your Favorite Categories`.

### Product Detail

Current state:

- Local category fetch creates “You May Also Like.”
- Does not use recommendation API.
- Product detail add-to-cart does not log `add_to_cart`.
- Product detail page load does not log `product_view`.

Missing:

- Similar products.
- Frequently bought together.
- Complete the look.
- Customers also bought.
- Recently viewed footer.

Recommended placement:

1. Near add-to-cart: `Frequently Bought Together`.
2. Below main product: `Similar Products`.
3. Below seller block or after related grid: `Customers Also Bought`.
4. Footer: `Recently Viewed`.

### Cart

Current state:

- No recommendations.
- Empty state only links to products.

Missing:

- Cart add-ons.
- Complete the look.
- Recently viewed recovery.
- Wishlist reminders.

Recommended placement:

1. Active cart, below cart items before continue-shopping: `Complete Your Bag`.
2. Summary sidebar or below summary: 2-3 compact add-ons under a price threshold.
3. Empty cart: `Recently Viewed` and `Recommended For You`.
4. If wishlist exists: `Move From Wishlist`.

### Checkout

Current state:

- No recommendations.

Missing:

- Low-friction add-ons.
- Cart validation recommendations for out-of-stock replacements.

Recommended placement:

1. Keep checkout mostly focused.
2. Add a small `Last-Minute Additions` module below order summary, max 2-3 items.
3. Do not show large sliders above payment.
4. If an item becomes unavailable, show replacement recommendations inline.

### Wishlist

Current state:

- Wishlist list only.
- Empty state links to products.
- Wishlist actions are not used for recommendation signals.

Missing:

- Similar to wishlist items.
- Price-compatible alternatives.
- Back-in-stock/low-stock signals.
- Cart conversion prompts.

Recommended placement:

1. Below wishlist: `More Like Your Wishlist`.
2. Empty wishlist: `Recommended For You`.
3. For each wishlist item: optional `Similar` inline action.
4. Add `Recently Viewed` below empty state.

### Search

Current state:

- Search menu shows live results and search history.
- Listing page supports keyword search and visual search results.
- Search history is stored but not used by recommendations.

Missing:

- Query-aware recommendations.
- No-results recovery recommendations.
- Search result click tracking.
- Visual search click tracking.

Recommended placement:

1. Search menu idle state: recent searches plus `Trending Searches` or `Popular Products`.
2. Search results page: normal results first.
3. No-results state: `Similar Matches`, `Top Rated`, and `Trending Now`.
4. Visual search page: `Visually Similar` and `Similar Categories`.

### Category

Current state:

- Category page has editorial product sections created by slicing the fetched category product list.
- A section called `Trending Now` exists, but it is only a later slice of category products, not actual trending.

Missing:

- Category-specific trending.
- Personalized ordering inside category.
- Recently viewed in this category.
- Category/subcategory recommendation endpoint.

Recommended placement:

1. Product grid sorting should support personalized ranking when authenticated.
2. Editorial `Trending Now` should use category trending data.
3. Add `Recommended In [Category]` after first grid.
4. No-results state should show popular products in category or adjacent categories.

### Profile

Current state:

- `/user/profile` manages account/vendor settings.
- `/user/home` acts as personalized dashboard.

Missing:

- Buy again.
- Recently viewed.
- Based on orders.
- Based on wishlist.

Recommended placement:

1. Keep `/user/profile` account-focused.
2. Use `/user/home` as the recommendation dashboard.
3. Add `Buy Again` and `Based On Your Orders` to `/user/home`.
4. Add compact recommendation widgets to `/user/orders`.

## 8. Data Quality Issues

1. Interaction logging trusts client data.
   - `POST /api/interactions/log` accepts `userId` from body and has no auth middleware.
   - This pollutes user profiles and enables forged signals.

2. Purchase signals are not reliably written.
   - Orders are stored in `Order`, but recommendation logic expects `purchase` interactions.
   - Content-based purchase exclusion may fail.

3. Search history is siloed.
   - `User.searchHistory` is separate from `Interaction`.
   - `search_query` exists in the interaction enum but is not actually used by search UI.

4. Product detail views are undercounted.
   - `ProductCard` logs `view` on click.
   - Direct product page entry does not log view.

5. Wishlist signal is missing.
   - `Interaction` enum does not support wishlist actions.
   - `UserActivity` supports wishlist actions but is unused.

6. Review signal is missing.
   - Reviews are stored but not aggregated into product ranking or user preference.

7. Duplicated action-weight logic.
   - `scoringEngine.ts` and `trending.ts` duplicate weights.

8. Weak product metadata.
   - No brand, tags, attributes, gender, color, size, material, margin, discount, popularity counters, or normalized price bucket.
   - Category/subcategory quality drives most current personalization.

9. No recommendation attribution.
   - Frontend cannot report which module generated impressions/clicks.
   - Backend cannot measure recommendation CTR or conversion.

10. No anti-spam or dedupe.
   - Repeated clicks/views can inflate scores.

## 9. Scalability Analysis

Current system should work for small catalogs and early traffic, but it will degrade as interactions grow.

Backend concerns:

- Content-based profile rebuilds on every request from the last 200 interactions.
- Collaborative filtering runs aggregation over `Interaction` at request time.
- Trending aggregation runs over recent interactions at request time.
- No cache layer for recommendation responses.
- No precomputed user profile, product popularity, co-purchase matrix, or product similarity table.
- No pagination or cursor support for recommendation endpoint.
- All strategies return lean product documents without projection control.

Database concerns:

- Existing indexes are helpful, but collaborative queries would benefit from compound indexes such as `{ productId: 1, action: 1, userId: 1 }` and `{ userId: 1, timestamp: -1 }`.
- Trending would benefit from `{ timestamp: -1, productId: 1, action: 1 }`.
- Order-based co-purchase recommendations will require order aggregation indexes and eventually precomputation.

Recommended scaling path:

1. Request-time simple engine for MVP.
2. Add cached recommendation response per user for 5-15 minutes.
3. Create precomputed product statistics:
   - trending scores
   - conversion rate
   - average rating
   - purchase count
   - wishlist count
4. Create precomputed user profiles:
   - category/subcategory affinity
   - price range
   - vendor affinity
   - recent intent terms
5. Create batch co-occurrence tables:
   - frequently bought together
   - also viewed
   - also wishlisted
6. Add offline vector similarity for product-to-product recommendations.

## 10. Security Analysis

Critical issues:

- `POST /api/interactions/log` is unauthenticated.
- The endpoint accepts `userId` from the client instead of using `req.userId`.
- The endpoint accepts `price` from the client, which can poison analytics.
- No product existence validation.
- No action validation beyond Mongoose enum.
- No rate limiting or throttling for interaction spam.

Important issues:

- Recommendation endpoint requires auth, but controller includes guest fallback that cannot normally be reached.
- Search endpoints use regex from user input. This should be escaped to reduce regex injection/performance risk.
- Product and recommendation APIs should project only needed public fields.
- Debug logs expose noisy operational details and may include sensitive tokens or payment data in logs.

Recommended security changes:

1. Add `isAuthenticated` to interaction route.
2. Remove `userId` from interaction request body.
3. Derive `userId` from JWT middleware.
4. Validate `productId` as ObjectId where required.
5. Fetch product price server-side if price is needed.
6. Add rate limiting for high-volume events.
7. Add event dedupe windows for repeated impressions/views.
8. Escape search regex input.
9. Add server-side recommendation impression/click attribution with signed module IDs or trusted backend-generated metadata.

## 11. Technical Debt

- `STRATEGY_WEIGHTS` is declared but unused.
- Action weights are duplicated.
- `UserActivity` duplicates part of `Interaction` and appears unused.
- Recommendation response uses `any[]`.
- Product types differ between frontend/backend and omit fields used in pages.
- Recommendation API has only one coarse endpoint.
- Product detail implements local related products instead of using a backend recommendation type.
- Search history and interaction logs are separate systems.
- Orders and payments do not write canonical recommendation events.
- Wishlist does not write recommendation events.
- No recommendation tests.
- No ranking explainability or debug output.
- No analytics feedback loop for recommendation modules.
- No cold-start strategy beyond newest products.
- No guest/session recommendation system.

## 12. Phase-by-Phase Implementation Roadmap

### Phase 0: Stabilize Tracking and Data Integrity

Goal: make existing recommendation data trustworthy.

Tasks:

- Secure `POST /api/interactions/log` with `isAuthenticated`.
- Derive `userId` from auth middleware.
- Validate `productId`, `action`, `quantity`, and event metadata.
- Fetch trusted product fields server-side.
- Add wishlist actions to canonical interaction schema.
- Log product detail page view on page load.
- Log product detail add-to-cart.
- Log cart remove and quantity changes.
- Log checkout start.
- Log purchase events when orders are created or payment is verified.
- Log search queries to `Interaction.metadata.searchQuery`.
- Keep `User.searchHistory` for UI, but treat `Interaction` as the analytics source.
- Create a shared `ACTION_WEIGHTS` constant.

Expected impact:

- Better personalization immediately.
- Safer analytics.
- Current engine starts receiving real purchase and wishlist intent.

### Phase 1: Expand Recommendation API Surface

Goal: support placements without frontend hacks.

Add endpoints:

- `GET /api/recommendations/home`
- `GET /api/recommendations/product/:productId`
- `GET /api/recommendations/cart`
- `GET /api/recommendations/wishlist`
- `GET /api/recommendations/search?keyword=`
- `GET /api/recommendations/category/:category`

Response shape per module:

- `moduleId`
- `type`
- `title`
- `subtitle`
- `products`
- `reason`
- `strategy`

Expected impact:

- Product detail can replace local related logic.
- Cart/wishlist/search/category can render context-specific modules.
- Frontend can track module impressions and clicks.

### Phase 2: Improve Ranking Quality

Goal: move from category-only personalization to multi-signal ranking.

Add user profile dimensions:

- category affinity
- subcategory affinity
- vendor affinity
- price band affinity
- wishlist affinity
- search term affinity
- purchase affinity
- negative signals from removals/cancellations/low ratings

Add product scoring dimensions:

- base relevance
- trend score
- rating score
- conversion score
- inventory score
- freshness score
- price-fit score
- diversity penalty
- already-seen penalty

Recommended scoring formula:

`score = relevance + intent + popularity + quality + freshness + inventory - penalties`

Expected impact:

- More relevant products.
- Less repetition.
- Better cold-start handling.

### Phase 3: Product-to-Product and Cart Recommendations

Goal: increase product detail and cart conversion.

Build:

- Similar products by category/subcategory/price/vendor/text/image embeddings.
- Frequently bought together from orders.
- Also viewed from interactions.
- Also wishlisted from wishlist events.
- Complementary category rules for fashion/styling.

Placements:

- Product Detail: similar, frequently bought together, complete the look.
- Cart: complete your bag, add-ons.
- Checkout: small last-minute additions.

Expected impact:

- Higher average order value.
- Lower product detail bounce.

### Phase 4: Analytics Feedback Loop

Goal: measure and optimize recommendations.

Add events:

- recommendation impression
- recommendation click
- recommendation add-to-cart
- recommendation purchase

Track metrics:

- CTR by module
- add-to-cart rate by module
- conversion rate by module
- revenue per recommendation module
- diversity coverage
- out-of-stock recommendation rate
- repeat exposure rate

Build dashboards:

- Admin recommendation performance.
- Vendor product recommendation contribution.

Expected impact:

- Ranking can be tuned using business outcomes.

### Phase 5: Precomputation and Scale

Goal: support larger traffic and catalogs.

Add scheduled jobs:

- product popularity table
- trending by category/subcategory
- co-purchase matrix
- also-viewed matrix
- product similarity matrix
- user profile snapshots

Add caching:

- per-user home recommendations
- per-product product detail recommendations
- global trending
- category trending

Expected impact:

- Lower request latency.
- Predictable database load.
- Easier ranking experimentation.

## 13. Recommendation Feature Matrix

| Feature | Business value | Complexity | Priority | Required data | Frontend placement |
|---|---:|---:|---:|---|---|
| Recommended For You | High | Medium | P0 | Interactions, cart, wishlist, orders, reviews, search history, product metadata | Home, Profile, empty Cart, empty Wishlist |
| Recently Viewed | Medium | Low | P0 | Product views/clicks, stock | Home, Product Detail footer, Cart empty state, Profile |
| Trending Now | Medium | Low | P0 | Weighted interactions, purchases, time window, stock | Home, Search, Category, guest landing |
| Similar Products | High | Medium | P0 | Product category, subcategory, price, vendor, embeddings | Product Detail, Search no-results, Category fallback |
| Frequently Bought Together | High | Medium/High | P0 | Orders, product pairs, stock, price | Product Detail, Cart |
| Cart Add-Ons | High | Medium | P0 | Cart items, co-purchase, complementary rules, stock | Cart, Checkout |
| Based On Search | High | Medium | P1 | Search history, search clicks, query embeddings | Search menu, Listing, Home |
| Trending In Category | High | Medium | P1 | Category-filtered interactions/orders | Category, Search category results |
| Because You Wishlisted | Medium/High | Medium | P1 | Wishlist items, similar products, stock, price | Wishlist, Home, Profile |
| Complete The Look | High | Medium | P1 | Category complement rules, co-purchase, curated tags | Product Detail, Cart, Category |
| Customers Also Bought | High | Medium | P1 | Orders, non-cancelled purchase events | Product Detail, Cart, Orders |
| Buy Again | Medium | Low/Medium | P2 | Orders, purchase recency, replenishable categories | Profile, My Orders |
| Top Rated | Medium | Low | P2 | Reviews, average rating, review count, stock | Home, Category, Search no-results |
| New Arrivals For You | Medium | Low/Medium | P2 | Product createdAt, user affinity | Home, Category, Profile |
| Vendor/Store Picks | Medium | Medium | P2 | Vendor affinity, vendor catalog, vendor performance | Product Detail seller area, Category, Profile |

## Final Recommendation Score

**4/10**

The system has a real starting architecture and usable components, but it is not yet a complete recommendation platform. The next model or engineer should focus first on trustworthy event capture, purchase/wishlist/search signal integration, and context-specific frontend placements. Once those are fixed, the existing hybrid engine can evolve into a stronger multi-signal ranking service without needing a full rewrite.
