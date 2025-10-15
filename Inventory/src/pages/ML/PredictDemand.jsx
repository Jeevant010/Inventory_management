import { useEffect, useState } from 'react';
import { predictDemand } from '../../api/ml';
import { listSKUs } from '../../api/skus';
import ErrorAlert from '../../components/ErrorAlert';

export default function PredictDemand() {
  const [skuId, setSkuId] = useState('');
  const [skuOptions, setSkuOptions] = useState([]);
  const [points, setPoints] = useState([{ y: 10 }, { y: 12 }, { y: 14 }]);
  const [horizon, setHorizon] = useState(1);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    listSKUs({ page:1, limit:1000 }).then(res => setSkuOptions(res.data || []));
  }, []);

  function updatePoint(i, val) {
    const copy = [...points];
    copy[i] = { y: val === '' ? '' : Number(val) };
    setPoints(copy);
  }
  function addPoint() { setPoints(p => [...p, { y: 0 }]); }
  function removePoint(i) { setPoints(p => p.filter((_,idx)=>idx!==i)); }

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true); setErr(null); setResult(null);
    try {
      const history = points.filter(p => p.y !== '' && !isNaN(p.y));
      const res = await predictDemand({ sku_id: skuId || undefined, history, horizon: Number(horizon) || 1 });
      setResult(res);
    } catch (e2) { setErr(e2); }
    finally { setLoading(false); }
  }

  return (
    <div className="panel">
      <h2>Predict SKU Demand</h2>
      {err && <ErrorAlert error={err} />}
      <form onSubmit={onSubmit} className="row">
        <div className="field col-6">
          <div className="label">SKU</div>
          <select className="select" value={skuId} onChange={e=>setSkuId(e.target.value)}>
            <option value="">(Optional) Select SKU</option>
            {skuOptions.map(s => <option key={s._id} value={s._id}>{s.sku_code} — {s.description}</option>)}
          </select>
        </div>
        <div className="field col-3">
          <div className="label">Horizon (months)</div>
          <input className="input" type="number" min="1" value={horizon} onChange={e=>setHorizon(e.target.value)} />
        </div>
        <div className="field col-3" style={{display:'flex', alignItems:'end'}}>
          <button className="btn accent" type="submit" disabled={loading}>{loading ? 'Predicting...' : 'Predict'}</button>
        </div>
      </form>

      <div className="panel" style={{marginTop:'1rem'}}>
        <div className="label">History (most recent last)</div>
        {points.map((p,i)=>(
          <div key={i} style={{display:'flex', gap:'0.5rem', marginBottom:'0.4rem'}}>
            <input className="input" type="number" value={p.y} onChange={e=>updatePoint(i, e.target.value)} placeholder="units" />
            <button className="btn danger" type="button" onClick={()=>removePoint(i)}>Remove</button>
          </div>
        ))}
        <button className="btn" onClick={addPoint} type="button">+ Add Point</button>
      </div>

      {result && (
        <div className="panel" style={{marginTop:'1rem'}}>
          <div className="label">Forecast</div>
          <pre style={{whiteSpace:'pre-wrap'}}>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}