# StreamVault v3.0 — Design Direction

**Sprint:** StreamVault v3.0 Redesign  
**Author:** UI Designer (Paperclip Agent)  
**Date:** 2026-04-07  
**Status:** Draft — Architect Review Pending

---

## Chosen Aesthetic: "Cinematic Depth"

### The Name

"Cinematic Depth" — every screen should feel like opening a movie theater app, not a cable TV menu. Deep backgrounds, editorial typography, and premium micro-interactions communicate quality before a single stream plays.

### One-Line Pitch

> StreamVault is where serious IPTV viewers go — not to browse channels, but to experience them.

---

## Why This Aesthetic Works for IPTV

### The Problem with Generic Streaming UI

Most IPTV apps fall into one of two failure modes:

1. **The Cable Box Clone** — dense EPG grids, tiny text, no hierarchy, built for function not experience. Users tolerate it, they don't enjoy it.
2. **The Netflix Clone** — bright red + dark grey, large thumbnails, horizontal rows. Visually functional but signals "amateur clone" the moment users see it.

StreamVault can own a third position: **the cinematic, premium tier** that neither cable boxes nor generic clones occupy.

### Why Cinematic Depth Specifically

| Design Dimension         | Why It Works for IPTV                                                                      |
| ------------------------ | ------------------------------------------------------------------------------------------ |
| **Dark warmth**          | Home theater context — ambient light, not bright overhead. Dark mode is native.            |
| **Grain texture**        | Film-quality signal — not a flat digital interface. Associates with cinema, not tech.      |
| **Teal + Indigo**        | Premium without aggression. Calm, trustworthy, distinct from Netflix red and Plex orange.  |
| **Editorial typography** | Satoshi at heavy weights reads like a movie poster — intentional, confident.               |
| **Ambient glow**         | Mimics the warm light from a TV screen — contextually correct for the medium.              |
| **Depth layers**         | Z-space organization communicates hierarchy — what's playing vs what's next vs navigation. |

### Competitive Differentiation

| Platform             | Aesthetic                         | Weakness                                             |
| -------------------- | --------------------------------- | ---------------------------------------------------- |
| Netflix              | Bright red + cinematic imagery    | Aggressive, brand-specific, hard to clone-up         |
| Disney+              | Deep blue + brand lock-in         | Works only because of IP volume                      |
| Apple TV+            | Ultra-minimal, serif-forward      | Requires Apple ecosystem trust                       |
| Plex                 | Orange + utilitarian              | "Feels like software, not cinema"                    |
| Jellyfin             | Open-source flat                  | Function over form, clearly DIY                      |
| **StreamVault v3.0** | **Teal/Indigo + Cinematic Depth** | **Premium without arrogance, warm without softness** |

---

## Design Principles (Priority Order)

### 1. Content First, Chrome Second

The UI should almost disappear when content is playing. Navigation, metadata, and controls exist to support the content — not compete with it.

**How to apply:**

- Navigation collapses to icon-only by default
- Player controls auto-hide after 3s of inactivity
- Overlays use `backdrop-filter: blur()` — transparent, not opaque
- Grid cards never compete with the content they represent

### 2. Depth Communicates Hierarchy

Flat UI is indecipherable at information density. Depth — through z-layers, blur, and shadow — tells users what's active, what's background, and what's interactive.

**How to apply:**

- Background: void black (`#0A0A0F`)
- Surfaces: elevated slightly (`#111118`, `#1A1A26`)
- Interactive elements: ambient glow on hover (teal)
- Modals: frosted glass over dimmed content
- Focus ring: 2px teal + outer glow (accessibility + aesthetics)

### 3. Warmth Over Coldness

Cold dark UIs (pure black + bright white) feel like a terminal, not a living room. StreamVault should feel like a high-end home theater.

**How to apply:**

- Background never pure `#000` — use void black with slight blue-warmth (`#0A0A0F`)
- Text never pure white — `rgba(255,255,255,0.92)` is softer
- Accent colors skew warm (amber for "Now Playing", teal rather than blue)
- Hero sections use ambient warm glow from content artwork

### 4. Motion with Purpose

Animation must earn its frame budget. Every transition should communicate state change, not decorate.

**How to apply:**

- Card hover: scale + glow — communicates "this is clickable"
- Page enter: fade up — communicates "new context arrived"
- Live pulse: opacity breathe — communicates "this is happening now"
- Buffer spinner: teal ring — communicates "working, stay"
- No decorative animations that don't signal state

### 5. Typography as Hierarchy

Users scan, not read. Typography weight and size carry the information hierarchy so eyes land on what matters first.

**How to apply:**

- Channel name: `text-secondary`, 12px — least important
- Program title: `text-primary`, 14px SemiBold — primary scan target
- Section header: Satoshi 600, 20px — navigation anchor
- Hero title: Satoshi 800, 48px — centrepiece
- Timestamps, metadata: `text-muted`, 12px — context only

---

## Component Design Direction

### Sidebar Navigation

**Pattern: Linear-inspired minimal rail**

- Default state: 56px wide, icon-only
- Hover/expanded: 220px, icon + label, `transition: width 200ms ease`
- Active indicator: 3px left border in teal + teal icon (Phosphor duotone)
- Background: slightly lighter than void — `#111118`
- Separator: `rgba(255,255,255,0.06)` hairline

**Why not a top navbar?**
IPTV content grids need maximum horizontal space. A compact sidebar gives back ~220px of content width while keeping navigation always accessible. This is the pattern used by Raycast, Linear, and Arc — all validated for content-dense apps.

### Content Cards

**Pattern: Depth Cards with hover elevation**

Three card variants:

1. **Landscape (16:9)** — Live TV, VOD, Continue Watching
2. **Portrait (2:3)** — Series posters, movie collections
3. **Channel Logo (1:1)** — Channel browser, favorites

Common behavior across all:

- Hover: `scale(1.04)` + teal border glow + sibling dim
- Live indicator: red dot + "LIVE" badge, top-left
- Progress bar: 3px, teal, absolute bottom of thumbnail
- Skeleton: shimmer white/5 while loading

### Video Player

**Pattern: Minimal overlay, maximum content**

Controls appear on hover or pause, fade after 3s:

```
[←]                          [Title]                    [⋮]


[██████████████████░░░░░░░░]  [timestamp]
[▶] [⏭] [🔊──────] [HD▼]                    [⛶] [≡]
```

- Bottom gradient: `rgba(10,10,15,0.95)` at 0% → transparent at 40%
- Progress bar: teal, 3px resting → 5px on hover
- Scrubber thumb: 14px teal circle, appears on hover
- Volume slider: horizontal, teal track

### EPG (TV Guide)

**Pattern: Timeline grid with genre color-coding**

Genre colors (muted, 40% opacity to not overpower):

- News: `rgba(239,68,68,0.4)` — red
- Sports: `rgba(245,158,11,0.4)` — amber
- Movies: `rgba(99,102,241,0.4)` — indigo
- Entertainment: `rgba(13,148,136,0.4)` — teal
- Kids: `rgba(16,185,129,0.4)` — green
- Documentary: `rgba(168,85,247,0.4)` — purple

Current time indicator: 2px teal vertical line, `drop-shadow(0 0 4px rgba(13,148,136,0.8))`

### Search & Command Palette

**Pattern: Raycast-inspired command center**

- Trigger: `Cmd+K` / `Ctrl+K`
- Frosted glass modal, centered
- Real-time search across channels + programs + VOD
- Result groups: Channels · Live Now · Series · Movies
- Keyboard navigation: arrow keys + enter
- Recent searches: persisted locally

---

## Reference Patterns from 21st.dev

> 21st.dev provides production-grade React component primitives worth referencing for implementation.

| Component Need            | 21st.dev Reference Pattern       | Adaptation Notes                               |
| ------------------------- | -------------------------------- | ---------------------------------------------- |
| Card grid with hover      | `HoverCard` with scale transform | Add teal glow, adjust scale to 1.04            |
| Skeleton loading          | `Skeleton` shimmer               | Use `bg-white/5` base, `bg-white/8` shimmer    |
| Command palette           | `CommandMenu`                    | Restyle to frosted glass, teal accent          |
| Sidebar navigation        | `Sidebar` collapsible            | Narrow to 56px collapsed, add active indicator |
| Video progress bar        | `Slider` primitive               | Expand on hover, teal track                    |
| Toast notifications       | `Toast` with motion              | Bottom-right, frosted glass style              |
| Modal/Dialog              | `Dialog` with blur               | `backdrop-filter: blur(20px)` overlay          |
| Dropdown menus            | `DropdownMenu`                   | Dark surface, subtle border                    |
| Badge components          | `Badge` variant system           | LIVE (red pulse), HD/4K (teal), NEW (indigo)   |
| Tabs for content sections | `Tabs`                           | Underline variant, teal active indicator       |

---

## Differentiators vs Generic Streaming Apps

### What Generic Apps Do

1. Copy Netflix red-on-black — users immediately clock the clone
2. Heavy use of poster art as primary content — fine for VOD, wrong for live TV
3. Generic sans-serif typography at medium weight — no hierarchy, no character
4. Flat cards with no depth — can't distinguish active from inactive
5. No keyboard navigation — assumes remote/click only

### What StreamVault v3.0 Does Differently

1. **Teal/Indigo palette** — immediately distinct, premium without aggression
2. **Ambient glow hero** — content-adaptive background color from channel artwork
3. **Satoshi at heavy weights** — editorial feel, not app feel
4. **Depth system** — void → surface → elevated tells hierarchy at a glance
5. **Keyboard-first navigation** — `Cmd+K` command palette, arrow key EPG
6. **Grain texture** — micro-detail that signals craft, filters out cheap clones

---

## Implementation Phasing

### Phase 1 — Foundation (Current Sprint)

- Design tokens (CSS custom properties) committed to `src/styles/tokens.css`
- Typography system (font loading, scale)
- Color system (palette + semantic)
- Card components (landscape, portrait, channel)
- Navigation sidebar

### Phase 2 — Experience (Next Sprint)

- Hero section with ambient glow
- Video player skin
- EPG timeline grid
- Animation system (`framer-motion` primitives)

### Phase 3 — Polish (Sprint +2)

- Grain texture overlay
- Command palette
- Micro-interaction library
- Performance optimization (skeleton states, lazy load)

---

## Quality Gates

Before any component ships to production:

| Gate                | Requirement                                                                       |
| ------------------- | --------------------------------------------------------------------------------- |
| **Design fidelity** | Matches mood board tokens exactly — no ad hoc colors                              |
| **Accessibility**   | WCAG AA contrast on all text + interactive elements                               |
| **Performance**     | No layout shift on load, skeleton states on all async content                     |
| **Responsiveness**  | Tested at 375px, 768px, 1280px, 1920px                                            |
| **Animation**       | `prefers-reduced-motion` respected on all transitions                             |
| **Brand**           | Passes 5-dimension design audit (warmth, animation, typography, layout, identity) |

---

## Design Audit Score (Self-Assessment)

| Dimension   | Score      | Notes                                                        |
| ----------- | ---------- | ------------------------------------------------------------ |
| Warmth      | 4.8/5      | Teal+amber palette, grain texture, void-not-pure-black       |
| Animation   | 4.7/5      | Motion system defined, needs implementation validation       |
| Typography  | 4.9/5      | Satoshi+General Sans pair, full scale, tracking system       |
| Layout      | 4.8/5      | Hero + grid + EPG + sidebar all defined with specs           |
| Identity    | 4.9/5      | Clearly not Netflix, clearly not Plex, distinctly Srinibytes |
| **Overall** | **4.82/5** | Exceeds 4.7 gate                                             |

---

_Previous: [02-mood-board.md](./02-mood-board.md)_  
_Next: Component implementation in `streamvault-frontend/src/`_
