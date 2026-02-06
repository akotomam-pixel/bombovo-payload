# Quick Start Guide - Bombovo Website

## 🚀 Getting Your Website Running

### Step 1: Install Dependencies

Open your terminal in the project folder and run:

```bash
npm install
```

This will install all required packages:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- React Icons

### Step 2: Start Development Server

```bash
npm run dev
```

Then open your browser and go to: **http://localhost:3000**

You should see the Bombovo homepage! 🎉

---

## 📱 What You'll See

### Homepage (http://localhost:3000)

1. **Animated Top Bar** - "Tábory na leto 2026 sú v predaji!" scrolling across
2. **Navigation Header** - With logo, menu items, and CTA buttons
3. **Hero Section** - Main headline with purple/pink video placeholder
4. **Review Carousel** - 3 review cards (auto-scrolling on mobile)
5. **Camp Search Bar** - Filter dropdowns for finding camps
6. **4 Reasons Section** - Why choose Bombovo with numbered circles
7. **Top Camps** - 3 featured camp cards
8. **Footer** - Complete with links and contact info

### Placeholder Pages

Click any menu item and you'll see a page with "Pripravujeme" and a back button:
- Letné tábory
- Školy v prírode
- Adaptačné kurzy
- Prečo Bombovo?
- Hľadáčik táboru
- Kontakt
- And more...

---

## 🎨 Next Steps - Customization

### 1. Replace Video Placeholder

**File:** `components/HeroSection.tsx`

Find this section (around line 58):

```tsx
{/* Video placeholder with 16:9 aspect ratio */}
<div className="relative aspect-video bg-gradient-to-br from-purple-400 to-pink-400...">
```

Replace with:

```tsx
<video 
  className="w-full h-full object-cover rounded-2xl"
  autoPlay 
  muted 
  loop 
  playsInline
>
  <source src="/videos/hero-video.mp4" type="video/mp4" />
</video>
```

Then add your video file to: `public/videos/hero-video.mp4`

### 2. Add Real Reviews

**File:** `components/ReviewCarousel.tsx`

Update the `reviews` array (around line 5):

```tsx
const reviews = [
  {
    id: 1,
    author: 'Jana Nováková',
    content: 'Môj syn bol nadšený! Už sa teší na budúci rok.',
    date: 'Leto 2025',
    color: 'from-bombovo-blue to-blue-300',
  },
  // Add more reviews...
]
```

### 3. Add Real Camp Data

**File:** `components/TopCamps.tsx`

Update the `camps` array (around line 5):

```tsx
const camps = [
  {
    id: 1,
    name: 'Dobrodružný tábor v Tatrách',
    description: 'Týždeň plný hier, outdoorových aktivít a nových priateľstiev v krásnom prostredí Vysokých Tatier.',
    color: 'from-bombovo-blue to-blue-400',
  },
  // Add more camps...
]
```

### 4. Add Camp Images

1. Create folder: `public/images/camps/`
2. Add your images (e.g., `camp-1.jpg`)
3. Update `TopCamps.tsx`:

```tsx
<Image 
  src="/images/camps/camp-1.jpg" 
  alt="Camp name"
  width={400}
  height={300}
  className="w-full h-64 object-cover"
/>
```

### 5. Update Contact Information

**File:** `components/Footer.tsx`

Find the contact section and update:
- Phone number (around line 95)
- Email address (around line 100)
- Social media links in Header.tsx

### 6. Replace Logo

**File:** `components/Header.tsx`

Replace the placeholder circle (around line 30):

```tsx
<Image 
  src="/images/logo.png" 
  alt="Bombovo Logo"
  width={48}
  height={48}
/>
```

Add your logo to: `public/images/logo.png`

---

## 🔧 Common Customizations

### Change Colors

**File:** `tailwind.config.ts`

```typescript
colors: {
  'bombovo-dark': '#080708',    // Change these values
  'bombovo-blue': '#3772FF',
  'bombovo-red': '#DF2935',
  'bombovo-yellow': '#FDCA40',
  'bombovo-gray': '#E6E8E6',
}
```

### Change Fonts

**File:** `app/globals.css` (line 1)

Replace Google Fonts import:

```css
@import url('https://fonts.googleapis.com/css2?family=YourFont:wght@...&display=swap');
```

Then update `tailwind.config.ts`:

```typescript
fontFamily: {
  sans: ['YourFont', 'system-ui', 'sans-serif'],
}
```

### Adjust Animation Speed

**Review Carousel** - Change auto-scroll timing:

**File:** `components/ReviewCarousel.tsx` (line 46)

```tsx
}, 4000)  // Change to 5000 for 5 seconds, 3000 for 3 seconds
```

**Top Bar** - Change scroll speed:

**File:** `components/TopBar.tsx` (line 15)

```tsx
duration: 20,  // Lower = faster, Higher = slower
```

---

## 📋 Project Structure Reminder

```
/app
  ├── page.tsx              → Homepage
  ├── layout.tsx            → Main layout
  ├── globals.css           → Global styles
  └── [subpages]/           → All placeholder pages

/components
  ├── TopBar.tsx            → Section 0
  ├── Header.tsx            → Section 1
  ├── HeroSection.tsx       → Section 2
  ├── ReviewCarousel.tsx    → Section 3
  ├── CampSearch.tsx        → Section 4
  ├── FourReasons.tsx       → Section 5
  ├── TopCamps.tsx          → Section 6
  └── Footer.tsx            → Section 7

/public
  └── [your images/videos]  → Static files
```

---

## 🚀 Deploy to Production

### Option 1: Vercel (Recommended)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Deploy! (automatic)

### Option 2: Build Locally

```bash
npm run build
npm start
```

Your site will be available at port 3000.

---

## 🆘 Troubleshooting

### Problem: npm install fails

**Solution:** Make sure you have Node.js 18.17+ installed
```bash
node --version  # Should be v18.17.0 or higher
```

### Problem: Port 3000 is already in use

**Solution:** Use a different port
```bash
npm run dev -- -p 3001
```

### Problem: Images not showing

**Solution:** Make sure images are in the `public/` folder and paths start with `/`
```tsx
src="/images/photo.jpg"  ✅
src="images/photo.jpg"   ❌
```

### Problem: Styles not applying

**Solution:** Restart the dev server
```bash
# Stop server (Ctrl+C)
npm run dev  # Start again
```

---

## 📞 Support

If you need help:
1. Check `README.md` for detailed documentation
2. Check `RESPONSIVE-GUIDE.md` for responsive design info
3. Review the code comments in each component

---

## ✅ Checklist Before Going Live

- [ ] Replace video placeholder with real video
- [ ] Add real reviews with photos
- [ ] Add actual camp information
- [ ] Update contact details (phone, email)
- [ ] Add social media links
- [ ] Replace logo placeholder
- [ ] Add real images for all sections
- [ ] Test on mobile devices
- [ ] Test all navigation links
- [ ] Optimize images (compress, WebP format)
- [ ] Test page load speed
- [ ] Add Google Analytics (if needed)
- [ ] Set up contact form backend
- [ ] Add GDPR cookie notice
- [ ] Test across different browsers

---

**You're all set! Enjoy building your Bombovo website! 🎉**



