# Responsive Preserve UI

Desktop design is the source of truth.

NEVER redesign the website.

NEVER change:

* Desktop spacing
* Desktop typography
* Desktop colors
* Desktop animations
* Desktop layout
* Desktop component structure

Allowed changes:

* Add responsive classes
* Add breakpoints
* Add overflow handling
* Add mobile navigation
* Add mobile menu
* Add responsive grids
* Add responsive flex layouts
* Add responsive typography only on small screens

Rules:

Desktop (1024px+) must remain visually identical.

All fixes must be applied primarily below:

* 1024px
* 768px
* 640px

Prefer:

flex-col md:flex-row

instead of changing desktop layouts.

Prefer:

grid-cols-1 md:grid-cols-2 lg:grid-cols-4

instead of redesigning grids.

Never remove existing desktop styles.

Before editing any file:

1. Inspect desktop behavior.
2. Preserve desktop behavior.
3. Add only mobile and tablet adaptations.

If desktop changes visually, revert and try another solution.
