import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { conflictsWithAllergy } from '../rules/rules.js';

export const stockLabel = (s) => (s === 0 ? 'Sold out today' : s <= 5 ? `Only ${s} left` : 'Available today');

export default function ItemCard({ item }) {
  const { add, allergy, lines } = useCart();
  const conflict = conflictsWithAllergy(item, allergy);
  const soldOut = item.stock === 0;
  const inCart = lines.find((l) => l.id === item.id)?.qty ?? 0;
  const limitReached = inCart >= Math.min(6, item.stock) && inCart > 0;
  return (
    <li className={`card ${soldOut || conflict ? 'is-unavailable' : ''} ${inCart ? 'is-selected' : ''}`}>
      <div className="card-top" role="img" aria-label={`${item.name} illustration`}>{item.emoji}</div>
      <div className="card-body">
        {inCart > 0 && <span className="tag">In cart: {inCart}</span>}
        <h3><Link to={`/items/${item.id}`}>{item.name}</Link></h3>
        <p className="price">Rs {item.price}</p>
        <p className={`status ${soldOut ? 'bad' : item.stock <= 5 ? 'warn' : 'good'}`}>{stockLabel(item.stock)}</p>
        <p className="muted">{item.allergens.length ? `Contains: ${item.allergens.join(', ')}` : 'No listed allergens'}</p>
        {conflict && <p className="status bad">Contains {allergy} (your allergy)</p>}
        <button className="btn-primary" disabled={soldOut || conflict || limitReached} onClick={() => add(item.id)}>
          {soldOut ? 'Sold out' : conflict ? 'Not suitable for you' : limitReached ? 'Limit reached' : inCart ? 'Add another' : 'Add to cart'}
        </button>
      </div>
    </li>
  );
}
