# Brand & Design Philosophy

## Visual Style

The visual style is **Minimalist Editorial Luxury**. It treats the e-commerce interface as a high-end fashion magazine, prioritizing large, cinematic photography, generous white space, and stark typographic contrast. The UI is intentionally understated to act as a quiet frame for the products.

## Brand Personality

* **Sophisticated & Effortless:** Clean lines, zero unnecessary decorative elements.
* **Modern & Curated:** Highly structured layout that feels intentional and premium.
* **Approachable Luxury:** Elegant but highly functional and conversion-oriented.

## Target Audience

Fashion-forward individuals looking for high-quality wardrobe staples and trend-driven pieces. They value a seamless, premium shopping experience that mirrors an upscale physical boutique.

## Design Principles

1. **Photography First:** The interface must never compete with product imagery. UI borders, backgrounds, and buttons remain strictly neutral.
2. **Typographic Hierarchy as Structure:** Layout structure is defined by sharp text alignments, variable font tracking, and stark weight shifts rather than heavy background blocks or container cards.
3. **Deliberate White Space:** Generous padding around elements to give premium products "breathing room" ($32\text{px}$ to $64\text{px}$ section gaps).

---

# Color System

The color palette is strictly limited to an editorial monochromatic baseline with soft, warm neutrals reserved for specific backgrounds or structural elements.

| Token Name | Hex Value | Application |
| --- | --- | --- |
| `color-brand-black` | `#000000` | Primary text, main CTA backgrounds, header elements, active states. |
| `color-brand-white` | `#FFFFFF` | Primary page background, card surfaces, modal containers. |
| `color-gray-dark` | `#222222` | Secondary text, sub-labels, body copy. |
| `color-gray-muted` | `#767676` | Captions, breadcrumbs, placeholder text, disabled states. |
| `color-border-light` | `#E5E5E5` | Grid lines, subtle dividers, input fields borders. |
| `color-bg-neutral` | `#F9F9F9` | Micro-banned surfaces, cart drawers, soft container fills. |
| `color-accent-sale` | `#BC0000` | Markdown pricing, sale callouts (used selectively). |

## State & Interaction Rules

* **Hover State:** Interactive textual links transition from `#222222` to `#000000` with a subtle underline or slight opacity shift. Solid black buttons invert to clear or soft grey backgrounds, or slightly drop opacity to `85%`.
* **Active/Focus State:** Explicit, sharp $1\text{px}$ solid `#000000` outline around interactive components. No soft blue default browser focus outlines.
* **Light/Dark Mode:** The brand functions strictly in a curated **Light Mode** baseline. A dark mode adaptation is limited to dark-fill components (like the black promotional banner) rather than a system-wide toggle, maintaining a high-fashion editorial feel.

---

# Typography System

The typography relies on clean, high-legibility sans-serif typefaces paired with generous tracking (letter-spacing) on uppercase headings.

* **Primary System Font:** `Helvetica Neue`, `Helvetica`, `Arial`, sans-serif.
* **Brand Display Font:** Clean, customized editorial grotesque sans-serif or refined geometric sans.

## Typography Scale

| Level | Font Size | Weight | Line Height | Letter Spacing (Tracking) | Case / Style |
| --- | --- | --- | --- | --- | --- |
| **H1 (Hero Main)** | `32px` / `2rem` | Light / Regular | `1.2` | `0.05em` | Title Case |
| **H2 (Section Header)** | `20px` / `1.25rem` | Medium | `1.3` | `0.1em` | UPPERCASE |
| **H3 (Product Title)** | `14px` / `0.875rem` | Regular | `1.4` | `0.02em` | Sentence Case |
| **Navigation Link** | `13px` / `0.8125rem` | Medium / Regular | `1.2` | `0.08em` | Title Case / UPPERCASE |
| **Body / Paragraph** | `14px` / `0.875rem` | Regular | `1.5` | `0.01em` | Sentence Case |
| **UI Labels / Small** | `11px` / `0.6875rem` | Regular / Medium | `1.3` | `0.05em` | UPPERCASE |

---

# Layout System

The interface uses a flexible grid system combined with strict max-width constraints to ensure content matches an editorial rhythm across ultra-wide monitors and mobile viewports.

* **Max Container Width:** `1440px` (Centrally aligned with responsive horizontal padding).
* **Desktop Gutter / Padding:** `40px` (`24px` on smaller laptop viewports).
* **Mobile Gutter / Padding:** `16px`.

## Breakpoints

```json
{
  "xs": "375px",
  "sm": "640px",
  "md": "768px",
  "lg": "1024px",
  "xl": "1280px",
  "xxl": "1440px"
}

```

## Section & Grid Spacing

* **Section Vertical Gap:** `48px` to `64px` on desktop, scaled down to `32px` on mobile.
* **Grid Column Gap (Product Grids):** `16px` or `24px` consistent vertical/horizontal spacing to create clear structural lines.
* **Alignment Rule:** Text-heavy columns align precisely to the outer borders of image assets. No offset margins inside main templates.

---

# Component Library

## Navbar

* **Purpose:** Global application anchor houses brand identity, department taxonomy, and utility triggers.
* **Structure:** * Top Tier: Black contextual promotional banner.
* Main Tier: Centered or Left-aligned brand logo; horizontal inline link list for core categories; Right-aligned utility actions (Search, Sign In, Wishlist, Shopping Bag).


* **Dimensions:** Main navbar height is `70px` (Desktop). Promotional banner height is `35px`.
* **Styling:** Pure white background (`#FFFFFF`), fixed or sticky layout position at top of viewport. Bottom border $1\text{px}$ solid `#E5E5E5`. Text links uppercase or clear title case.
* **Hover States:** Links underline subtly or shift to full black opacity.
* **Mobile Behavior:** Compresses into a left-aligned hamburger menu trigger (`24px`), centered brand logo, and right-aligned Search and Bag icons.

## Search

* **Purpose:** Enables direct product discovery.
* **Structure:** Minimalist input bar or clean utility text trigger with inline search icon.
* **Dimensions:** Input bar expands smoothly on interaction or triggers a full-width clean overlay drop-down.
* **Styling:** Transparent or flat white container background, bordered by a single bottom underline or full thin frame (`#E5E5E5`).
* **Hover/Active:** Focus triggers a crisp `$1\text{px}$ solid #000000` border conversion.

## Buttons

* **Primary Button:**
* *Structure/Styling:* Rectangular, sharp corners ($0\text{px}$ border-radius). Solid `#000000` fill with white uppercase text.
* *Dimensions:* Height: `48px` (Desktop), `52px` (Mobile for larger touch targets).
* *Hover State:* Inverts to white background with `#000000` border, or dims opacity to `85%`.


* **Secondary Button:**
* *Structure/Styling:* Clear transparent background, $1\text{px}$ solid `#000000` border. Black uppercase text.
* *Hover State:* Solid `#000000` background fill with white text.


* **Disabled State:** `#F5F5F5` background fill, text changed to `#767676`, `cursor: not-allowed`.

## Inputs & Select Menus

* **Structure:** Low-profile forms without heavy rounding or shadows.
* **Dimensions:** Base height `44px`.
* **Styling:** $1\text{px}$ border in `#E5E5E5`. Default text size `14px`. Labels sit clean above the field or behave as inside placeholders that scale down when active.
* **Focus State:** Border changes to solid `#000000`. No shadow glow effects.

## Product Cards

* **Purpose:** Main grid asset presenting standalone product information.
* **Structure:** Aspect-ratio managed product image container, underneath which lies product name, secondary category/color counts, and price notation.
* **Dimensions:** Image container maintains a strict vertical fashion aspect ratio (typically `2:3` or `3:4`).
* **Styling:** Zero border boxes or card container shadows. Plain text on white background canvas.
* **Hover States:** Image shifts dynamically to alternate look/angle variant on desktop hover. Text title underlines smoothly.
* **Mobile Adaption:** Scales down seamlessly into a strict 2-column flow.

## Hero Sections & Banners

* **Purpose:** Introduces campaign narratives and primary promotional traffic funnels.
* **Structure:** High-resolution full-width background lifestyle photography with minimal, sharp text overlay.
* **Styling:** Typographic copy uses either stark white overlay or sits directly beneath the graphic block inside structured white blocks. Primary call to actions use standard inline text links with micro-underlines or sharp rectangular buttons.

## Filters & Drawers

* **Purpose:** Sifts product catalogs inside Product Listing Pages.
* **Structure:** Desktop utilizes a clean horizontal layout system above the grid or a left-side sticky list. Mobile shifts filters completely into a slide-out drawer sliding from the right edge.
* **Styling:** Background surfaces remain solid white (`#FFFFFF`), separated from underlying content panels using clean, thin structural lines (`#E5E5E5`).

## Footer

* **Structure:** Multi-column text navigation link blocks grouped by context (e.g., "About Us", "Get Help"). Includes a clean horizontal newsletter input box and language/currency selectors.
* **Styling:** Flat light grey background (`#F9F9F9`) or pure clean white matching the main grid baseline. Text sizes scale down to `12px` or `13px` for compact, structured data presentation.

---

# Product Listing Page (PLP)

* **Layout:** Responsive grid system displaying 4 products per row on large displays (`1280px` and up), scaling fluidly down to 3 or 2 items based on screen dimensions.
* **Filters & Sorting:** Clean persistent horizontal controls strip positioned directly underneath category header titles. Drop-down menus open inline without layout shifts.
* **Card Design:** Edge-to-edge images with sharp margins. Text elements are center or left-aligned with absolute typographic consistency.
* **Responsive Flow:** At mobile widths (`< 768px`), layouts default automatically to a highly functional, compact 2-column image feed.

---

# Product Detail Page (PDP)

```
+------------------------------------+------------------------------------+
|                                    |                                    |
|                                    |  BREADCRUMBS                       |
|                                    |  PRODUCT TITLE                     |
|                                    |  PRICE                             |
|          PRODUCT GALLERY           |  --------------------------------  |
|                                    |  COLOR SELECTOR (Swatches)         |
|         (Sticky Scroll /           |  --------------------------------  |
|          Multi-Image Stack)        |  SIZE SELECTOR (Grid layout)       |
|                                    |  --------------------------------  |
|                                    |  PRIMARY ADD TO CART BUTTON        |
|                                    |  --------------------------------  |
|                                    |  ACCORDION DETAILS                 |
|                                    |  - Fit Info                        |
|                                    |  - Materials & Care                |
+------------------------------------+------------------------------------+

```

## Gallery Behavior

Desktop layouts leverage a high-impact sticky scroll template. The left column contains a vertical scroll stack of high-definition imagery showcasing multiple product angles, while the right summary configuration block remains locked in view during page scroll. Mobile views convert this gallery into a clean, horizontal swipeable pagination carousel using low-profile dot or line indicators.

## Variant Selectors & Add-to-Cart

* **Color Swatches:** Presented via small, circular structural image rings or color pills ($24\text{px} \times 24\text{px}$) with a sharp $1\text{px}$ black outer ring selector indicating the active choice.
* **Size Matrix:** Arranged as a flat, space-efficient grid of rectangular option blocks. Crossed-out typography states represent unavailable sizes.
* **Add-To-Cart Action:** High-priority, full-width solid black button block executing immediate item additions. This pulls open a sleek right-side AJAX shopping cart drawer overlay rather than navigating the user away from their current page context.

---

# Mobile Design System

* **Navigation Adaptation:** Desktop top menus contract completely into a modular slide-out hamburger drawer panel. Large category segments utilize clean vertical accordion panels.
* **Touch Target Minimums:** Interactive links, buttons, and size matrices maintain strict operational touch dimensions of at least $44\text{px} \times 44\text{px}$ to optimize target selection reliability.
* **Mobile Spacing Metrics:** Content layouts scale side paddings uniformly down to `16px` to maximize available mobile visual area while preventing edge bleed.
* **Mobile Typography Scale:** Subhead and header type scales shift down proportionally (`H1` scales to `24px`) to preserve layout balance and eliminate line-wrapping issues.

---

# Animation System

Animations prioritize system performance and UI clarity over decorative motion design. Transitions use lightweight, linear properties.

* **Global Transition Duration:** `200ms` baseline configuration across standard property modifications.
* **Easing Function Matrix:** `cubic-bezier(0.4, 0, 0.2, 1)` (standard ease-in-out profile).
* **Component Interaction Behaviors:**
* *Hover Transformations:* Fine opacity adjustments or instantaneous product image swatch swaps.
* *Drawer Operations:* Slide-out modules (e.g., shopping bags, mobile menus) translate smoothly along the X-axis from view edges (`transform: translateX(0)`).
* *Loading Feedback:* Minimal, low-overhead micro-spinners or clean grey skeleton block states to minimize layout disruption.



---

# Accessibility (WCAG 2.1 Compliance)

* **Contrast Performance:** All critical text displays utilize hard black (`#000000`) or charcoal (`#222222`) fills mapped over pure white backdrops to achieve an optical contrast ratio exceeding `7:1`.
* **Keyboard Interactivity:** Tab sequencing maps systematically through structural pathways. Selectable elements feature dedicated focus styles.
* **Focus Ring Indicator Rule:** Active selections display an unambiguous, sharp `$1\text{px}$ solid #000000` outer frame overlay.

---

# Tailwind CSS Mapping

Incorporate this structural design token foundation directly into configuration architectures:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'xs': '375px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      'xxl': '1440px',
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      brand: {
        black: '#000000',
        white: '#FFFFFF',
      },
      gray: {
        dark: '#222222',
        muted: '#767676',
        light: '#E5E5E5',
        bg: '#F9F9F9',
      },
      accent: {
        sale: '#BC0000',
      }
    },
    fontFamily: {
      sans: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
    },
    fontSize: {
      'xs': ['11px', { lineHeight: '1.3', letterSpacing: '0.05em' }],
      'sm': ['13px', { lineHeight: '1.2', letterSpacing: '0.08em' }],
      'base': ['14px', { lineHeight: '1.5', letterSpacing: '0.01em' }],
      'lg': ['20px', { lineHeight: '1.3', letterSpacing: '0.1em' }],
      'xl': ['32px', { lineHeight: '1.2', letterSpacing: '0.05em' }],
    },
    extend: {
      borderRadius: {
        'none': '0px',
      },
      transitionTimingFunction: {
        'editorial': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        'default': '200ms',
      }
    },
  },
  plugins: [],
}

```

## Global Utility Structural Reusability Examples

### Primary Editorial Button Pattern

```html
<button class="bg-brand-black text-brand-white text-sm font-medium uppercase py-3 px-6 rounded-none border border-brand-black hover:bg-brand-white hover:text-brand-black transition-all duration-default ease-editorial disabled:bg-gray-light disabled:text-gray-muted disabled:cursor-not-allowed">
  Add to Bag
</button>

```

### Product Grid Layout Pattern

```html
<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 max-w-[1440px] mx-auto px-4 md:px-10">
  </div>

```

---

# AI Reconstruction Guide

This section outlines instructions for AI agents or automated front-end layout compilation routines to assemble application child pages in strict alignment with this design system.

### 1. Global Reset Constraints

* Enforce `rounded-none` globally. Buttons, dropdowns, input fields, cards, and modal elements must have sharp, geometric 90-degree corners.
* Eliminate standard box-shadow properties (`shadow-sm`, `shadow-md`, etc.). Content elevation changes are defined exclusively via flat thin borders (`1px solid #E5E5E5`) or high-contrast background fills.

### 2. Component Construction Strategy

* **Layout Grid Assembly:** Use the standard Tailind class array `max-w-[1440px] mx-auto px-4 md:px-10` to wrap main layout blocks. This guarantees unified horizontal grid margins across structural views.
* **Typography Implementations:** When rendering page section titles, use uppercase characters combined with tracking shifts (`text-lg font-medium uppercase tracking-widest text-brand-black`).

### 3. State Inversion Logic

* Interactive elements feature inverted contrast mapping on interaction. A dark-fill button element must swap directly to transparent or white backdrops with crisp dark textual components on mouse hover.
* Avoid decorative visual flair, gradient fills, and elaborate animation curves. Focus on sub-200ms layout transformations to keep the interface feeling snappy, structural, and premium.