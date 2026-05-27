# AuriAI Design System (Source of Truth)

## Typography

### Font Families
- **Headlines/Display**: Host Grotesk (use `font-headline` class)
- **Body/UI Text**: Inter (use `font-body` class)
- **Serif (Optional)**: DM Serif Text / Playfair Display (use `font-serif` class)

### Typography Scale
| Element | Class | Size | Weight | Usage |
|---------|-------|------|--------|-------|
| Heading 1 | `text-6xl font-headline font-bold` | 60px | 700 | Page titles, hero headings |
| Heading 2 | `text-5xl font-headline font-bold` | 48px | 700 | Section titles |
| Heading 3 | `text-4xl font-headline font-bold` | 36px | 700 | Subsection titles |
| Heading 4 | `text-3xl font-headline font-semibold` | 30px | 600 | Card titles, component headers |
| Heading 5 | `text-2xl font-headline font-semibold` | 24px | 600 | Small section headers |
| Heading 6 | `text-xl font-headline font-semibold` | 20px | 600 | Smallest headings |
| Large Body | `text-lg font-body` | 18px | 400 | Intro paragraphs, emphasis text |
| Base Body | `text-base font-body` | 16px | 400 | Default body text |
| Small Text | `text-sm font-body` | 14px | 400 | Captions, helper text |
| Extra Small | `text-xs font-body` | 12px | 400 | Labels, metadata |

### Font Weights
- **Normal**: `font-normal` (400) - Default body text
- **Medium**: `font-medium` (500) - Emphasized text
- **Semibold**: `font-semibold` (600) - Subheadings, buttons
- **Bold**: `font-bold` (700) - Main headings, strong emphasis

---

## Color Palette

### Brand Colors (HSL Format)
```css
--primary: 27 91% 55%      /* #F48022 - Startup Orange */
--secondary: 351 100% 50%  /* #FF0028 - Pitch Red */
--accent: 27 100% 67%      /* #FFA155 - Ambition Gold */
--danger: 351 100% 50%     /* #FF0028 - Pitch Red */
```

### Neutrals
```css
--background: 0 0% 7%      /* #111111 - Dark Black (main background) */
--surface: 0 0% 85%        /* #D9D9D9 - Prototype Gray (light surfaces) */
--foreground: 0 0% 7%      /* #111111 - Dark Black (text color) */
--muted: 0 0% 40%          /* Muted gray for secondary text */
```

### Usage in Tailwind
- `bg-primary` / `text-primary` / `border-primary`
- `bg-secondary` / `text-secondary` / `border-secondary`
- `bg-accent` / `text-accent` / `border-accent`
- `bg-foreground` / `text-foreground` (dark backgrounds)
- `bg-surface` / `text-surface` (light surfaces)

### Color Opacity Modifiers
Use Tailwind's opacity syntax: `bg-primary/40`, `text-white/70`, `border-white/10`

---

## Spacing System

### Standard Spacing Scale (Tailwind)
- `p-1` / `m-1` = 4px
- `p-2` / `m-2` = 8px
- `p-3` / `m-3` = 12px
- `p-4` / `m-4` = 16px
- `p-6` / `m-6` = 24px
- `p-8` / `m-8` = 32px
- `p-12` / `m-12` = 48px
- `p-16` / `m-16` = 64px
- `p-20` / `m-20` = 80px

### Common Spacing Patterns
- **Component Padding**: `px-6 py-4` or `p-8`
- **Section Margins**: `mb-16` or `mb-20`
- **Card Padding**: `px-4 py-3`
- **Button Padding**: 
  - Small: `px-3 py-1.5`
  - Medium: `px-4 py-2`
  - Large: `px-6 py-3`

---

## Border Radius

### Radius Scale
- `rounded-md` = 6px (small cards, inputs)
- `rounded-lg` = 8px (default cards)
- `rounded-xl` = 12px (buttons, larger cards)
- `rounded-2xl` = 16px (sections, containers)
- `rounded-full` = 9999px (circular buttons, avatars)

### Component-Specific Radius
- **Cards**: `rounded-xl` or `rounded-2xl`
- **Buttons**: `rounded-xl`
- **Inputs**: `rounded-lg`
- **Sections**: `rounded-2xl`
- **Special Button**: `rounded-full`

---

## Buttons

### CustomButton Component

#### Variants
**Primary** (Red Glow)
- Border: `border-secondary/40`
- Shadow: `shadow-[0_0_20px_rgba(255,0,40,0.6)]`
- Hover Shadow: `shadow-[0_0_30px_rgba(255,0,40,0.8)]`
- Fill Color: `bg-secondary` (on hover)
- Usage: Main CTAs, primary actions

**Secondary** (Orange Glow)
- Border: `border-primary/40`
- Shadow: `shadow-[0_0_20px_rgba(244,128,34,0.6)]`
- Hover Shadow: `shadow-[0_0_30px_rgba(244,128,34,0.8)]`
- Fill Color: `bg-primary` (on hover)
- Usage: Secondary actions, alternative CTAs

#### Sizes
- **Small**: `text-xs px-3 py-1.5 min-w-16 h-8`
- **Medium**: `text-sm px-4 py-2 min-w-20 h-10` (default)
- **Large**: `text-base px-6 py-3 min-w-24 h-12`

#### Animation
- Skewed fill animation from left to right on hover
- Duration: 400ms ease-out
- Active state: `scale-95`

### SpecialButton Component
- **Shape**: Circular (`w-14 h-14 rounded-full`)
- **Border**: `border-secondary`
- **Icon**: Arrow pointing top-right diagonal (rotated -45deg)
- **Animation**: Same skewed fill as CustomButton
- **Usage**: Navigation, external links, special actions

---

## Cards

### Card Component

#### Variants
- **Default**: `bg-surface/10 border border-white/10`
- **Glass**: Uses `.glass` utility (glassmorphism effect)
- **Bordered**: `bg-transparent border-2 border-white/20`

#### Radius Options
- `sm` = `rounded-md`
- `md` = `rounded-lg`
- `lg` = `rounded-xl` (default)
- `xl` = `rounded-2xl`

#### Features
- **Hoverable**: Adds `hover:scale-105` transform
- **CardImage**: Built-in skeleton loading animation
- **CardFooter**: 
  - Can be absolute positioned (overlays image)
  - Blurred backdrop: `backdrop-blur-md bg-white/10`
  - Bordered: `border border-white/20`
  - Rounded: `rounded-xl`
  - Padding: `px-4 py-3`

---

## Accordion

### Variants
- **Default**: `bg-surface/10 border border-white/10`
- **Bordered**: `border-2 border-white/20`
- **Glass**: Uses `.glass` utility

### Selection Modes
- **Single**: Only one item can be expanded at a time
- **Multiple**: Multiple items can be expanded simultaneously

### Styling
- **Container**: `rounded-xl overflow-hidden`
- **Item Border**: `border-b border-white/10 last:border-b-0`
- **Header Padding**: `px-6 py-4`
- **Content Padding**: `px-6 py-4`
- **Hover State**: `hover:bg-white/5`
- **Expanded State**: `bg-white/5`
- **Chevron**: Rotates 180deg when expanded

---

## Effects & Utilities

### Glass Morphism (`.glass`)
```css
background: hsl(0 0% 100% / 0.08);
backdrop-filter: blur(16px);
border: 1px solid hsl(0 0% 100% / 0.12);
box-shadow: var(--shadow-elegant);
```

### Shadows
- **Elegant Shadow**: `shadow-elegant` → `0 10px 30px -10px hsl(var(--foreground) / 0.25)`
- **Custom Glow Shadows**: Used in buttons for neon glow effect

### Gradients
- **Primary Gradient**: `linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))`
- **Usage**: `bg-gradient-to-r from-primary via-accent to-secondary`
- **Text Gradient**: `bg-clip-text text-transparent`

### Animations

#### Fade In
```css
.animate-fade-in /* 1s fade in */
```

#### Fade In Up with Blur
```css
.animate-fade-in-up /* Initial state: opacity-0, blur(10px), translateY(30px) */
.blur-in /* Trigger class: opacity-1, blur(0), translateY(0) */
```

#### Skeleton Loading
```css
.animate-shimmer /* 2s infinite shimmer effect */
```

#### Flip Card
```css
.flip-card:hover .flip-card-inner /* rotateY(180deg) */
```

#### Spin Slow
```css
.animate-spin-slow /* 5s infinite rotation */
```

---

## Design Rules

### 1. Semantic Tokens Only
❌ Never use: `bg-[#F48022]`, `text-[#FF0028]`  
✅ Always use: `bg-primary`, `text-secondary`, `hsl(var(--primary))`

### 2. Mobile-First Responsive Design
- Use Tailwind's responsive prefixes: `md:`, `lg:`, `xl:`
- Default styles apply to mobile
- Example: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

### 3. Consistent Spacing
- Use Tailwind's spacing scale (multiples of 4px)
- Common gaps: `gap-4`, `gap-6`, `gap-8`
- Section spacing: `mb-16`, `mb-20`

### 4. Border Consistency
- Use opacity modifiers: `border-white/10`, `border-white/20`
- Standard border width: `border` (1px) or `border-2` (2px)

### 5. Hover & Focus States
- All interactive elements must have hover states
- Use `transition-all duration-300` or similar
- Common hover: `hover:scale-105`, `hover:bg-white/5`

### 6. Accessibility (WCAG AA)
- Maintain sufficient color contrast
- Use `aria-label` for icon buttons
- Ensure keyboard navigation works
- Use semantic HTML elements

### 7. Typography Hierarchy
- Use `font-headline` for all headings
- Use `font-body` for all body text and UI elements
- Maintain consistent font weights per element type

### 8. Component Composition
- Build complex UIs by composing smaller components
- Keep components reusable and prop-driven
- Use consistent prop naming conventions

---

## Implementation Checklist

When creating new components:
- [ ] Use semantic color tokens (no hardcoded colors)
- [ ] Apply appropriate border radius from scale
- [ ] Add hover/focus states for interactive elements
- [ ] Use `font-headline` or `font-body` classes
- [ ] Include responsive breakpoints if needed
- [ ] Add proper spacing using Tailwind scale
- [ ] Test on mobile, tablet, and desktop
- [ ] Ensure WCAG AA contrast compliance
- [ ] Add loading/error states where applicable
- [ ] Include proper TypeScript types

---

## Quick Reference

### Most Common Classes
```css
/* Containers */
.glass                          /* Glassmorphism effect */
rounded-xl                      /* Standard border radius */
px-6 py-4                       /* Standard padding */

/* Text */
font-headline font-bold         /* Headings */
font-body text-white/80         /* Body text */

/* Colors */
bg-foreground                   /* Dark background */
text-primary                    /* Orange text */
border-white/10                 /* Subtle borders */

/* Effects */
shadow-elegant                  /* Standard shadow */
hover:scale-105                 /* Hover lift */
transition-all duration-300     /* Smooth transitions */
```

### File Locations
- **CSS Variables**: `/src/index.css`
- **Tailwind Config**: `/tailwind.config.ts`
- **Components**: `/src/widgets/`
- **Pages**: `/src/*.tsx`
