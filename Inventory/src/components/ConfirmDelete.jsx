export default function ConfirmDelete({ onConfirm, onCancel, message = 'Delete this item?' }) {
  return (
    <div className="panel" style={{borderColor:'#5b0d0d', background:'#1b0b0b'}}>
      <div style={{marginBottom: '0.6rem'}}>{message}</div>
      <div style={{display:'flex', gap:'0.5rem'}}>
        <button className="btn danger" onClick={onConfirm}>Confirm Delete</button>
        <button className="btn" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}