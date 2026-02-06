# Bombovo Website 1.6

Modern website for Bombovo - Slovak summer camps for children aged 6-17 years old.

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Icons** - Icon library

## Getting Started

### Prerequisites

Make sure you have Node.js 18.17 or later installed on your machine.

### Installation

1. Install dependencies:

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the website.

### Build for Production

Build the optimized production version:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Project Structure

```
├── app/                          # Next.js App Router pages
│   ├── page.tsx                 # Homepage
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Global styles
│   ├── letne-tabory/           # Summer camps page
│   ├── skoly-v-prirode/        # Schools in nature page
│   ├── adaptacne-kurzy/        # Adaptation courses page
│   ├── preco-bombovo/          # Why Bombovo page
│   ├── hladacik-taboru/        # Camp finder page
│   ├── kontakt/                # Contact page
│   └── ...                      # Other subpages
├── components/                  # React components
│   ├── TopBar.tsx              # Animated top announcement bar
│   ├── Header.tsx              # Navigation header
│   ├── HeroSection.tsx         # Hero section with video
│   ├── ReviewCarousel.tsx      # Auto-scrolling reviews
│   ├── CampSearch.tsx          # Camp search/filter bar
│   ├── FourReasons.tsx         # 4 reasons section
│   ├── TopCamps.tsx            # Featured camps section
│   ├── Footer.tsx              # Footer
│   └── PlaceholderPage.tsx     # Template for placeholder pages
├── public/                      # Static files (images, videos, etc.)
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Project dependencies

```

## Design System

### Colors

- **Primary Text**: `#080708` (bombovo-dark)
- **Blue**: `#3772FF` (bombovo-blue)
- **Red**: `#DF2935` (bombovo-red)
- **Yellow**: `#FDCA40` (bombovo-yellow)
- **Gray**: `#E6E8E6` (bombovo-gray)
- **Background**: `#FFFFFF` (white)

### Typography

- **Primary Font**: Poppins (Geometric Sans-Serif)
- **Accent Font**: Caveat (Handwritten Script)

### Design Principles

- Warm, playful, trustworthy, and high energy
- Large rounded corners (`rounded-3xl`)
- Big friendly buttons
- Lots of white space
- Gentle scroll animations with Framer Motion
- Mobile-first responsive design

## Features

### Homepage Sections

1. **Top Bar** - Animated announcement banner
2. **Header** - Navigation with social links and menu
3. **Hero Section** - Main headline with video placeholder (16:9)
4. **Review Carousel** - Auto-scrolling testimonials (4-second intervals)
5. **Camp Search** - Filter bar with dropdowns (age, date, type)
6. **4 Reasons** - Why choose Bombovo with numbered circles
7. **Top Camps** - Featured summer camps
8. **Footer** - Links and contact information

### Placeholder Pages

All subpages currently show "Pripravujeme" (Coming Soon) with working navigation back to homepage.

## Customization

### Adding Real Content

1. **Video**: Replace the video placeholder in `HeroSection.tsx` with actual video
2. **Reviews**: Update review content in `ReviewCarousel.tsx`
3. **Camp Cards**: Add real camp data in `TopCamps.tsx`
4. **Images**: Add images to the `public/` folder and update component references

### Updating Colors

Edit the color palette in `tailwind.config.ts`:

```typescript
colors: {
  'bombovo-dark': '#080708',
  'bombovo-blue': '#3772FF',
  'bombovo-red': '#DF2935',
  'bombovo-yellow': '#FDCA40',
  'bombovo-gray': '#E6E8E6',
}
```

## Responsive Design

The website is fully responsive with breakpoints:

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

All sections adapt appropriately for different screen sizes with mobile-first approach.

## Performance

- Optimized for fast loading
- Lazy loading for images
- Minimal JavaScript bundle
- Server-side rendering with Next.js

## License

© 2025 Bombovo. All rights reserved.



