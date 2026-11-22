import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import QtyControl from '../components/QtyControl.jsx';
import { MAX_PER_ITEM, MIN_DELIVERY_ORDER, DELIVERY_FEE, FREE_DELIVERY_AT } from '../rules/rules.js';

export default function Cart() {
  const { lines, subtotal, count, setQty, remove, clear } = useCart();
  if (lines.length === 0) return <div className="empty"><h1>Your cart is empty</h1><p>Pick a meal or a weekly bundle to get started.</p><Link className="btn-primary" to="/menu">Browse the menu</Link></div>;
  return (
    <section>
      <h1>Your cart ({count})</h1>
      <ul className="lines">
        {lines.map((l) => (
          <li key={l.id}>
            <div><Link to={`/items/${l.id}`}>{l.name}</Link><p className="muted">Rs {l.price} each</p></div>
            <QtyControl name={l.name} value={l.qty} limit={Math.min(MAX_PER_ITEM, l.stock)} onChange={(n) => setQty(l.id, n)} />
            <strong>Rs {l.price * l.qty}</strong>
            <button className="btn-ghost" onClick={() => remove(l.id)} aria-label={`Remove ${l.name}`}>Remove</button>
          </li>
        ))}
      </ul>
      <p className="total">Subtotal: Rs {subtotal}</p>
      <p className="info">Delivery is Rs {DELIVERY_FEE} (free from Rs {FREE_DELIVERY_AT}) and needs a Rs {MIN_DELIVERY_ORDER} minimum. Collection has no fee.</p>
      <div className="actions"><Link className="btn-primary" to="/checkout">Continue to details</Link><button className="btn-ghost" onClick={clear}>Empty cart</button></div>
    </section>
  );
}
