// Operating rules. Pure functions so they can be tested without the UI.
export const MAX_PER_ITEM = 6;          // Rule 1 (availability): 1..6 per item, never above today's stock
export const MIN_DELIVERY_ORDER = 800;  // Rule 3 (fulfilment): minimum subtotal for delivery
export const FREE_DELIVERY_AT = 2000;   // delivery is free from this subtotal
export const DELIVERY_FEE = 150;
export const AREAS = ['G-10', 'G-11', 'F-10', 'H-12']; // delivery service areas

export function checkQuantity(qty, stock) {
  const limit = Math.min(MAX_PER_ITEM, Math.max(0, stock));
  if (!Number.isInteger(qty) || qty < 1) return { ok: false, limit, message: 'Choose at least 1.' };
  if (qty > limit) {
    return { ok: false, limit, message: stock < MAX_PER_ITEM ? `Only ${stock} left today.` : `Maximum ${MAX_PER_ITEM} per item.` };
  }
  return { ok: true, limit, message: '' };
}

// Rule 2 (eligibility): items containing the customer's declared allergen cannot be ordered.
export const conflictsWithAllergy = (item, allergy) => allergy !== 'none' && item.allergens.includes(allergy);

export const deliveryFee = (subtotal, method) =>
  method !== 'delivery' || subtotal >= FREE_DELIVERY_AT ? 0 : DELIVERY_FEE;

export function checkFulfilment({ subtotal, method, area }) {
  const errors = [];
  if (method === 'delivery') {
    if (subtotal < MIN_DELIVERY_ORDER) errors.push(`Delivery needs a minimum order of Rs ${MIN_DELIVERY_ORDER}. Add Rs ${MIN_DELIVERY_ORDER - subtotal} more or choose collection.`);
    if (!AREAS.includes(area)) errors.push(`We deliver to ${AREAS.join(', ')} only.`);
  }
  return errors;
}
