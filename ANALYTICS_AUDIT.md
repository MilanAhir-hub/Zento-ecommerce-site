# Analytics Audit

Date: 2026-06-16

Scope: full project scan of the React client and Express/Mongoose server, focused on analytics collection, dashboard metrics, recommendation telemetry, payments/orders, and data model readiness. No implementation code was changed.

## Executive Summary

The project has the beginnings of an analytics system: vendor/admin dashboard endpoints, an `Interaction` event model, recommendation engines that consume events, and order/payment models. The main issue is that the system is not yet a dependable analytics pipeline. Several metrics can be wrong today because events are sparse, order status casing is inconsistent, payment success does not appear to create marketplace orders, and dashboards mix live data with hardcoded presentation values.

Priority should be:

1. Fix order/payment source-of-truth gaps.
2. Normalize order statuses and analytics filters.
3. Secure and enrich interaction logging.
4. Add real aggregations for dashboard charts and trends.
5. Add indexing and validation once the metrics contract is stable.

## Current Analytics Surfaces

- Admin dashboard uses `GET /api/admin/dashboard-stats`, surfaced by `useAdminStats` and `DashboardOverview`.
- Vendor dashboard uses `GET /api/vendor/dashboard-stats` and `GET /api/vendor/top-selling-products`, surfaced by `useVendorStats`, `useVendorTopProducts`, and the vendor `Analytics` page.
- Product recommendation analytics are based on `Interaction` documents through `trending`, `recentlyViewed`, `contentBased`, `collaborative`, and `scoringEngine`.
- Client-side interaction capture currently appears only in `ProductCard`.
- Payment analytics are tracked separately in `Payment`, while commercial order analytics use `Order`.

## Critical Findings

### 1. Payment Success Does Not Appear To Create Orders

Checkout creates a Razorpay order and verifies payment, then navigates to `/user/orders`, but it does not call the user order endpoint that actually creates `Order` documents and clears inventory/cart.

Evidence:

- Client checkout calls payment APIs only: `client/src/pages/checkout/Checkout.tsx:61`, `client/src/pages/checkout/Checkout.tsx:77`, `client/src/pages/checkout/Checkout.tsx:86`.
- Payment verification only updates `Payment`: `server/controllers/payment.controller.ts:100`, `server/controllers/payment.controller.ts:109`.
- Marketplace `Order` creation lives separately in `server/controllers/user.controller.ts:444`.
- The user order route exists separately at `server/routes/user.routes.ts` via `POST /user/order`.

Impact:

- Admin/vendor revenue, top products, user order history, inventory deduction, and cart clearing can remain unchanged after a successful payment.
- Payment revenue and order revenue can diverge.
- Vendor analytics can show zero orders despite paid transactions.

Recommended next step:

- Define one atomic checkout completion flow. After verified payment, create vendor-split orders, decrement stock, clear cart, and record purchase interactions in one server-side transaction or carefully ordered backend workflow.

### 2. Admin Dashboard Status Filters Use Lowercase Values But Orders Use Title Case

The `Order` schema allows `Pending`, `Processing`, `Shipped`, `Delivered`, and `Cancelled`, but admin stats query lowercase statuses.

Evidence:

- Schema enum: `server/models/Order.ts:31`.
- Admin revenue excludes `'cancelled'`, not `'Cancelled'`: `server/controllers/admin.controller.ts:15`.
- Admin active orders checks `['pending', 'processing', 'shipped']`: `server/controllers/admin.controller.ts:18`.
- Vendor analytics correctly uses `"Cancelled"` in its revenue filter: `server/controllers/vendor.controller.ts:395`.

Impact:

- Admin `activeOrders` is likely always zero.
- Admin `totalRevenue` likely includes cancelled orders.
- Admin and vendor dashboards can disagree for the same underlying order set.

Recommended next step:

- Normalize status constants in one shared backend module and migrate all queries to the schema values.

### 3. Interaction Logging Trusts Client-Supplied User IDs And Is Unauthenticated

The interaction route accepts `userId` from the request body and does not use authentication middleware.

Evidence:

- Route has no auth middleware: `server/routes/interaction.routes.ts:7`.
- Controller reads `userId` directly from body: `server/controllers/interaction.controller.ts:6`.
- Client injects `user._id` into the event payload: `client/src/hooks/useInteractionLogger.ts:10`.

Impact:

- Any client can spoof another user's analytics events.
- Recommendation profiles can be polluted.
- Purchase-like events could be forged if the frontend sends them later.

Recommended next step:

- Make `/api/interactions/log` authenticated and derive `userId` from `req.userId`. Keep guest analytics separate if needed, using anonymous session IDs.

## High-Priority Findings

### 4. Event Coverage Is Too Sparse For Reliable Analytics

Only `ProductCard` imports `useInteractionLogger`. Direct product-detail views, checkout start, successful purchases, search events, wishlist actions, quantity changes, and removals are not consistently logged.

Evidence:

- `ProductCard` is the only client result for `useInteractionLogger`: `client/src/components/ui/ProductCard.tsx:5`.
- `ProductDetail` has no interaction logger import or logging call: `client/src/pages/products/ProductDetail.tsx:96`.
- The interaction schema supports `checkout`, `purchase`, and `search_query`: `server/models/Interaction.ts:14`, but the checkout path does not log them.

Impact:

- Recently viewed is incomplete because direct detail visits are not logged.
- Trending and recommendations overweight product card impressions/adds and miss high-intent events.
- Funnel analytics cannot be built from the current event stream.

Recommended next step:

- Add a lightweight analytics contract for events: `product_view`, `product_click`, `add_to_cart`, `remove_from_cart`, `checkout_started`, `payment_success`, `order_created`, `search_submitted`, `wishlist_add`, `wishlist_remove`.

### 5. Search Event Schema Exists But The API Does Not Persist Metadata

The schema has `metadata.searchQuery`, but the controller only stores `userId`, `productId`, `action`, `quantity`, and `price`.

Evidence:

- Schema metadata field: `server/models/Interaction.ts:27`.
- Controller destructures no `metadata`: `server/controllers/interaction.controller.ts:6`.

Impact:

- `search_query` events cannot carry the actual query.
- Search analytics and personalization from search terms are not currently possible through `Interaction`.

Recommended next step:

- Validate event payloads by action type and persist action-specific metadata.

### 6. Vendor Analytics Contains Hardcoded Trends And Placeholder Visualization

Vendor analytics fetches live stats and top products, but the displayed percentage trends are static and the chart is a placeholder.

Evidence:

- Hardcoded trends: `client/src/pages/vendor-dashboard/sections/vendor/Analytics.tsx:47`, `client/src/pages/vendor-dashboard/sections/vendor/Analytics.tsx:53`, `client/src/pages/vendor-dashboard/sections/vendor/Analytics.tsx:61`.
- Placeholder chart copy: `client/src/pages/vendor-dashboard/sections/vendor/Analytics.tsx:102`.

Impact:

- Users may believe trend metrics are real.
- There is no period comparison, daily sales chart, conversion rate, refund/cancellation rate, or inventory-risk analytics.

Recommended next step:

- Replace hardcoded trend values with server-provided period comparisons, or remove trend chips until real data is available.

## Medium-Priority Findings

### 7. `Interaction` And `UserActivity` Duplicate Concepts

The backend has both `Interaction` and `UserActivity`, but only `Interaction` appears wired into recommendation services and routes.

Evidence:

- `UserActivity` model exists: `server/models/UserActivity.ts`.
- Recommendation services import `Interaction`, not `UserActivity`.

Impact:

- Future contributors may write analytics into the wrong collection.
- Types can drift because `server/types/index.ts` defines a different action shape than `Interaction`.

Recommended next step:

- Choose one event model, document it, and remove or explicitly deprecate the unused model.

### 8. Analytics Queries Need Indexes On Order Dimensions

`Order` has no explicit indexes, but vendor/admin analytics query by `vendorId`, `status`, and `createdAt`.

Evidence:

- `OrderSchema` has timestamps but no `index(...)` calls: `server/models/Order.ts:17`.
- Vendor dashboard aggregates by `vendorId` and status: `server/controllers/vendor.controller.ts:395`.
- Admin dashboard counts by status: `server/controllers/admin.controller.ts:18`.

Impact:

- Dashboard requests can slow down as order volume grows.
- Top-selling aggregations will scan more data than necessary.

Recommended next step:

- Add indexes after status normalization, likely `{ vendorId: 1, status: 1, createdAt: -1 }`, `{ user: 1, createdAt: -1 }`, and `{ status: 1, createdAt: -1 }`.

### 9. Dashboard Metrics Lack Time Windows

Current admin and vendor stats are all-time totals. That is useful, but not enough for analytics.

Impact:

- No daily/weekly/monthly comparison.
- No way to calculate real trend percentages.
- No funnel or retention view.

Recommended next step:

- Add query parameters such as `from`, `to`, and `compareTo`, then return both current and comparison-period aggregates.

## Suggested Implementation Order

1. Make checkout completion produce durable `Order` records after payment verification.
2. Normalize order status values everywhere and add tests for cancelled revenue exclusion.
3. Secure `/api/interactions/log` and derive identity server-side.
4. Define a versioned event schema with action-specific metadata.
5. Expand client event capture across product detail, search, cart, checkout, purchase, and wishlist.
6. Replace hardcoded dashboard trends with real period comparisons.
7. Add order indexes and aggregation tests.
8. Decide whether `UserActivity` should be removed, migrated, or reserved for another purpose.

## Files Reviewed

- `client/src/pages/checkout/Checkout.tsx`
- `client/src/components/ui/ProductCard.tsx`
- `client/src/hooks/useInteractionLogger.ts`
- `client/src/services/interaction.api.ts`
- `client/src/services/payment.api.ts`
- `client/src/services/vendor.api.ts`
- `client/src/pages/vendor-dashboard/sections/vendor/Analytics.tsx`
- `client/src/sections/admin/DashboardOverview.tsx`
- `server/index.ts`
- `server/routes/*.ts`
- `server/controllers/admin.controller.ts`
- `server/controllers/vendor.controller.ts`
- `server/controllers/payment.controller.ts`
- `server/controllers/interaction.controller.ts`
- `server/controllers/user.controller.ts`
- `server/models/Order.ts`
- `server/models/Payment.ts`
- `server/models/Product.ts`
- `server/models/Interaction.ts`
- `server/models/UserActivity.ts`
- `server/services/recommendation/*.ts`
