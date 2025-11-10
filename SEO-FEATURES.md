# SEO Features Implemented

## Page-Level SEO

### Metadata
- Unique `<title>` and `<meta description>` for every page
- Open Graph (og:) tags for social media sharing
- Twitter Card meta tags
- Canonical URLs configured via metadataBase
- Keywords meta tags on main pages
- Robots meta tags (index, follow)

### Dynamic Pages
All product pages use `generateMetadata()` to create unique SEO metadata based on product data.

## Structured Data

### JSON-LD Schema
Product pages include Product schema with:
- Product name
- Image
- Description
- Price information
- Availability status

Search engines can use this to create rich snippets in search results.

## Image Optimization

- All images use Next.js `<Image>` component
- Automatic image optimization
- Proper `alt` attributes on all images
- Lazy loading for non-critical images
- Priority loading for hero images
- Responsive sizes configuration

## Performance

- Static Site Generation (SSG) for all pages
- Minimal bundle sizes
- Fast load times
- Optimized Core Web Vitals

## Sitemap & Robots

- Dynamic sitemap.xml generation (`/sitemap.xml`)
- Robots.txt configuration (`/robots.txt`)
- All pages and products included in sitemap
- Proper priority and change frequency settings

## Semantic HTML

- Proper use of semantic tags:
  - `<header>`, `<main>`, `<footer>`
  - `<section>`, `<article>`
  - `<nav>` for navigation
  - `<h1>` through `<h6>` hierarchy
  - `<address>` for contact info

## Mobile Optimization

- Fully responsive design
- Mobile-first approach
- Touch-friendly navigation
- Optimized for all screen sizes

## URL Structure

Clean, descriptive URLs:
- `/watches` - Category pages
- `/watches/classic-leather-chronograph` - Product pages
- No query parameters or complex routing

## Accessibility

- Proper ARIA labels where needed
- Keyboard navigation support
- Focus states on interactive elements
- Color contrast compliance

## Content Strategy

- Unique content on every page
- No duplicate content
- Descriptive headings and subheadings
- Natural keyword usage
- Comprehensive product descriptions
