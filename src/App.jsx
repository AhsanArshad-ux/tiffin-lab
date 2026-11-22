import { useEffect, useState } from 'react';
import { BrowserRouter, Link, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { loadItems } from './api/loadItems.js';
import { CartProvider, useCart } from './context/CartContext.jsx';
import Home from './pages/Home.jsx';
import Menu from './pages/Menu.jsx';
import ItemDetail from './pages/ItemDetail.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import Confirmation from './pages/Confirmation.jsx';

function Header() {
  const { count } = useCart();
  return (
    <header className="site-header">
      <Link to="/" className="brand">Tiffin Lab</Link>
      <nav aria-label="Main"><NavLink to="/menu">Menu</NavLink><NavLink to="/cart">Cart ({count})</NavLink></nav>
    </header>
  );
}

// On each route change: set the page title, move focus to main content and scroll to top.
function RouteEffects() {
  const { pathname } = useLocation();
  useEffect(() => {
    document.title = `${document.querySelector('main h1')?.textContent ?? 'Tiffin Lab'} | Tiffin Lab`;
    document.getElementById('main')?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function CartBar() {
  const { count, subtotal } = useCart();
  const { pathname } = useLocation();
  if (!count || ['/cart', '/checkout', '/confirmation'].includes(pathname)) return null;
  return <div className="cartbar"><span>{count} item(s) · Rs {subtotal}</span><Link className="btn-primary" to="/cart">View cart</Link></div>;
}

function Notices() {
  const { notices, dismissNotices } = useCart();
  if (!notices.length) return null;
  return (
    <div className="info warn-box" role="alert">
      <strong>We updated your cart:</strong>
      <ul>{notices.map((n) => <li key={n}>{n}</li>)}</ul>
      <button className="btn-ghost" onClick={dismissNotices}>Dismiss</button>
    </div>
  );
}

function DemoControls({ reload }) {
  const [fail, setFail] = useState(localStorage.getItem('mm_fail') === '1');
  const [low, setLow] = useState(!!localStorage.getItem('mm_stock'));
  return (
    <footer className="demo">
      <p>Demo controls (for testing edge cases)</p>
      <label className="inline"><input type="checkbox" checked={fail} onChange={(e) => { setFail(e.target.checked); localStorage.setItem('mm_fail', e.target.checked ? '1' : '0'); }} /> Simulate loading failure (applies on next load or retry)</label>
      <label className="inline"><input type="checkbox" checked={low} onChange={(e) => {
        setLow(e.target.checked);
        if (e.target.checked) localStorage.setItem('mm_stock', JSON.stringify({ m1: 2, m2: 0 })); else localStorage.removeItem('mm_stock');
      }} /> Reduce availability (Biryani: 2 left, Daal: sold out)</label>
      <button className="btn-ghost" onClick={reload}>Reload data</button>
    </footer>
  );
}

export default function App() {
  const [items, setItems] = useState(null);
  const [status, setStatus] = useState('loading');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false; // cleanup prevents state updates after unmount or a newer request
    setStatus('loading');
    loadItems()
      .then((data) => { if (!cancelled) { setItems(data); setStatus('ready'); } })
      .catch(() => { if (!cancelled) setStatus('error'); });
    return () => { cancelled = true; };
  }, [attempt]);

  return (
    <BrowserRouter>
      <CartProvider items={status === 'ready' ? items : null}>
        <a className="skip" href="#main">Skip to content</a>
        <Header />
        <main id="main" tabIndex={-1}>
          {status === 'loading' && <p role="status">Loading today’s menu…</p>}
          {status === 'error' && (
            <div className="empty" role="alert"><h1>We couldn’t load the menu</h1><p>Check your connection and try again.</p>
              <button className="btn-primary" onClick={() => setAttempt((a) => a + 1)}>Retry</button></div>
          )}
          {status === 'ready' && (<><Notices />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/items/:id" element={<ItemDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/confirmation" element={<Confirmation />} />
              <Route path="*" element={<div className="empty"><h1>Page not found</h1><Link className="btn-primary" to="/menu">Go to the menu</Link></div>} />
            </Routes></>)}
        </main>
        <RouteEffects /><CartBar />
        <DemoControls reload={() => setAttempt((a) => a + 1)} />
      </CartProvider>
    </BrowserRouter>
  );
}
