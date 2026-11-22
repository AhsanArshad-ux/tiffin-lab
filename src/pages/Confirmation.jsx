import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

export default function Confirmation() {
  const { order, setOrder } = useCart();
  if (!order) return <div className="empty"><h1>No recent order</h1><Link className="btn-primary" to="/menu">Browse the menu</Link></div>;
  return (
    <section className="confirm">
      <h1>Order placed (simulated)</h1>
      <p className="status good">Reference {order.ref}</p>
      <p>{order.method === 'delivery' ? `Delivery to ${order.area}` : 'Collection from our G-11 kitchen'}, {order.slot}, for {order.nickname}.</p>
      <ul>{order.lines.map((l) => <li key={l.name}>{l.qty} × {l.name}: Rs {l.qty * l.price}</li>)}</ul>
      <p>Subtotal Rs {order.subtotal} · Fee Rs {order.fee}</p>
      <p className="total">Total Rs {order.total}</p>
      <Link className="btn-primary" to="/menu" onClick={() => setOrder(null)}>Start a new order</Link>
    </section>
  );
}
