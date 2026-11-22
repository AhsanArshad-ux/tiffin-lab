import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

const FEATURED = ['m1', 'm4', 'b2']; // stable ids of today's picks

export default function Home() {
  const { items } = useCart();
  const picks = items.filter((i) => FEATURED.includes(i.id));
  return (
    <>
      <div className="hero-wrap">
        <section className="hero">
          <h1>Real lunches for students with a 2 PM quiz.</h1>
          <p>Tiffin Lab cooks small-batch meals and weekly bundles in Islamabad. Collect from our G-11 kitchen, or get delivery in G-10, G-11, F-10 and H-12.</p>
          <ul className="facts">
            <li>Delivery from Rs 800 orders. Fee Rs 150, free from Rs 2,000.</li>
            <li>Up to 6 of any item per order.</li>
            <li>Set your allergy once and we hide what you can’t eat.</li>
          </ul>
          <Link className="btn-primary" to="/menu">See today’s menu</Link>
          <p className="muted">Demo project: orders are simulated and no payment is taken.</p>
        </section>
        <aside className="pickbox" aria-labelledby="picks">
          <h2 id="picks">Today’s picks</h2>
          {picks.length === 0 ? <p>Picks appear once the menu loads.</p> : (
            <ul>{picks.map((p) => <li key={p.id}><Link to={`/items/${p.id}`}>{p.emoji} {p.name}</Link><span>Rs {p.price}</span></li>)}</ul>
          )}
        </aside>
      </div>
      <section aria-labelledby="how">
        <h2 id="how">How an order works</h2>
        <ol className="steps">
          <li><h3>Pick</h3><p>Search the menu, filter by category and sort by price or calories.</p></li>
          <li><h3>Check</h3><p>See stock, allergens, limits and delivery costs before you add anything.</p></li>
          <li><h3>Order</h3><p>Choose collection or delivery, a time slot, and review your total.</p></li>
        </ol>
      </section>
    </>
  );
}
