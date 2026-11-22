# Frontend decisions

> Fill in the Problem/Evidence fields from YOUR OWN investigation of a real reference site. Entries below describe what the code does.

## 1. Filters survive navigation (interaction/state)
- **Problem:** *(reference site URL + what resets, e.g. filters lost after opening a product and pressing Back)*
- **Decision:** Search, category and sort live in the URL query string (`useSearchParams`), so Back/Forward restores them. Cart items hidden by filters are announced above the results.
- **Alternative:** Keep filters in React state or context only.
- **Reason:** Students compare meals across categories; losing a filter costs them their place.
- **Tradeoff:** More URL churn; needs `replace: true` to avoid flooding history.
- **Code location:** `src/pages/Menu.jsx` (`setParam`, `hiddenInCart`).
- **Evidence:** *(screenshot + steps)*

## 2. Fees, limits and allergens shown before the cart (information hierarchy)
- **Problem:** *(reference site where delivery fee/minimum appears late)*
- **Decision:** Delivery fee, minimum order, quantity limit, stock and allergens appear on the menu, cards, details page and cart.
- **Alternative:** Show fees only at checkout.
- **Reason:** Removes surprises before the customer commits.
- **Tradeoff:** More text per screen on mobile.
- **Code location:** `src/pages/Menu.jsx`, `src/components/ItemCard.jsx`, `src/pages/ItemDetail.jsx`.
- **Evidence:** *(screenshot at 390 px)*

## 3. Specific, preserving form errors (mobile layout / forms)
- **Problem:** *(reference site with vague errors or cleared fields)*
- **Decision:** Each field has its own message via `aria-describedby`; state is kept per field; business-rule errors (minimum order, area) show separately.
- **Alternative:** One generic error banner at the top.
- **Reason:** Customers fix only what is wrong and finish the order.
- **Tradeoff:** More validation code and states.
- **Code location:** `src/pages/Checkout.jsx` (`validate`, `submit`, `Err`).
- **Evidence:** *(screenshot + steps)*
