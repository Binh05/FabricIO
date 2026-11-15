---
name: Obsidian Kinetic
colors:
  surface: '#051424'
  surface-dim: '#051424'
  surface-bright: '#2c3a4c'
  surface-container-lowest: '#010f1f'
  surface-container-low: '#0d1c2d'
  surface-container: '#122131'
  surface-container-high: '#1c2b3c'
  surface-container-highest: '#273647'
  on-surface: '#d4e4fa'
  on-surface-variant: '#e4bdbc'
  inverse-surface: '#d4e4fa'
  inverse-on-surface: '#233143'
  outline: '#ab8887'
  outline-variant: '#5b403f'
  surface-tint: '#ffb3b2'
  primary: '#ffb3b2'
  on-primary: '#680013'
  primary-container: '#ff525d'
  on-primary-container: '#5b000f'
  inverse-primary: '#bd0c2d'
  secondary: '#c7fff0'
  on-secondary: '#00382f'
  secondary-container: '#00f2d1'
  on-secondary-container: '#006a5a'
  tertiary: '#4edea3'
  on-tertiary: '#003824'
  tertiary-container: '#00a572'
  on-tertiary-container: '#00311f'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdad9'
  primary-fixed-dim: '#ffb3b2'
  on-primary-fixed: '#410008'
  on-primary-fixed-variant: '#92001f'
  secondary-fixed: '#26fedc'
  secondary-fixed-dim: '#00dfc1'
  on-secondary-fixed: '#00201a'
  on-secondary-fixed-variant: '#005144'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#051424'
  on-background: '#d4e4fa'
  surface-variant: '#273647'
typography:
  display-hero:
    fontFamily: Plus Jakarta Sans
    fontSize: 56px
    fontWeight: '800'
    lineHeight: 64px
    letterSpacing: -0.03em
  display-hero-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: 0em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0.005em
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.08em
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-badge:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
  space-2xl: 4rem
---

## Brand & Style

The design system embodies a modern gaming editorial aesthetic: dark, razor-sharp, atmospheric, and highly functional. It bridges the gap between high-end digital publishing and interactive game launcher surfaces. The emotional tone is mysterious yet electrifying—evoking late-night developer flow states, indie breakthroughs, and tactile digital mechanics.

The visual style blends **Modern Dark Surface Hierarchy** with **Cyber-Tactile Editorialism**. Deep voids of near-black charcoal anchor the experience, punctuated by surgical hairline dividers, ambient volumetric backdrops, and an energetic coral-red signal beacon that commands focus and action. Visual density remains disciplined: layouts emphasize expansive breathing room and immediate scannability over sensory overload.

## Colors

The palette is engineered specifically for deep-contrast low-light environments:

- **Primary (`#ff4655`)**: High-voltage coral-red. Used strictly for core interactive drivers, play/purchase triggers, live broadcasts, and primary highlights. Never overused in passive backgrounds.
- **Secondary (`#00f5d4`)**: Electric cyan. Reserved for micro-highlights, technical specifications, active developer tags, and positive network statuses.
- **Tertiary (`#10b981`)**: Neon emerald. Signifies verified releases, successful validation, available builds, and active servers.
- **Surface Voids**: Base backdrops sit at `#090a0f` and `#0d0f15`, progressing to elevated resting tiers at `#141721` and active interactive layers at `#1a1e2c`.
- **Borders & Dividers**: Sub-1px or 1px hairline elements sit at `#222738` to preserve structure without visual weight.
- **Text & Content**: Primary text sits at crisp white (`#f8fafc`), with secondary annotations mapped to cool slate (`#94a3b8`) and subdued metadata at (`#64748b`).

## Typography

Typography relies on a disciplined duality: geometric editorial authority paired with industrial precision. 

- **Primary & Headings (Plus Jakarta Sans)**: Delivers geometric punch with tight letter-spacing in display tiers, commanding immediate editorial presence across game release banners, developer spotlights, and platform titles.
- **Data, Metrics, & Code Tags (JetBrains Mono)**: Used for release versions, frame rate statistics, build hashes, and technical specs. It introduces a sharp, tactile developer tool nuance directly into consumer surfaces.
- **Hierarchy Rules**: All section labels and operational badges use uppercase styling with tracking expanded between `0.04em` and `0.08em`. Body text maintains relaxed line heights (`1.5` to `1.6`) to ensure fatigue-free reading against deep black backgrounds.

## Layout & Spacing

The layout is built on a responsive 12-column fluid grid system pinned to an 8-point baseline scale. 

- **Desktop (1200px+)**: 12 columns, 24px (`1.5rem`) gutters, with responsive outer gutters expanding up to 48px to preserve an airy, cinematic frame. Main game catalog feeds utilize 3-column and 4-column module arrangements.
- **Tablet (768px - 1199px)**: 8 columns, 24px gutters, 24px margins. Sidebar panels collapse into drawer overlays or bottom-anchored sheets.
- **Mobile (< 768px)**: 4 columns, 16px (`1rem`) gutters, 16px margins. Game showcases switch from multi-column grids into horizontally-scrollable snap carousels or stacked 1-column cards.
- **Section Rhythm**: Inter-section gaps (`space-2xl`) establish clear chapter breaks between platform announcements, curated collections, and community updates without relying on heavy horizontal lines.

## Elevation & Depth

Visual hierarchy does not rely on heavy drop shadows, but instead uses **Tonal Layering**, **Hairline Borders**, and **Atmospheric Edge Glows**:

- **Ground Zero (Canvas)**: `#090a0f` base layer, completely matte.
- **Layer 1 (Cards, Modules, Structural Panels)**: `#141721` with a crisp 1px border of `#222738`.
- **Layer 2 (Hover States, Floating Drawers, Popovers)**: `#1a1e2c` with a lighter 1px perimeter border of `rgba(148, 163, 184, 0.15)`.
- **Accent Diffusions**: Active games or highlighted interactive modules project a subtle radial back-glow using `rgba(255, 70, 85, 0.12)` blurred at 32px to 48px behind the card bounding box.
- **Frosted Overlays**: Modal backdrops and pinned navigation rails utilize `backdrop-filter: blur(16px)` with a 75% opacity fill of `#090a0f`, creating depth without muddying underlying game graphics.

## Shapes

The design system enforces a precision-tooled, soft-angular form factor (`roundedness: 1`). Radii are deliberately restrained to evoke hardware interfaces, digital instruments, and modern technical terminals:

- **Base Elements (Buttons, Inputs, Badges)**: 4px (`0.25rem`) radius.
- **Containers & Cards (`rounded-lg`)**: 8px (`0.5rem`) radius, matching inner component nesting cleanly.
- **Modals & Master Modules (`rounded-xl`)**: 12px (`0.75rem`) radius.
- Circles are strictly restricted to avatars, online status dots, and icon-only pagination indicators.

## Components

### Buttons
- **Primary Action**: Solid `#ff4655` background, `#ffffff` text, 4px radius, medium bold typography. On hover: shifts to `#f43f5e` with an external glow (`0 0 16px rgba(255, 70, 85, 0.35)`).
- **Secondary Action**: `#141721` surface, `#f8fafc` text, 1px border in `#222738`. Hover: border brightens to `rgba(148, 163, 184, 0.3)` and background lifts to `#1a1e2c`.
- **Ghost/Tertiary**: Transparent fill, `#94a3b8` text. Hover: `#ffffff` text, subtle background tint `rgba(255, 255, 255, 0.04)`.

### Badges & Chips
- **Gaming Platform & Status Badges**: Micro-scale (`label-caps` or `label-badge`), 4px radius, padded with 4px vertical by 8px horizontal.
- **Status Accents**: 
  - Verified Indie: Cyan tint background (`rgba(0, 245, 212, 0.1)`), cyan text (`#00f5d4`), 1px border (`rgba(0, 245, 212, 0.25)`).
  - Playable Demo: Emerald tint background (`rgba(16, 185, 129, 0.1)`), emerald text (`#10b981`), 1px border (`rgba(16, 185, 129, 0.25)`).
  - Live / Spotlight: Coral tint background (`rgba(255, 70, 85, 0.12)`), coral text (`#ff4655`), 1px border (`rgba(255, 70, 85, 0.3)`).

### Cards (Game Showcase & Editorial)
- Built on `#141721` with a 1px border in `#222738` and 8px corner radius.
- Header imagery features an aspect ratio of 16:9 or 21:9 with subtle gradient scrims fading into the container body.
- On hover, the card elevates to `#1a1e2c`, the hairline border illuminates to `#333b52`, and a subtle coral or cyan underglow engages beneath the image frame.

### Input Fields & Search Bars
- Solid background of `#0d0f15`, 1px border in `#222738`, text in `#f8fafc`, placeholder text in `#64748b`.
- Focus state: border shifts to `#ff4655` with a delicate outer ring (`0 0 0 1px #ff4655`).
- Search bars feature trailing shortcut cues in `label-mono` (e.g., `⌘K`) rendered in muted slate pills.

### Selection Controls (Checkboxes & Radios)
- Checkboxes: 16px square, 3px border radius, `#0d0f15` background, `#222738` stroke. Checked state: solid `#ff4655` fill with white checkmark.
- Radio buttons: 16px circle, identical dark rest style; selected state hosts an active `#00f5d4` inner pip.

### Additional Domain Components
- **System Spec Table**: Alternating rows using `#141721` and `#0d0f15`, bordered with `#222738`, featuring mono-formatted hardware labels.
- **Telemetry & Metric Tickers**: Compact numerical widgets showcasing active concurrent players, build version, and community ratings with colored status pips.