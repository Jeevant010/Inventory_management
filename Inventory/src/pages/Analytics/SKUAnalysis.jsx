import { useEffect, useState } from 'react';
import { getSkuBreakdown } from '../../api/analytics';
import ErrorAlert from '../../components/ErrorAlert';
import Loading from '../../components/Loading';
import SimpleBarChart from '../../components/SimpleBarChart';

export default function SKUAnalysis() {
  const [dist, setDist] = useState([]);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    getSkuBreakdown().then(d => {
      setDist(d.distribution.map(x => ({
        key: `${x.category}-${x.compatible_asset_type}`,
        count: x.count
      })));
    }).catch(setErr).finally(()=>setLoading(false));
  }, []);

  if (loading) return <Loading />;
  if (err) return <ErrorAlert error={err} />;

  return (
    <>
      <h2>SKU Analysis</h2>
      <SimpleBarChart data={dist} xKey="key" yKey="count" />
    </>
  );
}