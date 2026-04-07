# StreamVault v3.0 — Mood Board

**Sprint:** StreamVault v3.0 Redesign  
**Author:** UI Designer (Paperclip Agent)  
**Date:** 2026-04-07  
**Status:** Draft — Architect Review Pending

---

## Design Aesthetic: "Cinematic Depth"

StreamVault v3.0 targets the premium IPTV viewer who expects a cinematic, immersive experience — not a utilitarian cable guide. The mood is **dark warmth**: rich, layered backgrounds with subtle amber/teal accents that feel like a high-end home theater, not a cold tech dashboard.

---

## 1. Color Palettes

### Primary: "Night Cinema"

| Token                   | Value                    | Usage                          |
| ----------------------- | ------------------------ | ------------------------------ |
| `--color-bg-void`       | `#0A0A0F`                | Page background, darkest layer |
| `--color-bg-surface`    | `#111118`                | Cards, panels, containers      |
| `--color-bg-elevated`   | `#1A1A26`                | Modals, drawers, tooltips      |
| `--color-bg-overlay`    | `rgba(17,17,24,0.85)`    | Video overlay, frosted glass   |
| `--color-border-subtle` | `rgba(255,255,255,0.06)` | Card borders, dividers         |
| `--color-border-active` | `rgba(255,255,255,0.15)` | Focused/hovered borders        |

### Accent: "Teal-Amber Gradient" (Srinibytes Ambient Depth)

| Token                | Value                   | Usage                                      |
| -------------------- | ----------------------- | ------------------------------------------ |
| `--color-teal-500`   | `#0D9488`               | Primary CTA, play button, active states    |
| `--color-teal-400`   | `#2DD4BF`               | Hover states, highlight rings              |
| `--color-teal-glow`  | `rgba(13,148,136,0.25)` | Ambient glow on featured content           |
| `--color-indigo-500` | `#6366F1`               | Secondary accent, live badges, EPG markers |
| `--color-indigo-400` | `#818CF8`               | Hover on secondary elements                |
| `--color-amber-500`  | `#F59E0B`               | "Now Playing" indicator, star ratings      |
| `--color-amber-warm` | `rgba(245,158,11,0.15)` | Warm ambient on hero content               |

### Gradient Definitions

```css
/* Hero gradient — cinematic backdrop */
--gradient-hero: radial-gradient(
  ellipse 120% 80% at 50% 0%,
  rgba(13, 148, 136, 0.18) 0%,
  rgba(99, 102, 241, 0.1) 40%,
  transparent 70%
);

/* Card hover — depth lift */
--gradient-card-hover: linear-gradient(
  135deg,
  rgba(13, 148, 136, 0.08) 0%,
  rgba(99, 102, 241, 0.05) 100%
);

/* Overlay — video player gradient */
--gradient-player-overlay: linear-gradient(
  to top,
  rgba(10, 10, 15, 0.95) 0%,
  rgba(10, 10, 15, 0.4) 40%,
  transparent 100%
);

/* Grain texture — authenticity */
--gradient-grain: url("data:image/svg+xml,..."); /* SVG noise filter */
```

### Semantic Colors

| Token                    | Value                    | Meaning                         |
| ------------------------ | ------------------------ | ------------------------------- |
| `--color-live`           | `#EF4444`                | Live broadcast indicator        |
| `--color-live-pulse`     | `rgba(239,68,68,0.3)`    | Animated live pulse             |
| `--color-success`        | `#10B981`                | Playback ready, connection good |
| `--color-warning`        | `#F59E0B`                | Buffering, low quality          |
| `--color-error`          | `#EF4444`                | Stream error, disconnected      |
| `--color-text-primary`   | `rgba(255,255,255,0.92)` | Headlines, primary content      |
| `--color-text-secondary` | `rgba(255,255,255,0.55)` | Metadata, captions              |
| `--color-text-muted`     | `rgba(255,255,255,0.30)` | Timestamps, tertiary info       |

---

## 2. Typography Pairs

### Primary Pair: "Cinematic Editorial"

| Role           | Font           | Weight          | Size Range | Usage                           |
| -------------- | -------------- | --------------- | ---------- | ------------------------------- |
| **Display**    | Satoshi        | 800 (ExtraBold) | 48–80px    | Hero titles, channel names      |
| **Heading**    | Satoshi        | 600 (SemiBold)  | 24–40px    | Section headers, program titles |
| **Subheading** | Satoshi        | 500 (Medium)    | 18–22px    | Card titles, category labels    |
| **Body**       | General Sans   | 400 (Regular)   | 14–16px    | Descriptions, metadata          |
| **Caption**    | General Sans   | 400 (Regular)   | 12–13px    | Timestamps, episode numbers     |
| **Label**      | General Sans   | 500 (Medium)    | 11–12px    | Badges, tags, button text       |
| **Mono**       | JetBrains Mono | 400             | 12–13px    | Stream URL, technical info      |

### Type Scale (rem-based)

```css
--text-xs: 0.75rem; /* 12px — captions */
--text-sm: 0.875rem; /* 14px — body small */
--text-base: 1rem; /* 16px — body */
--text-lg: 1.125rem; /* 18px — subheading */
--text-xl: 1.25rem; /* 20px — card title */
--text-2xl: 1.5rem; /* 24px — section header */
--text-3xl: 1.875rem; /* 30px — page heading */
--text-4xl: 2.25rem; /* 36px — hero title */
--text-5xl: 3rem; /* 48px — display */
--text-6xl: 3.75rem; /* 60px — hero display */
```

### Line Heights & Letter Spacing

```css
--leading-tight: 1.2; /* Display, hero */
--leading-snug: 1.35; /* Headings */
--leading-normal: 1.5; /* Body */
--leading-relaxed: 1.65; /* Descriptions */

--tracking-tight: -0.03em; /* Display — cinematic compression */
--tracking-normal: -0.01em; /* Headings */
--tracking-wide: 0.05em; /* Labels, badges — uppercase */
--tracking-widest: 0.12em; /* Category pills */
```

---

## 3. Layout Patterns

### Hero Layout — "Spotlight"

```
┌─────────────────────────────────────────────────────────────────┐
│  [Backdrop image — full bleed, blurred edges]                   │
│                                                                  │
│  [Ambient glow layer — teal/indigo radial gradient]             │
│  [Grain texture overlay]                                        │
│                                                                  │
│  ┌──────────────────────────────┐  ┌───────────────────────┐   │
│  │  CHANNEL LOGO                │  │  [Thumbnail / Frame]  │   │
│  │                              │  │                        │   │
│  │  Program Title — 48px Bold   │  │  16:9 aspect ratio    │   │
│  │  Metadata: genre · duration  │  │  with corner radius   │   │
│  │                              │  └───────────────────────┘   │
│  │  [▶ Watch Now]  [+ Watchlist]│                              │
│  └──────────────────────────────┘                              │
│                                                                  │
│  [Bottom gradient fade to void background]                      │
└─────────────────────────────────────────────────────────────────┘
```

**Key specs:**

- Height: `min(70vh, 720px)`
- Backdrop: blurred `blur(80px)` + `saturate(1.2)` channel artwork
- Content aligned: left `max-w-2xl` with right thumbnail card
- Play button: teal with glow shadow `0 0 30px rgba(13,148,136,0.5)`

### Content Grid — "Editorial Rows"

```
Row: "Continue Watching"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Card 16:9][Card 16:9][Card 16:9][Card 16:9][Card 16:9]  →

Row: "Live Channels"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Channel][Channel][Channel][Channel][Channel][Channel]  →

Row: "Featured Series"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Poster 2:3][Poster 2:3][Poster 2:3][Poster 2:3]  →
```

**Card grid system:**

```css
--grid-gutter: 12px;
--card-radius: 8px; /* content cards */
--card-radius-sm: 6px; /* channel logos */
--card-radius-lg: 12px; /* hero card, modals */
```

### Card Anatomy — "Depth Card"

```
┌─────────────────────────────┐
│                              │   ← border-subtle (0.06 opacity)
│  [Thumbnail Image]           │   ← aspect-ratio: 16/9
│                              │
│  [LIVE ●]    [HD badge]     │   ← overlay badges (top)
│                              │
│  ████████████████████ 45%   │   ← progress bar (bottom of image)
└─────────────────────────────┘
│  Channel Name               │   ← text-secondary, 12px
│  Program Title              │   ← text-primary, 14px, SemiBold
│  10:30 PM · 2h 15m         │   ← text-muted, 12px
└─────────────────────────────┘
```

**Hover state:**

- Scale: `transform: scale(1.04)` with `transition: 200ms ease-out`
- Border glow: `box-shadow: 0 0 0 1.5px rgba(13,148,136,0.6)`
- Backdrop elevation: card-hover gradient
- Z-index lift + sibling dim

### Navigation Layout — "Minimal Sidebar"

```
┌──┬───────────────────────────────────────────────┐
│  │                                                │
│ N│  [Main Content Area]                           │
│ A│                                                │
│ V│                                                │
│  │                                                │
└──┴───────────────────────────────────────────────┘
```

- Sidebar width: `56px` collapsed, `220px` expanded
- Icons: Phosphor Icons (duotone variant for active state)
- Active indicator: 3px teal left-border + teal icon
- Hover: subtle `bg-white/5` background

### EPG (TV Guide) Layout — "Timeline Grid"

```
         10:00    10:30    11:00    11:30    12:00
BBC 1  │ ██████████████████ │ ██████████████████ │
CNN    │ ████████████████████████████████████ │ ██
ESPN   │ ██ │ ████████████████ │ ██████████████ │
```

- Time axis: fixed top, horizontal scroll
- Channels: fixed left column (64px)
- Programs: color-coded by genre, rounded 4px
- "Now" indicator: teal vertical line

---

## 4. Animation Styles

### Micro-Interactions

| Interaction        | Duration | Easing        | Effect                    |
| ------------------ | -------- | ------------- | ------------------------- |
| Card hover         | 200ms    | `ease-out`    | scale(1.04) + border glow |
| Card unhover       | 150ms    | `ease-in`     | scale(1) + glow fade      |
| Button press       | 100ms    | `ease-in`     | scale(0.97)               |
| Button release     | 200ms    | `ease-out`    | scale(1)                  |
| Nav item hover     | 150ms    | `ease-out`    | bg fade in                |
| Badge pulse (LIVE) | 2000ms   | `ease-in-out` | opacity 0.4–1 infinite    |
| Progress bar fill  | 300ms    | `ease-out`    | width transition          |

### Page Transitions

```css
/* Route change */
@keyframes pageEnter {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
--transition-page: 250ms ease-out;

/* Content stagger */
@keyframes contentStagger {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
/* Apply with nth-child delay: calc(var(--index) * 60ms) */
```

### Player Controls Animation

```css
/* Controls fade in on hover */
.player-controls {
  transition: opacity 300ms ease;
}
.player:hover .player-controls,
.player.paused .player-controls {
  opacity: 1;
}

/* Progress scrubber expand on hover */
.progress-bar {
  height: 3px;
  transition: height 150ms ease;
}
.player:hover .progress-bar {
  height: 5px;
}
```

### Loading States

- Skeleton screens: `bg-white/5` animated shimmer `1.5s` linear infinite
- Spinner: teal ring, `1s` ease-in-out spin
- Buffer indicator: ambient glow pulse on play button
- Image load: fade in `400ms` after load event

### Scroll Behavior

- Horizontal rows: `scroll-snap-type: x mandatory` with `scroll-behavior: smooth`
- Hero parallax: `transform: translateY(calc(scrollY * 0.3))` on backdrop
- Sticky nav: `backdrop-filter: blur(20px)` when scrolled > 64px

---

## 5. Texture & Depth System

### Grain Overlay

```css
/* Subtle film grain — authenticity, not digital flatness */
.grain-overlay::after {
  content: "";
  position: fixed;
  inset: 0;
  background-image: url("/textures/grain-256.png");
  background-repeat: repeat;
  background-size: 256px;
  opacity: 0.035;
  pointer-events: none;
  z-index: 9999;
}
```

### Depth Layers

```
Layer 7: Navigation/Modals      z-index: 100+
Layer 6: Floating UI (tooltips) z-index: 50
Layer 5: Player controls        z-index: 20
Layer 4: Content cards (hover)  z-index: 10
Layer 3: Content cards          z-index: 1
Layer 2: Background glow        z-index: 0
Layer 1: Void background        z-index: -1
```

### Frosted Glass Components

```css
/* Used for: player overlay, modal backgrounds, EPG row headers */
.glass-surface {
  background: rgba(17, 17, 24, 0.75);
  backdrop-filter: blur(20px) saturate(1.2);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--card-radius-lg);
}
```

---

## Inspiration References

### Streaming & Media

- **Plex** — card grid rhythm, thumbnail quality
- **Apple TV+** — hero layout, typography weight
- **Mubi** — cinematic warmth, editorial feel
- **Letterboxd** — dark sophistication, community feel

### Design Tool References (SriniBytes Brand Tier)

- **Vercel** — clean dark mode, gradient usage
- **Linear** — micro-interaction quality, sidebar nav
- **Raycast** — command palette, keyboard-first design
- **Arc Browser** — sidebar UX, ambient depth

### Anti-Patterns to Avoid

| Pattern                     | Why Avoid                      |
| --------------------------- | ------------------------------ |
| Netflix bright red on black | Too aggressive, brand conflict |
| Generic blue gradient       | Cold, corporate, forgettable   |
| YouTube-style white         | Wrong tone for premium IPTV    |
| Flat card grids (no depth)  | Sterile, low-end feel          |
| Sans-serif only typography  | Missing editorial weight       |
| Hard drop shadows           | Dated, not ambient             |

---

_Next: [03-design-direction.md](./03-design-direction.md) — Chosen aesthetic + rationale_
