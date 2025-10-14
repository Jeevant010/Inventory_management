export default function Pagination({ page, totalPages, onPageChange }) {
  const p = Number(page) || 1;
  const t = Number(totalPages) || 1;
  return (
    <div style={{display:'flex', gap:'0.5rem', alignItems:'center', marginTop:'0.8rem'}}>
      <button className="btn" disabled={p<=1} onClick={() => onPageChange(p-1)}>Prev</button>
      <span className="badge">Page {p} / {t}</span>
      <button className="btn" disabled={p>=t} onClick={() => onPageChange(p+1)}>Next</button>
    </div>
  );
}