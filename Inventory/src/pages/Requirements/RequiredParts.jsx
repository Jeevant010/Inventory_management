import { useState } from 'react';
import { getRequiredParts } from '../../api/analytics';
import ErrorAlert from '../../components/ErrorAlert';

export default function RequiredParts() {
  const [assetType, setAssetType] = useState('TOWER');
  const [typeCode, setTypeCode] = useState('');
  const [items, setItems] = useState([]);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hint, setHint] = useState('');

  async function onSearch(e) {
    e.preventDefault();
    setErr(null); setHint('');
    if (!typeCode.trim()) { setErr('Enter a type code to search'); return; }
    setLoading(true);
    try {
      const res = await getRequiredParts({ asset_type: assetType, type_code: typeCode.trim() });
      setItems(res.skus || []);
      if (res.hint) setHint(res.hint);
    } catch (e2) { setErr(e2.message || String(e2)); }
    finally { setLoading(false); }
  }

  return (
    <div className="panel">
      <h2>Required Parts by Type Code</h2>
      {err && <ErrorAlert error={err} />}
      <form onSubmit={onSearch} className="row">
        <div className="field col-3">
          <div className="label">Asset Type</div>
          <select className="select" value={assetType} onChange={e=>setAssetType(e.target.value)}>
            <option value="TOWER">TOWER</option>
            <option value="SUBSTATION">SUBSTATION</option>
          </select>
        </div>
        <div className="field col-6">
          <div className="label">Type Code</div>
          <input className="input" value={typeCode} onChange={e=>setTypeCode(e.target.value)} placeholder="e.g., LAT-SUSP-132" />
        </div>
        <div className="field col-3" style={{display:'flex', alignItems:'end'}}>
          <button className="btn accent" type="submit" disabled={loading}>{loading ? 'Searching...' : 'Find Parts'}</button>
        </div>
      </form>

      {hint && <div className="label" style={{marginTop:'0.5rem'}}>{hint}</div>}

      <div className="panel" style={{marginTop:'1rem'}}>
        <table className="table">
          <thead><tr><th>SKU Code</th><th>Description</th><th>Category</th><th>UOM</th></tr></thead>
          <tbody>
            {items.length === 0 ? <tr><td colSpan="4" style={{textAlign:'center'}}>No results</td></tr> :
              items.map(s => (
                <tr key={s._id}>
                  <td>{s.sku_code}</td>
                  <td>{s.description}</td>
                  <td>{s.category}</td>
                  <td>{s.uom}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}