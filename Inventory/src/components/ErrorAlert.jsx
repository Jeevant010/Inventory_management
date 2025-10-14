export default function ErrorAlert({ error }) {
  if (!error) return null;
  const msg = typeof error === 'string' ? error : (error.message || 'Error');
  return <div className="alert">{msg}</div>;
}