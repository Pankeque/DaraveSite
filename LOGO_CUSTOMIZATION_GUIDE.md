# Logo Customization Guide

This guide explains how to add your custom logo images to the Darave Studios website.

## Overview

There are two main places where you can add custom logo images:

1. **Navbar Logo (DS™)** - The logo in the top-left corner of the navigation bar
2. **Hero Section Title (Darave Studios)** - The main title in the landing page hero section

## Step-by-Step Instructions

### 1. Prepare Your Logo Images

Before starting, make sure you have your logo images ready:

- **Navbar Logo**: Recommended size 40x40px to 80x80px (PNG or SVG format)
- **Hero Logo**: Recommended size 800x200px or larger (PNG or SVG format)
- Use transparent backgrounds (PNG) for best results
- Optimize images for web to reduce file size

### 2. Add Images to the Project

1. Place your logo images in the `client/public/` directory
2. Recommended naming:
   - `logo-navbar.png` or `logo-navbar.svg` for the navbar logo
   - `logo-hero.png` or `logo-hero.svg` for the hero section logo

### 3. Update the Navbar Logo

Open the file: `client/src/pages/Home.tsx`

Find this section (around line 31-37):

```tsx
<motion.div 
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  className="text-white font-bold text-xl tracking-tighter"
>
  DS™
</motion.div>
```

Replace it with:

```tsx
<motion.div 
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  className="flex items-center"
>
  <img 
    src="/logo-navbar.png" 
    alt="Darave Studios Logo" 
    className="h-10 w-auto"
  />
</motion.div>
```

### 4. Update the Hero Section Logo

In the same file (`client/src/pages/Home.tsx`), find this section (around line 147-155):

```tsx
<motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, ease: "easeOut" }}
>
  <h1 className="text-5xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter text-white mb-6">
    Darave <span className="text-zinc-600">Studios</span>
  </h1>
</motion.div>
```

Replace it with:

```tsx
<motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, ease: "easeOut" }}
  className="flex justify-center mb-6"
>
  <img 
    src="/logo-hero.png" 
    alt="Darave Studios" 
    className="max-w-full h-auto md:max-w-3xl lg:max-w-4xl"
  />
</motion.div>
```

### 5. Update the Footer Logo (Optional)

Find this section in the footer (around line 251):

```tsx
<div className="text-white font-bold text-3xl tracking-tighter">DS™</div>
```

Replace it with:

```tsx
<img 
  src="/logo-navbar.png" 
  alt="Darave Studios Logo" 
  className="h-12 w-auto"
/>
```

## Alternative: Using Background Images

If you want to use a background image in the hero section instead of replacing the text:

1. Add your background image to `client/public/` (e.g., `hero-background.jpg`)

2. Update the hero section in `client/src/pages/Home.tsx` (around line 140):

```tsx
<section id="home" className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
  {/* Add background image */}
  <div 
    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
    style={{ backgroundImage: 'url(/hero-background.jpg)' }}
  />
  
  <RippleBackground />
  
  {/* Rest of the hero content */}
  <motion.div 
    style={{ opacity: heroOpacity, scale: heroScale }}
    className="relative z-10 text-center px-4"
  >
    {/* ... */}
  </motion.div>
</section>
```

## Tips for Best Results

1. **Image Optimization**: Use tools like TinyPNG or ImageOptim to compress images
2. **SVG Format**: Consider using SVG for logos as they scale perfectly at any size
3. **Responsive Design**: Test your logos on different screen sizes (mobile, tablet, desktop)
4. **Color Contrast**: Ensure your logo has good contrast against the background
5. **Loading Performance**: Keep image file sizes under 200KB for optimal loading

## Troubleshooting

### Logo Not Showing Up?

1. Check that the image path is correct (should start with `/`)
2. Verify the image file is in the `client/public/` directory
3. Clear your browser cache and refresh the page
4. Check the browser console for any error messages

### Logo Too Large or Too Small?

Adjust the CSS classes:
- For navbar: Change `h-10` to `h-8`, `h-12`, etc.
- For hero: Adjust `md:max-w-3xl` to your preferred size

### Logo Not Centered?

Add these classes to the parent div:
```tsx
className="flex items-center justify-center"
```

## Need Help?

If you encounter any issues, check:
1. Browser developer console for errors
2. Image file format compatibility
3. File permissions in the public directory

---

**Note**: After making changes, the development server should automatically reload. If not, restart it with `npm run dev`.
