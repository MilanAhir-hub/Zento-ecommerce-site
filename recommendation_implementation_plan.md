# Recommendation System Implementation Plan

This implementation plan breaks the entire recommendation system upgrade into small, independent, and sequential tickets. Each ticket is designed to be fully self-contained so that different AI agents or engineers can pick up the work sequentially without loss of context.

---

## Phase 0: Tracking & Data Integrity (P0)

Stabilize event tracking, secure endpoints, eliminate payload tampering, and capture user actions (wishlist, checkout, order placement, search) to feed the recommendation models.

### Ticket 0.1: Secure Interaction Logging Endpoint
- **Objective**: Protect `/api/interactions/log` route from forged event submissions by enforcing authentication and extracting `userId` from the JWT middleware instead of the client request body.
- **Files to modify**:
  - [server/routes/interaction.routes.ts](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/server/routes/interaction.routes.ts)
  - [server/controllers/interaction.controller.ts](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/server/controllers/interaction.controller.ts)
  - [client/src/services/interaction.api.ts](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/client/src/services/interaction.api.ts)
  - [client/src/hooks/useInteractionLogger.ts](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/client/src/hooks/useInteractionLogger.ts)
- **Backend changes**:
  - Import the `isAuthenticated` authentication middleware in [interaction.routes.ts](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/server/routes/interaction.routes.ts).
  - Apply `isAuthenticated` middleware to the `router.post('/log', ...)` route.
  - Update `logInteraction` in [interaction.controller.ts](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/server/controllers/interaction.controller.ts) to read `userId` from `req.userId` (set by middleware) and reject requests if not set.
- **Frontend changes**:
  - Update `InteractionData` interface in [interaction.api.ts](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/client/src/services/interaction.api.ts) to omit the `userId` field.
  - In [useInteractionLogger.ts](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/client/src/hooks/useInteractionLogger.ts), remove the insertion of `userId: user._id` in the logged payload.
- **Dependencies**: None.
- **Testing checklist**:
  - [ ] Requesting `POST /api/interactions/log` without a bearer token returns a `401 Unauthorized` status.
  - [ ] Logging an interaction with a valid auth token successfully returns `201 Created` and stores the interaction.
  - [ ] Verify that stored interaction documents in Mongoose contain the matching authenticated user's ID.
- **Estimated difficulty**: Easy

---

### Ticket 0.2: Server-Side Price & Product Validation
- **Objective**: Prevent client-side price manipulation and invalid records by validating product existence and looking up product price on the server side.
- **Files to modify**:
  - [server/controllers/interaction.controller.ts](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/server/controllers/interaction.controller.ts)
  - [client/src/services/interaction.api.ts](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/client/src/services/interaction.api.ts)
- **Backend changes**:
  - Add validation to check if `productId` is a valid Mongoose ObjectId.
  - Query [Product.ts](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/server/models/Product.ts) by `productId` to ensure it exists. Return `404 Product not found` if missing.
  - Retrieve the product's actual price from the DB and assign it to the interaction record. Do not accept client-provided price.
  - Validate that `action` is one of the allowed interaction strings.
- **Frontend changes**:
  - Update the client API functions in [interaction.api.ts](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/client/src/services/interaction.api.ts) to remove the `price` field from the request payload.
- **Dependencies**: Ticket 0.1
- **Testing checklist**:
  - [ ] Requesting log with non-existent `productId` returns `404` or `400`.
  - [ ] Check DB record after logging a click and verify the recorded price exactly matches the product's actual price in the database.
- **Estimated difficulty**: Easy

---

### Ticket 0.3: Centralize Recommendation Action Weights
- **Objective**: Eradicate weight definition duplication between `scoringEngine.ts` and `trending.ts` by establishing a single centralized source of truth.
- **Files to modify**:
  - [server/constants/recommendation.ts](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/server/constants/recommendation.ts) (NEW)
  - [server/services/recommendation/scoringEngine.ts](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/server/services/recommendation/scoringEngine.ts)
  - [server/services/recommendation/trending.ts](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/server/services/recommendation/trending.ts)
- **Backend changes**:
  - Create [server/constants/recommendation.ts](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/server/constants/recommendation.ts) and export an `ACTION_WEIGHTS` map containing: `view: 1`, `click: 2`, `add_to_cart: 3`, `remove_from_cart: -1`, `checkout: 4`, `purchase: 5`, `wishlist_add: 3`, `wishlist_remove: -3`.
  - Refactor [scoringEngine.ts](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/server/services/recommendation/scoringEngine.ts) and [trending.ts](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/server/services/recommendation/trending.ts) to import and use `ACTION_WEIGHTS`.
- **Frontend changes**: None.
- **Dependencies**: None.
- **Testing checklist**:
  - [ ] Run backend tests or request recommendations; verify no crashes occur.
  - [ ] Verify both scoring calculations still result in identical weights applied to existing fields.
- **Estimated difficulty**: Easy

---

### Ticket 0.4: Extend Interaction Schema for Wishlist Actions
- **Objective**: Expand the `Interaction` schema to support wishlist actions so user interest profiles can consume wishlist events.
- **Files to modify**:
  - [server/models/Interaction.ts](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/server/models/Interaction.ts)
  - [client/src/services/interaction.api.ts](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/client/src/services/interaction.api.ts)
- **Backend changes**:
  - Extend the `action` field enum in [Interaction.ts](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/server/models/Interaction.ts) to accept `'wishlist_add'` and `'wishlist_remove'`.
- **Frontend changes**:
  - In [interaction.api.ts](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/client/src/services/interaction.api.ts), expand the `action` type union to include `'wishlist_add'` and `'wishlist_remove'`.
- **Dependencies**: Ticket 0.3
- **Testing checklist**:
  - [ ] Directly save an interaction with `action: 'wishlist_add'` and verify validation passes and database writes successfully.
- **Estimated difficulty**: Easy

---

### Ticket 0.5: Product Detail Views and Add-to-Cart Tracking
- **Objective**: Track and log actual product details views and add-to-cart clicks from the detail page instead of only tracking list-card interactions.
- **Files to modify**:
  - [client/src/pages/products/ProductDetail.tsx](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/client/src/pages/products/ProductDetail.tsx)
- **Backend changes**: None.
- **Frontend changes**:
  - Import the `useInteractionLogger` hook in [ProductDetail.tsx](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/client/src/pages/products/ProductDetail.tsx).
  - Add a `useEffect` triggered on component mount/`productId` load to log a `'view'` interaction.
  - Inside the "Add to Cart" button's click handler, invoke the logger to log an `'add_to_cart'` interaction.
- **Dependencies**: Ticket 0.2
- **Testing checklist**:
  - [ ] Opening a product page logs a `'view'` event in the network tab and updates DB.
  - [ ] Clicking "Add to Cart" logs an `'add_to_cart'` event in the DB.
- **Estimated difficulty**: Easy

---

### Ticket 0.6: Track Cart Changes and Wishlist Actions
- **Objective**: Track interactions for user actions like deleting items from cart, modifying quantities, and editing wishlist items.
- **Files to modify**:
  - [client/src/pages/cart/Cart.tsx](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/client/src/pages/cart/Cart.tsx)
  - [client/src/pages/user/WishList.tsx](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/client/src/pages/user/WishList.tsx)
- **Backend changes**: None.
- **Frontend changes**:
  - Integrate `useInteractionLogger` hook into the Wishlist and Cart pages.
  - Log `'wishlist_add'` and `'wishlist_remove'` events in the wishlist modification actions.
  - Log `'remove_from_cart'` when a user deletes a cart entry.
- **Dependencies**: Ticket 0.4, Ticket 0.5
- **Testing checklist**:
  - [ ] Removing a product from Cart triggers a log payload with `action: 'remove_from_cart'`.
  - [ ] Toggling product wishlist status sends correct `wishlist_add`/`wishlist_remove` actions.
- **Estimated difficulty**: Easy

---

### Ticket 0.7: Write Purchase Interactions on Order Creation
- **Objective**: Log backend-driven `'purchase'` interaction records when orders are successfully processed, resolving the current gap where purchases are never logged to `Interaction`.
- **Files to modify**:
  - [server/services/order.service.ts](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/server/services/order.service.ts)
- **Backend changes**:
  - Import `Interaction` model in [order.service.ts](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/server/services/order.service.ts).
  - In `createOrdersFromCart`, after successfully saving the order documents, iterate through the order items.
  - Insert one `Interaction` document per item with `action: 'purchase'`, `productId`, `userId`, `quantity`, and product `price`.
- **Frontend changes**: None.
- **Dependencies**: Ticket 0.2
- **Testing checklist**:
  - [ ] Perform a successful checkout in the app.
  - [ ] Verify that purchase interaction records match the ordered quantity and prices in the database.
- **Estimated difficulty**: Medium

---

### Ticket 0.8: Log Search Queries and Search Clicks
- **Objective**: Log interaction records whenever users execute a search query and click a product within the search listings.
- **Files to modify**:
  - [client/src/components/navbar/SearchMenu.tsx](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/client/src/components/navbar/SearchMenu.tsx)
  - [client/src/pages/products/Listing.tsx](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/client/src/pages/products/Listing.tsx)
- **Backend changes**:
  - Ensure that the [Interaction.ts](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/server/models/Interaction.ts) metadata schema supports storing query fields if necessary.
- **Frontend changes**:
  - In [SearchMenu.tsx](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/client/src/components/navbar/SearchMenu.tsx), call interaction logger upon search query submit: `log({ productId, action: 'search_query', metadata: { searchQuery: query } })` (with product ID set to null or a dummy identifier).
  - In [Listing.tsx](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/client/src/pages/products/Listing.tsx), if loaded with a search term, call interaction logger with `action: 'click'` and `metadata: { source: 'search' }` when clicking a listing card.
- **Dependencies**: Ticket 0.5
- **Testing checklist**:
  - [ ] Searching "shoes" logs an interaction with `action: 'search_query'` and metadata search query string.
  - [ ] Clicking a product in the search results; verify a click interaction is recorded.
- **Estimated difficulty**: Medium

---

## Phase 1: Contextual Placements and API Surface (P1)

Upgrade the backend controller routes from a single coarse recommendations endpoint to a series of specific endpoints targeting contextual spots across the user interface.

### Ticket 1.1: Define Unified Recommendation DTOs
- **Objective**: Standardize recommendation API response shapes to ensure type safety and consistent rendering patterns.
- **Files to modify**:
  - [server/types/recommendation.ts](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/server/types/recommendation.ts) (NEW)
  - [client/src/services/recommendation.api.ts](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/client/src/services/recommendation.api.ts)
- **Backend changes**:
  - Create types definitions file declaring:
    ```typescript
    export interface RecommendationModule {
      moduleId: string;
      type: 'recommended_for_you' | 'similar' | 'frequently_bought_together' | 'trending' | 'recently_viewed';
      title: string;
      subtitle: string;
      products: any[];
      reason?: string;
      strategy: string;
    }
    ```
- **Frontend changes**:
  - Update `RecommendationData` in [recommendation.api.ts](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/client/src/services/recommendation.api.ts) to match the `RecommendationModule[]` return type.
- **Dependencies**: None.
- **Testing checklist**:
  - [ ] Verify that TypeScript types check successfully on both backend and frontend build commands.
- **Estimated difficulty**: Easy

---

### Ticket 1.2: Context-Specific Backend Routes and Controllers
- **Objective**: Declare and implement dedicated routes/handlers for contextual recommendation calls.
- **Files to modify**:
  - [server/routes/recommendation.routes.ts](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/server/routes/recommendation.routes.ts)
  - [server/controllers/recommendation.controller.ts](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/server/controllers/recommendation.controller.ts)
- **Backend changes**:
  - Add the following routes in [recommendation.routes.ts](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/server/routes/recommendation.routes.ts):
    - `GET /api/recommendations/home`
    - `GET /api/recommendations/product/:productId`
    - `GET /api/recommendations/cart`
    - `GET /api/recommendations/wishlist`
    - `GET /api/recommendations/search`
    - `GET /api/recommendations/category/:category`
  - In [recommendation.controller.ts](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/server/controllers/recommendation.controller.ts), define the corresponding controllers. In the initial stage, have these return structured response fallbacks using the current hybrid engine services.
- **Frontend changes**: None.
- **Dependencies**: Ticket 1.1
- **Testing checklist**:
  - [ ] Make GET requests to all new endpoints and ensure they return structured `RecommendationModule` JSON shapes with a status code of `200`.
- **Estimated difficulty**: Medium

---

### Ticket 1.3: Frontend API Services and Queries
- **Objective**: Implement React Query hooks for fetching data from the newly created recommendation endpoints.
- **Files to modify**:
  - [client/src/services/recommendation.api.ts](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/client/src/services/recommendation.api.ts)
  - Create hooks files:
    - `client/src/hooks/useHomeRecommendations.ts` (NEW)
    - `client/src/hooks/useProductRecommendations.ts` (NEW)
    - `client/src/hooks/useCartRecommendations.ts` (NEW)
    - `client/src/hooks/useWishlistRecommendations.ts` (NEW)
    - `client/src/hooks/useCategoryRecommendations.ts` (NEW)
- **Backend changes**: None.
- **Frontend changes**:
  - Implement request fetching wrapper functions in [recommendation.api.ts](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/client/src/services/recommendation.api.ts) for all endpoints.
  - Implement caching React hooks using React Query `useQuery` configurations with separate query keys (`['recommendations', 'home']`, `['recommendations', 'product', productId]`, etc.).
- **Dependencies**: Ticket 1.2
- **Testing checklist**:
  - [ ] Verify query caching is active; calling hooks multiple times only hits the network once per staletime window.
- **Estimated difficulty**: Easy

---

### Ticket 1.4: Contextual Widgets on Product Detail Page
- **Objective**: Integrate product-specific recommendation lists on the Product Detail page, replacing the naive category-fetch fallback.
- **Files to modify**:
  - [client/src/pages/products/ProductDetail.tsx](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/client/src/pages/products/ProductDetail.tsx)
- **Backend changes**: None.
- **Frontend changes**:
  - Import and call `useProductRecommendations(productId)` inside [ProductDetail.tsx](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/client/src/pages/products/ProductDetail.tsx).
  - Replace the current local related product loading logic with the returned recommendation modules (Similar Products and Frequently Bought Together).
- **Dependencies**: Ticket 1.3
- **Testing checklist**:
  - [ ] Opening a product detail page displays correct recommendations sections below the main item.
- **Estimated difficulty**: Medium

---

### Ticket 1.5: Contextual Widgets on Cart Page
- **Objective**: Render recommendation widgets in the Cart page representing relevant check-out add-ons, plus fallbacks when the cart is empty.
- **Files to modify**:
  - [client/src/pages/cart/Cart.tsx](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/client/src/pages/cart/Cart.tsx)
- **Backend changes**: None.
- **Frontend changes**:
  - Call `useCartRecommendations()` inside [Cart.tsx](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/client/src/pages/cart/Cart.tsx).
  - Add a "Complete Your Order" card section containing recommended cross-sells at the bottom of the active cart items listing.
  - If the cart is empty, show a full-width recommended product slider.
- **Dependencies**: Ticket 1.3
- **Testing checklist**:
  - [ ] Add item to cart; check that cart recommendations widget lists appropriate cross-sell products.
  - [ ] Clear cart; check that the empty cart recommendation grid displays.
- **Estimated difficulty**: Medium

---

### Ticket 1.6: Contextual Widgets on Wishlist Page
- **Objective**: Render contextual widgets on the Wishlist page based on user wishlists or show recommended grids when empty.
- **Files to modify**:
  - [client/src/pages/user/WishList.tsx](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/client/src/pages/user/WishList.tsx)
- **Backend/Frontend changes**:
  - Frontend: Import `useWishlistRecommendations()` in [WishList.tsx](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/client/src/pages/user/WishList.tsx).
  - Render a "Based on your Wishlist" list at the bottom of the page.
- **Dependencies**: Ticket 1.3
- **Testing checklist**:
  - [ ] Wishlist page renders relevant items recommendations when loaded.
- **Estimated difficulty**: Medium

---

### Ticket 1.7: Contextual Widget on Search & Listing Pages
- **Objective**: Display popular or trending fallback recommendations when search returns no matching queries.
- **Files to modify**:
  - [client/src/pages/products/Listing.tsx](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/client/src/pages/products/Listing.tsx)
- **Backend/Frontend changes**:
  - Frontend: Invoke search query recommendation hooks in [Listing.tsx](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/client/src/pages/products/Listing.tsx).
  - When the search yields zero matching products, render a fallback section labeled "We couldn't find matches. Here are some trending products you might like".
- **Dependencies**: Ticket 1.3
- **Testing checklist**:
  - [ ] Querying a random string (e.g. "xyzabc") displays the zero-results state containing the recommendation block.
- **Estimated difficulty**: Medium

---

### Ticket 1.8: Category-Specific Recommendations Integration
- **Objective**: Replace local sliced items lists inside category views with actual trending and recommended category products.
- **Files to modify**:
  - [client/src/pages/category/CategoryPage.tsx](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/client/src/pages/category/CategoryPage.tsx)
- **Backend/Frontend changes**:
  - Frontend: Import and use `useCategoryRecommendations(categoryName)` inside [CategoryPage.tsx](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/client/src/pages/category/CategoryPage.tsx).
  - Map sections like "Trending In This Category" using the recommendation module response rather than simple page items slicing.
- **Dependencies**: Ticket 1.3
- **Testing checklist**:
  - [ ] Opening any category page renders recommendations belonging strictly to that category.
- **Estimated difficulty**: Medium

---

## Phase 2: Personalization & Ranking Quality (P2)

Incorporate multi-signal relevance scoring that replaces simple category matches with advanced scoring logic based on multiple behavioral variables.

### Ticket 2.1: User Affinity Profile Enrichment
- **Objective**: Aggregate user interactions (clicks, views, cart additions, purchases, wishlists) to construct a detailed affinity profile.
- **Files to modify**:
  - [server/services/recommendation/scoringEngine.ts](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/server/services/recommendation/scoringEngine.ts)
- **Backend changes**:
  - Create a function `getUserAffinityProfile(userId: string)` in [scoringEngine.ts](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/server/services/recommendation/scoringEngine.ts).
  - Query the last 200 interaction logs for the user.
  - Calculate user affinity maps (category, subcategory, vendor, and price band ratios) using the defined `ACTION_WEIGHTS`.
  - Exclude or apply negative scores for negative actions (such as product cart removal or low review ratings).
- **Frontend changes**: None.
- **Dependencies**: Ticket 0.3, Ticket 0.6
- **Testing checklist**:
  - [ ] Write integration test verifying user interactions mapping translates into a valid weighted profile object.
- **Estimated difficulty**: Medium

---

### Ticket 2.2: Multi-Signal Product Scoring Engine
- **Objective**: Develop a comprehensive ranking function that scores candidate products using affinities, trending signals, ratings, and fresh inventory variables.
- **Files to modify**:
  - [server/services/recommendation/scoringEngine.ts](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/server/services/recommendation/scoringEngine.ts)
- **Backend changes**:
  - Create function `scoreProducts(products: IProduct[], profile: UserAffinityProfile): ScoredProduct[]`.
  - Calculate scores based on the formula:
    `score = relevance(category/subcategory fit) + vendor_fit + price_fit + trending_weight + rating_score + stock_factor - already_purchased_penalty`
  - Ensure products that are out of stock get penalized or excluded.
- **Frontend changes**: None.
- **Dependencies**: Ticket 2.1
- **Testing checklist**:
  - [ ] Verify that items matching the user's favorite category and price range receive higher scores compared to unrelated items.
- **Estimated difficulty**: Medium

---

### Ticket 2.3: Hybrid Merger and Diversity Controllers
- **Objective**: Restructure the recommendation engine to merge candidates, apply diversity filters, and enforce exclusion lists.
- **Files to modify**:
  - [server/services/recommendation/hybridEngine.ts](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/server/services/recommendation/hybridEngine.ts)
- **Backend changes**:
  - Update `getHybridRecommendations` to fetch user profiles and rank combined candidate lists using `scoreProducts`.
  - Apply diversity filters to limit consecutive items from the same category or vendor (e.g. maximum of 3 same-category products in a single row).
  - Filter out already viewed, carted, or purchased products as required by recommendation configuration settings.
- **Dependencies**: Ticket 2.2
- **Testing checklist**:
  - [ ] Confirm recommendations lists contains varied categories and avoid repeating the exact same brand/category continuously.
- **Estimated difficulty**: Medium

---

## Phase 3: Co-Occurrence and Advanced Similarity (P3)

Introduce product-to-product algorithms like text/metadata similarities and transactional co-purchase patterns.

### Ticket 3.1: Metadata & Text Similarity Calculator
- **Objective**: Implement product-to-product similarity calculation using categories, subcategories, price differences, and title/description metadata.
- **Files to modify**:
  - [server/services/recommendation/similarity.ts](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/server/services/recommendation/similarity.ts) (NEW)
  - [server/controllers/recommendation.controller.ts](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/server/controllers/recommendation.controller.ts)
- **Backend changes**:
  - Implement a similarity ranking algorithm in `similarity.ts` that takes a target product and returns similar products based on overlapping categories, subcategory matching, and price proximity.
  - Wire this engine into the `GET /api/recommendations/product/:productId` route handler.
- **Dependencies**: Ticket 1.2
- **Testing checklist**:
  - [ ] Test similarity API for a shirt; verify recommendations consist mostly of other shirts or clothing items within the same price bucket.
- **Estimated difficulty**: Medium

---

### Ticket 3.2: Co-Purchase Analytics (Frequently Bought Together)
- **Objective**: Calculate frequently bought together associations by analyzing historical checkout orders data.
- **Files to modify**:
  - [server/services/recommendation/coPurchase.ts](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/server/services/recommendation/coPurchase.ts) (NEW)
- **Backend changes**:
  - Implement a co-purchase mining service.
  - Query the [Order.ts](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/server/models/Order.ts) collection to identify products frequently bought in the same transactions.
  - Expose a method `getCoPurchasedProducts(productId: string, limit: number)` with fallback to category complementary rules.
- **Dependencies**: Ticket 0.7
- **Testing checklist**:
  - [ ] Create mock transactions holding product A and B. Query co-purchases for A; verify B is returned.
- **Estimated difficulty**: Medium

---

### Ticket 3.3: Cart Cross-Sell Optimizer
- **Objective**: Feed cart page requests with highly contextual cross-sell items matching the active cart contents, filtered by price limits.
- **Files to modify**:
  - [server/services/recommendation/cartCrossSell.ts](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/server/services/recommendation/cartCrossSell.ts) (NEW)
  - [server/controllers/recommendation.controller.ts](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/server/controllers/recommendation.controller.ts)
- **Backend changes**:
  - Implement cart cross-sell builder inside `cartCrossSell.ts`.
  - Fetch active items in the cart. Calculate co-purchase pairs for all cart contents.
  - Exclude items already in the cart.
  - Filter results to only include low-friction impulse purchases (e.g. items priced under $30) and confirm stock is available.
  - Link this builder with the `GET /api/recommendations/cart` controller.
- **Dependencies**: Ticket 1.2, Ticket 3.2
- **Testing checklist**:
  - [ ] Add item A to cart. Request cart recommendations; verify item B is returned.
- **Estimated difficulty**: Medium

---

## Phase 4: Feedback Loop & Performance Monitoring (P4)

Introduce metric tracking to evaluate click-through-rates and conversion ratios of recommendation features.

### Ticket 4.1: Recommendation Source and Attribution Tracking
- **Objective**: Track which recommendation module successfully drove impressions, clicks, cart adds, or purchase events.
- **Files to modify**:
  - [server/models/Interaction.ts](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/server/models/Interaction.ts)
  - [client/src/hooks/useInteractionLogger.ts](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/client/src/hooks/useInteractionLogger.ts)
  - Frontend landing modules:
    - [Recommended.tsx](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/client/src/sections/Landing/Recommended.tsx)
    - [TrendingProducts.tsx](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/client/src/sections/Landing/TrendingProducts.tsx)
    - [RecentlyViewed.tsx](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/client/src/sections/Landing/RecentlyViewed.tsx)
- **Backend changes**:
  - Extend the `metadata` object in the `Interaction` schema to include `recommendationModuleId` and `recommendationType`.
- **Frontend changes**:
  - Update recommendation rendering sections to pass down their unique recommendation type identifiers down to `ProductCard`.
  - Ensure that when product cards inside recommendation lists are clicked or added to cart, the interaction logger adds metadata containing the originating recommendation module.
- **Dependencies**: Ticket 0.6, Ticket 0.8
- **Testing checklist**:
  - [ ] Click a product in "Trending Now" list; verify that the generated `Interaction` database record contains `metadata.recommendationType = 'trending'`.
- **Estimated difficulty**: Medium

---

### Ticket 4.2: Admin Dashboard Aggregates for CTR & Conversion
- **Objective**: Provide aggregate metrics indicating the performance of recommendation widgets.
- **Files to modify**:
  - [server/controllers/admin.controller.ts](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/server/controllers/admin.controller.ts)
  - [server/routes/admin.routes.ts](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/server/routes/admin.routes.ts)
- **Backend changes**:
  - Define route `GET /api/admin/analytics/recommendations`.
  - In [admin.controller.ts](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/server/controllers/admin.controller.ts), build MongoDB aggregations summing views, clicks, cart-adds, and purchases matching various `metadata.recommendationType` tags.
  - Calculate CTR (Clicks / Impressions) and CVR (Purchases / Clicks) per module.
- **Dependencies**: Ticket 4.1
- **Testing checklist**:
  - [ ] Fetch the analytics endpoint; verify data maps correctly showing total CTR statistics.
- **Estimated difficulty**: Medium

---

## Phase 5: Production Performance & Caching (P5)

Optimize the backend for scale, caching expensive lookups, and offloading heavy aggregation logic to scheduled background tasks.

### Ticket 5.1: Request-Level Cache Layer for Home & Detail Widgets
- **Objective**: Establish cache storage to protect database servers from handling heavy request-time lookups on home and product detail pages.
- **Files to modify**:
  - [server/services/recommendation/cache.ts](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/server/services/recommendation/cache.ts) (NEW)
  - [server/services/recommendation/hybridEngine.ts](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/server/services/recommendation/hybridEngine.ts)
- **Backend changes**:
  - Create a simple in-memory cache or Redis helper inside `cache.ts`.
  - Modify recommendation controllers to read/write from cache.
  - Cache home recommendations for 5 minutes (invalidate when user updates wishlist or adds items to cart).
  - Cache product similarity lists for 1 hour.
- **Dependencies**: Ticket 2.3, Ticket 3.1
- **Testing checklist**:
  - [ ] Trigger two calls to recommendations endpoint; check logs to verify the second call bypasses Mongoose database queries.
- **Estimated difficulty**: Medium

---

### Ticket 5.2: Cron Job for Precomputed Product Stats and Affinity Snapshots
- **Objective**: Build scheduled jobs that calculate trending stats and user profiles asynchronously to speed up request-time response times.
- **Files to modify**:
  - [server/scripts/computeStats.ts](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/server/scripts/computeStats.ts) (NEW)
  - [server/models/ProductStats.ts](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/server/models/ProductStats.ts) (NEW)
- **Backend changes**:
  - Create a Mongoose schema `ProductStats` storing variables like global conversion rates, average ratings, and trend score numbers per product.
  - Develop a script `computeStats.ts` that runs every 6 hours to precompute and write these stats.
  - Modify the recommendation engine to read scoring statistics from `ProductStats` instead of running aggregates on the raw `Interaction` collections on every request.
- **Dependencies**: Ticket 2.2, Ticket 5.1
- **Testing checklist**:
  - [ ] Manually execute the precomputation script; check that product stats tables are populated.
  - [ ] Verify recommendation load queries now run instantly from the stats index.
- **Estimated difficulty**: Hard
