import { Link, useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import QtyControl from '../components/QtyControl.jsx';
import { stockLabel } from '../components/ItemCard.jsx';
import { checkQuantity, conflictsWithAllergy, MAX_PER_ITEM } from '../rules/rules.js';

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items, lines, setQty, allergy } = useCart();
  const item = items.find((i) => i.id === id);
  if (!item) return <div className="empty"><h1>We can’t find that item</h1><p>“{id}” isn’t on our menu. It may have been renamed.</p><Link className="btn-primary" to="/menu">Back to the menu</Link></div>;
  const qty = lines.find((l) => l.id === id)?.qty ?? 0;
  const { limit } = checkQuantity(1, item.stock);
  const conflict = conflictsWithAllergy(item, allergy);
  return (
    <article className="detail">
      <button className="btn-ghost" onClick={() => navigate(-1)}>← Back to results</button>
      <h1><span aria-hidden="true">{item.emoji}</span> {item.name}</h1>
      <p>{item.desc}</p>
      <dl>
        <dt>Price</dt><dd>Rs {item.price}</dd>
        <dt>Availability</dt><dd className={item.stock === 0 ? 'bad' : ''}>{stockLabel(item.stock)}</dd>
        <dt>Calories</dt><dd>{item.kcal} kcal</dd>
        <dt>Allergens</dt><dd>{item.allergens.length ? item.allergens.join(', ') : 'None listed'}</dd>
        <dt>Order limit</dt><dd>Up to {MAX_PER_ITEM} per order</dd>
        <dt>Delivery</dt><dd>Min Rs 800. Rs 150 fee, free from Rs 2,000.</dd>
      </dl>
      {conflict ? <p className="status bad">Contains {allergy}. Unavailable for your allergy setting.</p>
        : limit < 1 ? <p className="status bad">Sold out today.</p>
        : <QtyControl name={item.name} value={qty} limit={limit} onChange={(n) => setQty(id, n)} />}
      <p><Link className="btn-primary" to="/cart">Review cart</Link></p>
    </article>
  );
}
