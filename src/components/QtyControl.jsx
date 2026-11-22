export default function QtyControl({ name, value, limit, onChange }) {
  return (
    <div className="qty" role="group" aria-label={`Quantity for ${name}`}>
      <button type="button" className="btn-ghost" aria-label={`Decrease ${name}`} onClick={() => onChange(value - 1)}>−</button>
      <output aria-live="polite">{value}</output>
      <button type="button" className="btn-ghost" aria-label={`Increase ${name}`} disabled={value >= limit} onClick={() => onChange(value + 1)}>+</button>
      <small>{value >= limit ? `Limit reached (${limit})` : `Up to ${limit}`}</small>
    </div>
  );
}
