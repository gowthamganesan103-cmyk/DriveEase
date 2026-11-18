# DriveEase – Premium Car Rental Marketplace

> **"Find your ride. Own the journey."**

**DriveEase** is a production-quality, responsive frontend car rental web application designed and built with **HTML5, CSS3, modern Vanilla JavaScript (ES6+), Bootstrap 5, Bootstrap Icons, and browser LocalStorage**.

It offers a complete, interactive, startup-grade user experience—covering vehicle discovery, real-time multi-facet filtering, rich automotive specifications, user authentication, live checkout price calculation, and reservation management—with zero backend dependencies.

---

## 🚀 Live Demo & Getting Started

Because **DriveEase** is strictly a frontend-only platform, no Node server, Python backend, or database setup is required.

### Quick Start
You can run it in any modern browser:
1. Double-click [index.html](file:///d:/Driveease/index.html) to open directly in Chrome, Edge, Firefox, or Safari.
2. Alternatively, serve with any local HTTP server:
   ```bash
   # Using Python
   python -m http.server 8000
   # Then open: http://localhost:8000
   ```

---

## 🎨 Brand & Design System

- **Brand Name**: DriveEase
- **Tagline**: Find your ride. Own the journey.
- **Design Language**: Minimal European automotive startup aesthetic
- **Color Palette**:
  - **Primary**: Deep Charcoal Navy (`#090e17`, `#0f172a`, `#1e293b`)
  - **Accent**: Electric Lime Green (`#10e575`, `#05cd63`) for high-contrast CTA buttons and badges
  - **Backgrounds**: Clean White (`#ffffff`), Crisp Slate (`#f8fafc`), Subtle Blue-Grey (`#f1f5f9`)
  - **Borders & Shadows**: Ultra-soft elevated box shadows, 16px–22px rounded corners, smooth cubic-bezier transitions
- **Typography**: Google Fonts (*Plus Jakarta Sans* for headers & *Inter* for body readability)
- **Icons**: Bootstrap Icons v1.11.3

---

## 📁 Project Architecture

```
DriveEase/
│
├── index.html              # Homepage with cinematic hero, search widget, categories, featured cars, testimonials
├── cars.html               # Car Listing with multi-criteria filters, search, sorting, grid/list view
├── car-details.html        # Vehicle Details with gallery switcher, 8 specs, features checklist, sticky booking
├── login.html              # Authentication Sign In page with validation, demo user hints, Google Demo UI
├── register.html           # Account Registration page with field validation and password confirmation
├── booking.html            # Checkout & Booking engine with real-time price calculations and voucher receipt
├── profile.html            # User Dashboard with booking history, active vouchers, and saved wishlist
│
├── css/
│   ├── style.css           # Global design tokens, typography, navbar, footer, buttons, badges, toast system
│   ├── home.css            # Homepage hero, floating search box, category cards, why choose us, offers
│   ├── cars.css            # Filter sidebar, search bar, active chips, price range slider, grid/list styling
│   ├── details.css         # Image gallery viewport, specifications grid, features checkmarks, sticky card
│   ├── auth.css            # Split authentication layout, glassmorphic brand showcase, floating inputs
│   └── booking.css         # Checkout steps, add-on checkboxes, demo payment tabs, confirmation voucher
│
├── js/
│   ├── cars-data.js        # Central automotive database (14 vehicles with realistic INR pricing, specs, images)
│   ├── main.js             # Global state, LocalStorage bootstrap, navbar auth state, wishlist sync, toast engine
│   ├── cars.js             # Listing engine, text search, multi-facet filtering, sorting, price slider, chips
│   ├── details.js          # Dynamic details page loader, interactive gallery switcher, related cars
│   ├── auth.js             # Validation, demo Google login, login/logout state management
│   ├── booking.js          # Real-time rental calculation (rate × days, protection, GST, promo code, voucher)
│   └── profile.js          # User profile editing, booking history list, cancel booking, wishlist grid
│
└── assets/
    └── images/             # High-resolution local automotive photographs
        ├── hero-car.jpg
        ├── hyundai-creta.jpg
        ├── kia-seltos.jpg
        ├── hyundai-verna.jpg
        ├── honda-city.jpg
        ├── maruti-swift.jpg
        ├── tata-nexon.jpg
        ├── innova-crysta.jpg
        ├── mahindra-thar.jpg
        ├── bmw-3-series.jpg
        ├── mercedes-c-class.jpg
        ├── kia-carens.jpg
        ├── mg-hector.jpg
        ├── tata-nexon-ev.jpg
        ├── banner-promo.jpg
        ├── placeholder-car.jpg
        ├── categories/     # suv.jpg, sedan.jpg, hatchback.jpg, luxury.jpg, electric.jpg
        └── testimonials/   # avatar1.jpg, avatar2.jpg, avatar3.jpg
```

---

## 🚗 Fleet Inventory & Local Photography

Every car card uses a **verified automotive photograph** stored locally inside `assets/images/` with automatic fallback handling:

| # | Vehicle Model | Category | Transmission | Fuel | Price / Day | Location |
|---|---|---|---|---|---|---|
| 1 | **Hyundai Creta SX(O)** | SUV | Automatic | Diesel | ₹2,499 | Chennai |
| 2 | **Kia Seltos GT-Line** | SUV | Automatic | Petrol | ₹2,699 | Bangalore |
| 3 | **Hyundai Verna SX Turbo** | Sedan | Automatic | Petrol | ₹2,299 | Chennai |
| 4 | **Honda City 5th Gen ZX** | Sedan | Automatic | Petrol | ₹2,199 | Bangalore |
| 5 | **Maruti Swift ZXi+** | Hatchback | Manual | Petrol | ₹1,499 | Salem |
| 6 | **Tata Nexon Fearless+** | SUV | Automatic | Petrol | ₹2,399 | Coimbatore |
| 7 | **Toyota Innova Crysta ZX** | SUV (7-Seater) | Manual | Diesel | ₹3,999 | Chennai |
| 8 | **Mahindra Thar LX 4x4** | SUV (Off-road) | Automatic | Diesel | ₹3,499 | Bangalore |
| 9 | **BMW 3 Series Gran Limousine** | Luxury | Automatic | Petrol | ₹6,999 | Mumbai |
| 10 | **Mercedes-Benz C-Class C200** | Luxury | Automatic | Hybrid | ₹7,499 | Bangalore |
| 11 | **Kia Carens Luxury Plus** | SUV (7-Seater) | Automatic | Diesel | ₹2,799 | Hyderabad |
| 12 | **MG Hector Sharp Pro** | SUV | Automatic | Petrol | ₹2,899 | Mumbai |
| 13 | **Tata Nexon EV Empowered+** | Electric | Automatic | Electric | ₹2,999 | Bangalore |
| 14 | **Audi A6 Matrix 45 TFSI** | Luxury | Automatic | Petrol | ₹7,999 | Chennai |

---

## ⚡ Core Features & Interactivity

### 1. Interactive Homepage
- **Floating Search Widget**: Select Pickup Hub, Pickup Date, Return Date, and Car Type. Clicking "Search Cars" redirects to `cars.html` with query parameters applied instantly.
- **Popular Categories**: Clickable category cards that filter the fleet by SUV, Sedan, Hatchback, Luxury, or Electric.
- **Featured Fleet**: Top 6 handpicked cars with live favorite toggles, specifications, and instant booking shortcuts.
- **Promotional Offer**: Copyable coupon code `DRIVE15` with instant clipboard toast.

### 2. Vehicle Listing & Multi-Facet Filtering (`cars.html`)
- **Instant Search**: Debounced real-time search across car names, brands, and categories with clear button.
- **Active Filters**:
  - Category (SUVs, Sedans, Hatchbacks, Luxury, Electric)
  - Brand (Hyundai, Kia, Honda, Tata, Toyota, Mahindra, BMW, Mercedes-Benz, MG, Maruti)
  - Interactive Price Slider (₹1,000 to ₹12,000/day) with live indicator
  - Fuel Type (Petrol, Diesel, Electric, Hybrid)
  - Transmission (Automatic, Manual)
  - Seating (5 Seater, 7 Seater)
  - Rating (4.5+ ★, 4.8+ ★)
  - Location Hub (Chennai, Bangalore, Salem, Coimbatore, Hyderabad, Mumbai)
- **Active Filter Chips**: Visual badges for every selected filter with individual one-click removal and "Clear All".
- **Grid / List View Switcher**: Instant layout toggle between 3-column card grid and horizontal list layout.
- **Responsive Mobile Drawer**: Offcanvas filter drawer with identical capabilities on small screens.
- **Empty State**: Friendly illustration and reset button when zero cars match criteria.

### 3. Detailed Vehicle Showcase (`car-details.html`)
- **Interactive Gallery**: Clicking any angle thumbnail switches the main image viewport smoothly with active border highlighting.
- **8 Comprehensive Specs**: Capacity, Transmission, Fuel, Efficiency, Power, AC, Luggage, and Safety.
- **10 Verified Features**: Checkmarked list including Panoramic Sunroof, ADAS, 360 Camera, Ventilated Seats, etc.
- **Sticky Booking Widget**: Live date adjustment with automatic duration and estimated total preview.
- **Related Vehicles**: 3 similar vehicles matching category or brand.

### 4. Checkout & Realtime Pricing Engine (`booking.html`)
- **Realtime Price Calculation**:
  $$\text{Total Payable} = (\text{Rate} \times \text{Days}) + \text{Protection Add-ons} + \text{Service Fee (5\%)} - \text{Promo Discount}$$
- **Discount Codes**:
  - `DRIVE15`: 15% discount on base fare
  - `WELCOME`: Flat ₹500 off
- **Demo Payment Methods**: Credit/Debit Card form, UPI ID input, or Pay on Pickup.
- **Confirmation Voucher**: Generates unique Booking ID (`DE-2026-XXXXX`), records reservation in LocalStorage, and provides a printable voucher modal.

### 5. Account, Bookings & Wishlist (`profile.html`)
- **My Bookings Tab**: Lists all active and past demo bookings with status, dates, amounts, and cancellation options.
- **Saved Wishlist Tab**: Shows favorited cars with immediate booking and removal controls.
- **Profile Settings Tab**: Edit personal information (Name, Phone, Email, City) and persist to LocalStorage.
- **Navbar Integration**: Dynamic user profile menu and live heart counter badge that updates across pages.

---

## 🔒 LocalStorage Data Model

- `driveease_user`: Current logged-in user profile (`name`, `email`, `phone`, `city`, `isLoggedIn`).
- `driveease_favorites`: Array of favorited car IDs (e.g. `[1, 8, 9]`).
- `driveease_bookings`: Array of demo booking objects (`id`, `carName`, `dates`, `amount`, `status`).

---

## 🛡️ Quality & Compatibility Checklist

- [x] Zero external backend or npm build step required
- [x] All 7 HTML pages connected with functioning navigation links
- [x] Validated across mobile, tablet, and desktop breakpoints
- [x] Local, high-resolution automotive imagery with onerror fallback
- [x] Validated JavaScript syntax (`node -c` tested with 0 errors)
- [x] Working forms with real-time feedback and toast notifications
