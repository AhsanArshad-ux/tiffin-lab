# Tiffin Lab (CS4032 Assignment 02)
Student: *(name, roll no, section)* · GitHub: *(link)* · Deployment: *(link)* · Final commit: *(hash)*

Fictional meal-prep business for university students in Islamabad: individual meals, weekly bundles, collection (G-11) or delivery (G-10, G-11, F-10, H-12). Orders are **simulated**; no payment or personal data.

## Commands
`npm install` · `npm run dev` · `npm run build` · `npm test` (node --test)

## Routes
`/` home · `/menu` (search/filter/sort) · `/items/:id` · `/cart` · `/checkout` · `/confirmation`. Deploy with SPA rewrites (`public/_redirects` for Netlify, `vercel.json` for Vercel).

## Operating rules (`src/rules/rules.js`)
1. Availability: 1–6 per item, capped by today's stock. Boundary: 6 ok, 7 rejected.
2. Eligibility: items containing the customer's declared allergen are blocked/removed.
3. Fulfilment: delivery needs subtotal ≥ Rs 800 and an area in G-10/G-11/F-10/H-12; fee Rs 150, free from Rs 2,000. Boundary: Rs 799 rejected, Rs 800 ok.

## Reproducing edge cases
Footer demo controls: "Simulate loading failure" then Reload → error and Retry. "Reduce availability" then Reload → saved cart is reconciled with a notice. Invalid ID: `/items/zzz`. No matches: search "xyz".

## Concept map
| Concept | File | Function/Component |
|---|---|---|
| Shared state, localStorage, reconcile | context/CartContext.jsx | CartProvider |
| Async loader + cleanup | api/loadItems.js, App.jsx | loadItems, useEffect |
| Search/filter/sort | pages/Menu.jsx | Menu |
| Controlled form + validation | pages/Checkout.jsx | validate, submit |
| Business rule + test | rules/rules.js, tests/rules.test.js | checkQuantity |

## Limitations
*(list yours honestly)*
