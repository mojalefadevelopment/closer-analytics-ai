# Design System Baseline

> iOS 26 Liquid Glass Design System for Closer Analytics

This document establishes the visual language used across the application, derived from the Landing page implementation. Use these patterns for consistency when building new features.

---

## Table of Contents

1. [Glassmorphism (Liquid Glass)](#1-glassmorphism-liquid-glass)
2. [Gradient System](#2-gradient-system)
3. [Card Variants](#3-card-variants)
4. [Icon Containers](#4-icon-containers)
5. [Animations](#5-animations)
6. [Typography Hierarchy](#6-typography-hierarchy)
7. [Section Dividers](#7-section-dividers)
8. [Parallax Background Elements](#8-parallax-background-elements)
9. [Interactive States](#9-interactive-states)
10. [Safe Area Handling](#10-safe-area-handling)
11. [Chart/Data Visualization](#11-chartdata-visualization)
12. [Reusable Pattern Summary](#12-reusable-pattern-summary)

---

## 1. Glassmorphism (Liquid Glass)

The signature visual style. Multiple layers of glass with varying opacity and blur.

### Level 1: Hero Glass Panel (strongest blur)

```css
background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%);
backdrop-filter: blur(40px) saturate(180%);
-webkit-backdrop-filter: blur(40px) saturate(180%);
border: 1px solid rgba(255,255,255,0.1);
box-shadow: 0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.15);
```

### Level 2: Header/Nav Glass

```css
background-color: var(--floating-nav-bg);
/* Dark: rgba(20, 22, 28, 0.65) | Light: rgba(255, 255, 255, 0.82) */
backdrop-filter: blur(var(--floating-nav-blur, 50px)) saturate(180%);
box-shadow: var(--floating-nav-shadow);
```

### Level 3: Interactive Glass (tabs, cards)

```css
background-color: var(--surface-glass-bg);
/* Dark: rgba(28, 30, 38, 0.45) | Light: rgba(255, 255, 255, 0.72) */
backdrop-filter: blur(30px) saturate(150%);
box-shadow: var(--surface-glass-shadow);
```

### Level 4: Pill Badge (nested glass)

```css
background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%);
backdrop-filter: blur(30px) saturate(180%);
border: 1px solid rgba(255,255,255,0.15);
box-shadow: 0 4px 16px rgba(0,0,0,0.08);
```

---

## 2. Gradient System

| Name | CSS | Usage |
|------|-----|-------|
| **Closer Blue** | `bg-gradient-to-r from-blue-500 to-cyan-500` | Closer CTAs, icons |
| **Manager Violet** | `bg-gradient-to-r from-violet-500 to-purple-500` | Manager CTAs, icons |
| **Success Green** | `bg-gradient-to-br from-green-500 to-emerald-400` | Connected states, success |
| **Warning Amber** | `bg-gradient-to-br from-amber-500 to-yellow-400` | Warning states |
| **Text Gradient** | `.text-gradient-primary` | Headlines emphasis |
| **Subtle Background** | `bg-gradient-to-b from-primary/3 via-transparent to-transparent` | Section overlays |
| **Diagonal Divider** | `bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5` | Section transitions |

### Gradient with Shadow

```tsx
// Icon container with matching shadow
<div className="bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/30">
```

---

## 3. Card Variants

### Elevated Card (default feature cards)

```tsx
<Card variant="elevated" className="p-6 md:p-7 hover:shadow-card-hover hover:-translate-y-1">
```

### Highlight Card (dashboard preview, active content)

```tsx
<Card variant="highlight" className="p-5 sm:p-6 md:p-8">
```

### Frosted CTA Card (persona selection, large interactive areas)

```tsx
<button
  className="rounded-3xl p-6 sm:p-8"
  style={{
    backgroundColor: 'var(--surface-glass-bg)',
    backdropFilter: 'blur(40px) saturate(180%)',
    WebkitBackdropFilter: 'blur(40px) saturate(180%)',
    boxShadow: 'var(--surface-glass-shadow), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
  }}
>
```

### Status Card (state-aware glass)

```tsx
<div
  className="rounded-3xl p-6 sm:p-8 relative overflow-hidden"
  style={{
    background: isPositive
      ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.08) 0%, rgba(16, 185, 129, 0.04) 100%)'
      : 'var(--glass-bg)',
    backdropFilter: 'blur(20px)',
    border: isPositive
      ? '1px solid rgba(34, 197, 94, 0.2)'
      : '1px solid var(--glass-border)',
  }}
>
```

---

## 4. Icon Containers

| Size | Classes | Usage |
|------|---------|-------|
| **Small (28px)** | `w-7 h-7 rounded-xl bg-{color}-500/15` | Feature bullet icons |
| **Medium (32px)** | `w-8 h-8 rounded-xl bg-{color}-500/15` | Detail card icons |
| **Large (40px)** | `w-10 h-10 rounded-xl bg-background-elevated/80` | Metric card icons |
| **XL (44px)** | `w-11 h-11 rounded-2xl bg-primary/10` | Section header icons |
| **XXL (56px)** | `w-14 h-14 rounded-2xl bg-gradient-to-br from-{color}-500 to-{color}-400 shadow-lg shadow-{color}-500/30` | CTA card icons, status icons |

### Icon with Hover Effect

```tsx
<div className="w-10 h-10 rounded-xl bg-background-elevated/80 flex items-center justify-center
                shadow-sm transition-all duration-300
                group-hover:bg-primary/15 group-hover:shadow-md group-hover:shadow-primary/10">
  <Icon size={18} className="text-primary transition-transform duration-300 group-hover:scale-110" />
</div>
```

---

## 5. Animations

### Entrance - Staggered

```css
.animate-slide-up {
  animation: slide-up 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
}
```

```tsx
// Usage with stagger
<div
  className="animate-slide-up"
  style={{ animationDelay: `${index * 0.05}s` }}
>
```

### Content Switch

```css
.animate-fade-in {
  animation: fade-in 0.2s cubic-bezier(0.4, 0.0, 0.2, 1);
}
```

### Hover Transforms

```tsx
// Subtle lift
className="hover:-translate-y-0.5"

// Feature card lift
className="hover:-translate-y-1"

// CTA card scale
className="hover:scale-[1.01] active:scale-[0.98]"

// Detail card scale
className="hover:scale-[1.02]"
```

---

## 6. Typography Hierarchy

| Element | Classes | Example |
|---------|---------|---------|
| **Hero H1** | `text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold` | "Track every deal" |
| **Section H2** | `text-3xl sm:text-4xl md:text-5xl font-bold` | "Your command center" |
| **Subsection H2** | `text-2xl sm:text-3xl md:text-4xl font-bold` | "How it works" |
| **Card H3** | `text-base font-semibold` or `text-lg sm:text-xl font-semibold` | Feature title |
| **Card Title** | `text-xl font-bold` | Status card header |
| **Label** | `text-xs text-text-muted` or `text-xs text-text-muted uppercase tracking-wider` | "Portfolio Value" |
| **Body** | `text-sm text-text-secondary leading-relaxed` | Descriptions |
| **Stat Value** | `text-2xl sm:text-3xl md:text-4xl font-semibold` | "$847,293" |

---

## 7. Section Dividers

### Wave Divider (curved)

```tsx
<div className="relative">
  <svg className="w-full h-12 sm:h-16" viewBox="0 0 1440 64" fill="none" preserveAspectRatio="none">
    <path
      d="M0 32L48 37.3C96 43 192 53 288 53.3C384 53 480 43 576 37.3C672 32 768 32 864 37.3C960 43 1056 53 1152 53.3C1248 53 1344 43 1392 37.3L1440 32V64H..."
      className="fill-surface/50"
    />
  </svg>
</div>
```

### Diagonal Divider (angled)

```tsx
<div className="relative h-16 sm:h-20 md:h-24 overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 transform -skew-y-2 origin-top-left scale-110" />
</div>
```

---

## 8. Parallax Background Elements

Blurred orbs with scroll-based parallax for depth:

```tsx
const [scrollY, setScrollY] = useState(0);

// Track scroll
useEffect(() => {
  const handleScroll = () => setScrollY(window.scrollY);
  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

// Render orb
<div
  className="absolute top-24 left-1/2 -translate-x-1/2 w-[720px] h-[520px] rounded-full bg-primary/10 blur-3xl opacity-40 pointer-events-none"
  style={{ transform: `translate(-50%, ${scrollY * 0.15}px)` }}
/>
```

### Decorative Orb (static)

```tsx
// Add visual interest to cards/sections
<div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-green-500/10 blur-3xl pointer-events-none" />
```

---

## 9. Interactive States

### Tab/Button Active State (glass effect)

```tsx
style={{
  backgroundColor: isActive ? 'var(--surface-glass-bg)' : 'transparent',
  backdropFilter: isActive ? 'blur(30px) saturate(150%)' : undefined,
}}
className={isActive ? 'shadow-card' : 'hover:bg-background-elevated/40'}
```

### Icon Hover Effect

```tsx
className="group-hover:bg-primary/15 group-hover:shadow-md group-hover:shadow-primary/10"
// Icon inside:
<Icon className="group-hover:scale-110 transition-transform duration-300" />
```

### Status Pill Badges

```tsx
// Positive (green)
className="px-4 py-2 rounded-full text-sm font-semibold bg-green-500/20 text-green-400 border border-green-500/30"

// Warning (amber)
className="px-4 py-2 rounded-full text-sm font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30"

// Neutral
className="px-4 py-2 rounded-full text-sm font-semibold bg-gray-500/20 text-gray-400 border border-gray-500/30"
```

---

## 10. Safe Area Handling

### Header Padding (notch devices)

```tsx
style={{ paddingTop: 'var(--sat, env(safe-area-inset-top))' }}
```

### Section Horizontal Padding

```tsx
style={{
  paddingLeft: 'max(1rem, var(--sal, env(safe-area-inset-left)))',
  paddingRight: 'max(1rem, var(--sar, env(safe-area-inset-right)))',
}}
```

---

## 11. Chart/Data Visualization

### Bar Chart with Hover Tooltip

```tsx
<div className="group/bar relative flex-1 flex flex-col items-center">
  {/* Tooltip */}
  <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-background-elevated shadow-lg
                  opacity-0 group-hover/bar:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
    <span className="text-[10px] font-medium text-text-primary">${value}</span>
  </div>

  {/* Bar with gradient fill */}
  <div className="w-full rounded-t-md bg-primary/12 group-hover/bar:bg-primary/25
                  group-hover/bar:scale-x-110 origin-bottom transition-all duration-300">
    <div className="w-full h-full rounded-t-md bg-gradient-to-t from-primary/40 to-primary/10
                    group-hover/bar:from-primary/60 group-hover/bar:to-primary/20" />
  </div>
</div>
```

---

## 12. Reusable Pattern Summary

| Pattern | When to Use |
|---------|-------------|
| **Glass Panel** | Hero sections, modals, floating UI |
| **Elevated Card** | Feature grids, metric displays |
| **Frosted CTA** | Large clickable areas with rich content |
| **Status Card** | State-aware containers (connected/warning/error) |
| **Gradient Button** | Primary actions (persona-specific colors) |
| **Gradient Icon Container** | Status indicators, large icons needing visual weight |
| **Icon Container (small)** | Anywhere an icon needs subtle visual weight |
| **Staggered Animation** | Grid/list entrance animations |
| **Hover Lift** | Clickable cards and interactive elements |
| **Wave/Diagonal Divider** | Section transitions |
| **Decorative Orb** | Add visual interest to prominent sections |
| **Status Pill** | Connection states, badges with semantic color |

---

## CSS Variables Reference

```css
/* Glass backgrounds */
--surface-glass-bg: rgba(28, 30, 38, 0.45);  /* dark */
--surface-glass-bg: rgba(255, 255, 255, 0.72); /* light */

/* Navigation */
--floating-nav-bg: rgba(20, 22, 28, 0.65);  /* dark */
--floating-nav-bg: rgba(255, 255, 255, 0.82); /* light */
--floating-nav-blur: 50px;
--floating-nav-shadow: /* see index.css */

/* Shadows */
--surface-glass-shadow: /* layered shadow for depth */
--surface-glass-shadow-hover: /* enhanced hover shadow */

/* Safe areas */
--sat: env(safe-area-inset-top);
--sab: env(safe-area-inset-bottom);
--sal: env(safe-area-inset-left);
--sar: env(safe-area-inset-right);
```

---

## Examples in Codebase

| Pattern | Reference File |
|---------|----------------|
| Full glassmorphism implementation | `src/pages/Landing.tsx` |
| Status card with glass | `src/pages/AirtableIntegration.tsx` |
| Persona landing with calculators | `src/pages/PersonaLanding.tsx` |
| Feature cards with hover | `src/pages/Landing.tsx` (features section) |
| Interactive tabs | `src/pages/Landing.tsx` (ICP journeys) |

---

*Last updated: January 2026*
