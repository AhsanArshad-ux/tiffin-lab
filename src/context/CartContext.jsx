import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { MAX_PER_ITEM, conflictsWithAllergy } from '../rules/rules.js';

const Ctx = createContext(null);
export const useCart = () => useContext(Ctx);

const read = (key, fallback) => {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
};
const write = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage full or blocked */ } };

export function CartProvider({ items, children }) {
  const [cart, setCart] = useState(() => read('mm_cart', [])); // [{ id, qty }]
  const [allergy, setAllergy] = useState(() => read('mm_allergy', 'none'));
  const [order, setOrder] = useState(() => read('mm_order', null));
  const [notices, setNotices] = useState([]);

  useEffect(() => write('mm_cart', cart), [cart]);
  useEffect(() => write('mm_allergy', allergy), [allergy]);
  useEffect(() => write('mm_order', order), [order]);

  // Reconcile saved/restored selections with current data and rules, and explain every change.
  useEffect(() => {
    if (!items) return;
    const msgs = [];
    const next = [];
    for (const line of cart) {
      const item = items.find((i) => i.id === line.id);
      const limit = item ? Math.min(MAX_PER_ITEM, item.stock) : 0;
      if (!item) msgs.push('A saved item is no longer on the menu and was removed.');
      else if (conflictsWithAllergy(item, allergy)) msgs.push(`${item.name} contains ${allergy}, so it was removed.`);
      else if (limit < 1) msgs.push(`${item.name} is sold out and was removed.`);
      else if (line.qty > limit) { msgs.push(`${item.name} reduced to ${limit} because only ${limit} are available.`); next.push({ id: line.id, qty: limit }); }
      else next.push(line);
    }
    if (msgs.length) { setCart(next); setNotices(msgs); }
  }, [items, allergy, cart]);

  const limitFor = (id) => { const it = items?.find((i) => i.id === id); return it ? Math.min(MAX_PER_ITEM, it.stock) : 0; };

  const setQty = (id, qty) => setCart((prev) => {
    const q = Math.min(qty, limitFor(id));
    if (q < 1) return prev.filter((l) => l.id !== id);
    return prev.some((l) => l.id === id) ? prev.map((l) => (l.id === id ? { ...l, qty: q } : l)) : [...prev, { id, qty: q }];
  });
  const add = (id) => setCart((prev) => {
    const cur = prev.find((l) => l.id === id)?.qty ?? 0;
    const q = Math.min(cur + 1, limitFor(id));
    if (q < 1) return prev;
    return cur ? prev.map((l) => (l.id === id ? { ...l, qty: q } : l)) : [...prev, { id, qty: q }];
  });
  const remove = (id) => setCart((prev) => prev.filter((l) => l.id !== id));
  const clear = () => setCart([]);

  const lines = useMemo(
    () => cart.map((l) => ({ ...items?.find((i) => i.id === l.id), qty: l.qty })).filter((l) => l.id && l.name),
    [cart, items]
  );
  const count = lines.reduce((n, l) => n + l.qty, 0);
  const subtotal = lines.reduce((s, l) => s + l.qty * l.price, 0);

  const value = { items: items ?? [], lines, count, subtotal, allergy, setAllergy, add, setQty, remove, clear, notices, dismissNotices: () => setNotices([]), order, setOrder };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
