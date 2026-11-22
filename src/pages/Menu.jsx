import { useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import ItemCard from '../components/ItemCard.jsx';

const SORTS = { name: (a, b) => a.name.localeCompare(b.name), 'price-asc': (a, b) => a.price - b.price, 'price-desc': (a, b) => b.price - a.price, kcal: (a, b) => a.kcal - b.kcal };

export default function Menu() {
  const { items, allergy, setAllergy, lines } = useCart();
  const [params, setParams] = useSearchParams(); // filters live in the URL so Back/Forward keep them
  const q = params.get('q') ?? '';
  const cat = params.get('cat') ?? 'all';
  const sort = params.get('sort') ?? 'name';
  const avail = params.get('avail') === '1';
  const setParam = (key, value) => setParams((p) => {
    const n = new URLSearchParams(p);
    if (!value || value === 'all') n.delete(key); else n.set(key, value);
    return n;
  }, { replace: true });

  const categories = ['all', ...new Set(items.map((i) => i.category))];
  const needle = q.trim().toLowerCase();
  const results = items
    .filter((i) => cat === 'all' || i.category === cat)
    .filter((i) => !avail || i.stock > 0)
    .filter((i) => !needle || [i.name, i.desc, ...i.tags].some((t) => t.toLowerCase().includes(needle)))
    .sort(SORTS[sort] ?? SORTS.name);
  const hiddenInCart = lines.filter((l) => !results.some((r) => r.id === l.id));

  if (items.length === 0) return <p>No meals are listed yet. Please check back soon.</p>;
  return (
    <section>
      <h1>Today’s menu</h1>
      <p className="info">Delivery: min Rs 800, Rs 150 fee (free from Rs 2,000), G-10 / G-11 / F-10 / H-12. Max 6 per item.</p>
      <div className="filters">
        <label>Search<input type="search" value={q} onChange={(e) => setParam('q', e.target.value)} placeholder="e.g. biryani, vegan" /></label>
        <label>Category<select value={cat} onChange={(e) => setParam('cat', e.target.value)}>{categories.map((c) => <option key={c} value={c}>{c === 'all' ? 'All categories' : c}</option>)}</select></label>
        <label>Sort by<select value={sort} onChange={(e) => setParam('sort', e.target.value)}>
          <option value="name">Name</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="kcal">Calories</option></select></label>
        <label className="inline"><input type="checkbox" checked={avail} onChange={(e) => setParam('avail', e.target.checked ? '1' : '')} /> Hide sold-out items</label>
        <label>My allergy<select value={allergy} onChange={(e) => setAllergy(e.target.value)}>
          <option value="none">None</option><option value="nuts">Nuts</option><option value="dairy">Dairy</option><option value="gluten">Gluten</option></select></label>
      </div>
      {hiddenInCart.length > 0 && (
        <p className="info" role="status">Your cart still holds {hiddenInCart.length} item(s) hidden by these filters: {hiddenInCart.map((l) => l.name).join(', ')}.</p>
      )}
      <p role="status" className="muted">{results.length} of {items.length} items shown</p>
      {results.length === 0 ? (
        <div className="empty"><p>No items match “{q}”{cat !== 'all' ? ` in ${cat}` : ''}.</p>
          <button className="btn-primary" onClick={() => setParams({}, { replace: true })}>Clear search and filters</button></div>
      ) : <ul className="grid">{results.map((i) => <ItemCard key={i.id} item={i} />)}</ul>}
    </section>
  );
}
