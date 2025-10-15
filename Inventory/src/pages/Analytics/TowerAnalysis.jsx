import { useEffect, useState } from 'react';
import { getTowerBreakdown } from '../../api/analytics';
import ErrorAlert from '../../components/ErrorAlert';
import Loading from '../../components/Loading';
import SimpleBarChart from '../../components/SimpleBarChart';

export default function TowerAnalysis() {
  const [dist, setDist] = useState([]);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    getTowerBreakdown().then(d => {
      setDist(d.distribution.map(x => ({
        key: `${x.structure_form}-${x.function}`,
        count: x.count
      })));
    }).catch(setErr).finally(()=>setLoading(false));
  }, []);

  if (loading) return <Loading />;
  if (err) return <ErrorAlert error={err} />;

  return (
    <>
      <h2>Tower Analysis</h2>
      <SimpleBarChart data={dist} xKey="key" yKey="count" />
    </>
  );
}