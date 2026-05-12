# Sport Store

Premium static ecommerce frontend for a modern sports store. The project uses HTML5, CSS3, Vanilla JavaScript, Bootstrap 5.3, Bootstrap Icons, SwiperJS, and AOS.

## Open

Open [pages/index.html](pages/index.html) in a browser. No build step is required.

## CDN

- Bootstrap CSS/JS: `https://cdn.jsdelivr.net/npm/bootstrap@5.3.3`
- Bootstrap Icons: `https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3`
- SwiperJS: `https://cdn.jsdelivr.net/npm/swiper@11`
- AOS: `https://cdn.jsdelivr.net/npm/aos@2.3.4`

## Structure

- `pages/`: storefront pages including home, shop, detail, cart, checkout, auth, profile, contact, about, FAQ, and 404.
- `admin/`: admin dashboard, products, orders, users, and login pages.
- `components/`: reusable HTML snippets for navbar, footer, product card, modal, loader, sidebar, and newsletter.
- `assets/css/custom/style.css`: design tokens, responsive layout, glass cards, cards, gallery, buttons, loader, skeleton, admin UI, and animations.
- `assets/js/main.js`: shared behavior for loader, AOS, navbar scroll, dark mode, ripple buttons, product cards, cart, wishlist, counters, toast, Swiper, and image loading.
- `assets/js/pages/`: page-specific scripts for shop filtering, product gallery, cart quantity updates, and admin product table.
- `data/`: sample JSON data for products, categories, banners, reviews, and users.

## Features

- Responsive layout from 320px mobile to full HD desktop.
- Sticky navbar with scroll effect.
- Smooth scrolling, AOS reveal animation, image hover zoom, blur-to-sharp image loading, and card hover shadows.
- Gradient bubble buttons with ripple click effect.
- Floating back-to-top/contact buttons.
- Product cards with quick view, wishlist, rating, sale badge, and add-to-cart.
- LocalStorage cart and wishlist.
- Product detail image gallery.
- Search, category filter, and sorting on shop page.
- Toast notifications, loading screen, skeleton utility, animated counters, and dark mode.
