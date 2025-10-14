export function toQuery(params = {}) {
  const esc = encodeURIComponent;
  const entries = Object.entries(params).filter(([_, v]) => v !== undefined && v !== null && v !== '');
  if (entries.length === 0) return '';
  return '?' + entries.map(([k, v]) => `${esc(k)}=${esc(v)}`).join('&');
}