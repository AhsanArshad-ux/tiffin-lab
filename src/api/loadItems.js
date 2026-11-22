import { ITEMS } from '../data/items.js';
// Mock async loader. Demo controls in the footer write 'mm_fail' and 'mm_stock' to localStorage.
export function loadItems() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        if (localStorage.getItem('mm_fail') === '1') return reject(new Error('Simulated network failure'));
        const overrides = JSON.parse(localStorage.getItem('mm_stock') || '{}');
        resolve(ITEMS.map((i) => ({ ...i, stock: overrides[i.id] ?? i.stock })));
      } catch (e) { reject(e); }
    }, 700);
  });
}
