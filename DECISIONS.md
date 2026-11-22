# Frontend decisions

Reference site: foodpanda.pk, restaurant page "Kababish Restaurant" (https://www.foodpanda.pk/restaurant/t6rw/kababish-restaurant). Observations come from my own screenshots (desktop Chrome and DevTools device mode). Consequences are possibilities, not measured results.

## 1. Empty search gives a way forward (interaction / state)
- **Problem:** Searching the restaurant menu for "zzzz" shows "Sorry, we found 0 results" and a separate "No results found" panel, then the normal menu sections (e.g. Appetizer) continue below. The only way to reset is the small X in the search box. *(Screenshot: reference-4)*
- **Task affected:** Finding a dish in the menu.
- **Possible consequence:** A customer may think the page is broken or give up instead of changing the search.
- **Decision:** When nothing matches, show only a message naming the search, with a "Clear search and filters" button. The result count is announced with `role="status"`.
- **Alternative:** Suggest the nearest matches or popular categories.
- **Reason:** One clear next action is cheap to build and works for any query.
- **Tradeoff:** No fuzzy suggestions; the customer must change the words themselves.
- **Code location:** `src/pages/Menu.jsx`, the `results.length === 0` branch.
- **Evidence:** *(my screenshot: search "xyz" on /menu, see the message, press Clear, full menu returns)*

## 2. Menu first on mobile (information hierarchy / mobile layout)
- **Problem:** In DevTools at 400 px wide, the partner-signup banner, header, address and time chips, breadcrumb, restaurant header and "Start group order" button come before any dish. No menu item is visible on the first screen, and the banner's buttons are cut off at the right edge. *(Screenshot: reference-3. Viewport was 400×545; re-check at 390×844.)*
- **Task affected:** Choosing a dish on a phone.
- **Possible consequence:** Customers must scroll past promotions to start ordering.
- **Decision:** Slim sticky header with no promotional banners, and a persistent bottom cart bar showing item count and subtotal with a "View cart" button.
- **Alternative:** Keep the full header but collapse it while scrolling.
- **Reason:** The main task is ordering, so the first screen should show food and the primary action.
- **Tradeoff:** Less space for marketing, and the fixed bar needs bottom padding so it never covers content.
- **Code location:** `src/styles.css` (`.site-header`, `.cartbar`, `main`), `src/App.jsx` (`CartBar`).
- **Evidence:** *(my screenshot of /menu at 390×844 with one item added)*

## 3. Charges explained before and at checkout (information hierarchy)
- **Problem:** "Lunch Box for One" is listed at Rs. 550 *(reference-2)*. After adding one, the View Cart button shows Rs. 566.50 *(reference-3)*. The cart total is labelled "incl. fees and tax", and the breakdown is behind a "See summary" link *(reference-4)*. *(Confirm what the Rs. 16.50 is by opening See summary and screenshotting it.)*
- **Task affected:** Judging what an order will cost.
- **Possible consequence:** The total differs from the menu price without an obvious reason, which may cause surprise or distrust.
- **Decision:** Delivery fee, free-delivery threshold and minimum order are stated on the menu, item and cart pages, and the checkout summary lists items, subtotal, delivery fee (or "free") and total as visible lines, with no extra click.
- **Alternative:** Show the fee inline on every menu card.
- **Reason:** The customer knows the rules before adding items and sees an itemised total before placing the order.
- **Tradeoff:** The bottom cart bar shows only the subtotal, so the full total appears at checkout. More text appears on each page.
- **Code location:** `src/pages/Menu.jsx` and `src/pages/ItemDetail.jsx` (delivery text), `src/pages/Cart.jsx` (info note), `src/pages/Checkout.jsx` (Summary block), `src/rules/rules.js` (`deliveryFee`, `checkFulfilment`).
- **Evidence:** *(my screenshot of /checkout with Delivery selected, showing subtotal, fee and total)*
