# NOVA MARKET — Corrected Dual-Engine E-Commerce Store

## Canonical files
- `index.html` + `css/style.css` + `js/app.js` — customer storefront
- `admin-login.html` + `admin-login.css` + `admin-login.js` — admin login
- `admin-dashboard.html` + `css/admin-dashboard.css` + `admin-dashboard.js` — admin dashboard
- `backend/` — Express + MongoDB API

## Important fixes
- Removed duplicate legacy admin dashboard files.
- Added `store` and `brand` fields to the Product model.
- Fixed admin dashboard file paths.
- Added admin JWT protection to product create/update/delete.
- Added admin JWT protection to order list/details/status/delete.
- Fixed backend middleware location.
- Added proper product update and delete API routes.
- Added setup-key protection for the one-time admin creation endpoint.
- Fixed backend startup so database connection errors are reported clearly.
- The cart and checkout code uses numeric-safe price/quantity calculations to prevent NaN totals.

## Before running
1. Open `backend/.env`.
2. Verify your MongoDB connection string.
3. Change `JWT_SECRET` to a long random secret.
4. Change `ADMIN_SETUP_KEY` to a private one-time setup key.
5. Inside `backend`, run:
   `npm install`
6. Start the backend:
   `npm run dev`
7. Open `admin-login.html` through a local frontend server.
