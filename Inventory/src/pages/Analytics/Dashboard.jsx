import { useEffect, useState } from 'react';
import { getOverview, getCompatibilityGaps } from '../../api/analytics';
import ErrorAlert from '../../components/ErrorAlert';
import Loading from '../../components/Loading';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [gaps, setGaps] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    async function load() {
      try {
        const [ov, cg] = await Promise.all([getOverview(), getCompatibilityGaps()]);
        setData(ov);
        setGaps(cg);
      } catch (e) { setErr(e); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  if (loading) return <Loading />;
  if (err) return <ErrorAlert error={err} />;

  return (
    <div className="panel">
      <h2>Analytics Overview</h2>
      <div className="row">
        {Object.entries(data.counts).map(([k,v])=>(
          <div key={k} className="col-3">
            <div className="panel">
              <div className="label">{k}</div>
              <div style={{fontSize:'1.8rem', fontWeight:700}}>{v}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="panel" style={{marginTop:'1rem'}}>
        <div className="label">Compatibility gaps (type_codes with no mapped SKUs)</div>
        {gaps.total_uncovered === 0 ? (
          <div>No gaps detected</div>
        ) : (
          <ul>
            {gaps.uncovered_type_codes.map(c => <li key={c}>{c}</li>)}
          </ul>
        )}
      </div>
    </div>
  );
}