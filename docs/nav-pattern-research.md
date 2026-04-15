# Navigation Pattern Research — SRI-19

## Current Pattern (TopNav + GlobalNav Tabs)

```
[ Logo ] ─────────────────────────── [ Profile ]   ← TopNav (fixed top)
[ Telugu ][ Hindi ][ English ][ Sports ][ Search ]  ← GlobalNav (horizontal tabs)
┌─────────────────────────────────────────────────┐
│                    Content                       │
└─────────────────────────────────────────────────┘
```

### Problems

- Horizontal tabs shrink on TV (small touch targets for D-pad)
- No clear hierarchy — nav items compete with content
- Wastes vertical space on TV (valuable real estate)
- D-pad: user must navigate all the way to top to change section

---

## Prototype A: Collapsible Left Sidebar (CHOSEN)

```
┌──┬────────────────────────────────────────────┐
│▶│                                            │
│📺│          Content Area                      │
│🎬│                                            │
│🔍│                                            │
│⚙ │                                            │
└──┴────────────────────────────────────────────┘
↑ Collapsed (48px wide, icon-only)

┌────────────┬──────────────────────────────────┐
│ StreamVault│                                   │
│            │                                   │
│ ▶ Home     │          Content Area             │
│ 📺 TV Live  │                                   │
│ 🎬 VOD      │                                   │
│ 🔍 Search   │                                   │
│ ⚙ Settings │                                   │
└────────────┴──────────────────────────────────┘
↑ Expanded (220px, when nav focused)
```

**D-pad behavior:**

- Press Left from content → sidebar expands, last item focused
- Press Right from sidebar → collapses, returns focus to content
- Up/Down within sidebar → move between nav items
- Enter on item → navigate, sidebar collapses

**TV safe zone:** Sidebar sits within 20px left margin, expands inward (never beyond viewport)

**Trade-offs:**

- ✅ Industry standard for streaming apps (Netflix, Disney+, Prime)
- ✅ Scales to any number of sections
- ✅ D-pad friendly — single column is easy to navigate
- ✅ More screen real estate in collapsed state
- ✅ Works on TV, Desktop (hover to expand), Mobile (slide-out drawer)
- ⚠ Requires spatial nav boundary to prevent accidental left → exit

---

## Prototype B: Floating Bottom Bar (mobile-first alternative)

```
┌─────────────────────────────────────────────────┐
│ Logo                                 [ Profile ] │ ← TopNav (minimal)
│                                                  │
│                  Content Area                    │
│                                                  │
│                                                  │
├──────────────────────────────────────────────────┤
│ 🏠 Home  📺 Live  🎬 VOD  🔍 Search  ⚙ Settings │ ← Bottom bar
└──────────────────────────────────────────────────┘
```

**Trade-offs:**

- ✅ Excellent for mobile/touchscreen
- ✅ Common pattern (YouTube, Instagram)
- ❌ Bottom of screen is problematic on TV (overscan issues)
- ❌ D-pad: user must navigate DOWN past all content to reach nav
- ❌ Not how streaming TV apps work (breaks user expectation)

---

## Decision: Prototype A (Left Sidebar)

**Rationale:**

1. Left sidebar is the de facto TV streaming nav pattern (Netflix, Disney+, Hulu, Apple TV+)
2. D-pad traversal is natural: Left arrow always opens nav
3. Collapsed icon-only state preserves content viewing area
4. Works across all platforms with different expansion behaviors:
   - TV: collapsed by default, expands on left-arrow press
   - Desktop: expands on hover
   - Mobile: burger menu → slide-out drawer

**Grill score considerations:**

- TV usability: 5/5 (industry-standard pattern, users know it)
- Focus management: 5/5 (spatial nav boundary prevents escape)
- Spatial nav efficiency: 4.5/5 (left arrow = nav, right arrow = content)

---

## Page Layout Templates

### HomeLayout

```
SideNav | HeroBanner (cinematic, full-width)
        | ContinueWatching rail
        | FeaturedRail
        | Category rails
```

### GridLayout

```
SideNav | PageHeader + FilterBar
        | Poster grid (responsive columns)
```

### DetailLayout

```
SideNav | Full-bleed hero (parallax bg)
        | Metadata panel (title, rating, description, cast)
        | Related content rail
```

### PlayerLayout (existing, unchanged)

```
No nav  | Full-screen video
        | Overlay controls
```
