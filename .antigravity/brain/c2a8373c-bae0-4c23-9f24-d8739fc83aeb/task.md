# Background Removal & Image Resize Task

- [x] Check existing models (Vendor or User) for AI usage tracking
- [x] Implement AI Usage tracking (add fields in model if needed)
- [x] Create `features.md` to document the feature's capabilities
- [x] Create external API service for remove.bg and replicate
- [x] Create AI controller for handling the request (hybrid model logic)
- [x] Map new controller to a route
- [x] Test the backend integration (or write test instructions)

## UI Implementation Tasks
- [x] Create `useImageAI` hook for background removal
- [x] Add AI Enhance button to `AddProduct.tsx` image previews
- [x] Implement loading states and error handling for image enhancement
- [x] Verify frontend-to-backend integration for image processing (Mocked)

- [x] Apply universal "Apple-style" blur overlay and background blobs to all pages
- [x] Refactor individual pages to allow background transparency
- [x] Ensure translucent blur header works across different screen sizes

## UX Enhancements
- [x] Create universal `BlurImage` component with frosted glass skeleton
- [x] Replace `<img>` tags globally across main pages with `BlurImage`

## Product Detail Layout Restructure
- [x] Reformat thumbnails into a 4-column grid
- [x] Move AI Chatboard to left column below thumbnails
- [x] Clean up right column info area

## Chatbot UX Refinements
- [x] Hide default scrollbar from chatbot
- [x] Fix page scrolling when chat updates
- [x] Cleanup unused imports in ProductDetail.tsx
- [x] Implement non-shifting, ultra-thin WhatsApp-style scrollbar (3px)

## Authentication Page Redesign
- [x] Design Login page according to Apple-inspired theme <!-- id: 26 -->
- [x] Use reusable Button component <!-- id: 27 -->
- [x] Implement consistent spacing and typography <!-- id: 28 -->
- [x] Finalize and verify the new Login layout <!-- id: 29 -->

## Vendor Dashboard Enhancements
- [x] Ensure Dashboard is automatically highlighted on entry <!-- id: 30 -->
- [x] Disable scrollbar/scrolling on vendor sidebar <!-- id: 31 -->
- [x] Fix sidebar position to truly fixed <!-- id: 32 -->
