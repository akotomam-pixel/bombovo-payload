# Responsive Design Guide

## Overview

The Bombovo website is built with a **mobile-first approach** and fully responsive across all devices. Below is a breakdown of how each section adapts to different screen sizes.

## Breakpoints

- **Mobile**: < 768px (sm)
- **Tablet**: 768px - 1024px (md)
- **Desktop**: 1024px+ (lg)

---

## Section-by-Section Responsive Behavior

### Section 0: Top Bar

**Mobile**
- Text size: `text-sm` (14px)
- Single scrolling line
- Full width scrolling animation

**Tablet & Desktop**
- Text size: `text-base` (16px)
- Smooth continuous scrolling
- Same animation behavior

---

### Section 1: Header/Navigation

**Mobile** (< 768px)
- Social icons: Full width row at top
- Logo: Centered below social
- Menu items: Stacked vertically, centered
- CTA buttons: Full width, stacked vertically
- Adequate padding between elements

**Tablet** (768px - 1024px)
- Social icons: Top left
- Logo + menu items: Single row, wrapped as needed
- CTA buttons: Horizontal row, smaller padding

**Desktop** (> 1024px)
- Social icons: Top left with text "Nájdeš nás:"
- Logo + 4 menu items: Left side
- 2 CTA buttons: Right side
- All on same line with space-between

---

### Section 2: Hero Section

**Mobile**
- Layout: Vertical stack
- Content first, then video
- Headline: `text-4xl` (36px)
- Buttons: Full width, stacked vertically
- Video: Full width with 16:9 aspect ratio
- Padding: 12px vertical

**Tablet**
- Headline: `text-5xl` (48px)
- Buttons: Horizontal row
- Video: Maintains aspect ratio
- Padding: 16px vertical

**Desktop**
- Layout: Two-column horizontal
- Left column (40-45%): Content
- Right column (55-60%): Video
- Headline: `text-6xl` (60px)
- Gap: 48px between columns
- Content: Vertically centered
- Padding: 20px vertical

---

### Section 3: Review Carousel

**Mobile**
- Display: Single review at a time
- Auto-carousel: Scrolls every 4 seconds
- Navigation: Dot indicators at bottom
- Cards: Full width
- Images: Full width, 256px height

**Tablet & Desktop**
- Display: 3 columns side-by-side
- All reviews visible simultaneously
- No carousel on desktop (static grid)
- Cards: Equal width with gap
- Hover effects: Lift up on hover

---

### Section 4: Camp Search/Filter Bar

**Mobile**
- Layout: Vertical stack
- Each dropdown: Full width
- Height: 64px per dropdown
- Search button: Full width at bottom
- Spacing: 16px gap between elements

**Tablet**
- Layout: Begins to go horizontal
- Dropdowns: 2x2 grid or wrap as needed
- Button: Separate row or end of flex

**Desktop**
- Layout: Single horizontal row
- 3 dropdowns + 1 button
- Equal width dropdowns
- Button: Auto width, distinct styling
- Height: 64px uniform
- Gap: 16px between elements

---

### Section 5: Four Reasons

**Mobile**
- Layout: Vertical stack
- Each reason: Full width card
- Number circle: Centered above card
- Images: Below text content
- Connecting line: Vertical on left side
- Spacing: 48px between reasons

**Tablet**
- Layout: Begins alternating left/right
- Number circle: Between content and image
- Images: Start appearing side-by-side with text
- Cards: Larger padding

**Desktop**
- Layout: Alternating horizontal rows
  - Odd rows: Content left, circle center, image right
  - Even rows: Image left, circle center, content right
- Connecting line: Vertical in center
- Circle size: 96px diameter
- Hover: Circle rotates 360°, cards lift up
- Spacing: 48px vertical between reasons

---

### Section 6: Top Camps

**Mobile**
- Layout: Single column
- Each card: Full width
- Image height: 256px
- Cards: Stacked vertically
- Spacing: 32px between cards

**Tablet**
- Layout: 2 columns
- Cards: 2 per row
- Equal width with gap

**Desktop**
- Layout: 3 columns
- Cards: Equal width, side-by-side
- Image height: 256px
- Gap: 32px between cards
- Hover: Cards lift up 8px

---

### Section 7: Footer

**Mobile**
- Layout: Single column
- All sections stacked vertically
- Logo & description: Full width
- Quick links: Full width
- Information: Full width
- Contact: Full width
- Bottom bar: Stacked (copyright + links)
- Spacing: 32px between sections

**Tablet**
- Layout: 2x2 grid
- Sections pair up
- Bottom bar: Still stacked

**Desktop**
- Layout: 4 columns equal width
- All sections in single row
- Bottom bar: Horizontal (copyright left, links right)
- Social icons: Horizontal row
- Spacing: Adequate gap between columns

---

## Common Responsive Patterns

### Typography Scaling

```
Mobile → Tablet → Desktop
text-3xl (30px) → text-4xl (36px) → text-5xl (48px)  [Headlines]
text-base (16px) → text-lg (18px) → text-xl (20px)   [Body]
```

### Container Padding

```
Mobile: px-4 (16px)
Tablet: px-6 (24px)
Desktop: px-8 (32px)
Max-width: 7xl (1280px) centered
```

### Button Sizes

```
Mobile: w-full py-4 (Full width, 16px vertical padding)
Desktop: w-auto px-8 py-4 (Auto width, 32px horizontal padding)
```

### Animation Behavior

- All Framer Motion animations work on all devices
- Scroll-triggered animations: `viewport={{ once: true }}`
- Hover effects: Only active on hover-capable devices
- Touch devices: Tap feedback with `whileTap`

---

## Testing Checklist

- [ ] Homepage loads correctly on all devices
- [ ] Navigation menu is accessible on mobile
- [ ] All buttons are tappable (min 44x44px touch target)
- [ ] Text is readable (min 16px body text)
- [ ] Images scale properly
- [ ] No horizontal scrolling
- [ ] Animations perform smoothly
- [ ] Forms are usable on mobile
- [ ] Footer links are accessible
- [ ] Page loads quickly (< 3s on 3G)

---

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 10+)

---

## Performance Optimization

- Images: Use WebP format with fallbacks
- Fonts: Preloaded Google Fonts
- CSS: Tailwind CSS tree-shaking
- JavaScript: Code splitting with Next.js
- Lazy loading: Images below the fold
- Critical CSS: Inlined for above-the-fold content



