import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ErrorAlert from '../../components/ErrorAlert.jsx';
import { createSKUComp, getSKUComp, updateSKUComp } from '../..//api/skuCompatibility.js';
import { listSKUs } from '../../api/skus.js';

const initial = {
  sku: '',
  type_code: '',
  constraints: {}
};

export default function SKUCompForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const [form, setForm] = useState(initial);
  const [skuOptions, setSkuOptions] = useState([]);
  const [constraintsText, setConstraintsText] = useState('{}');
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(!!id);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        // Load SKUs for dropdown (first page, large limit for convenience)
        const skuRes = await listSKUs({ page: 1, limit: 1000 });
        setSkuOptions(skuRes.data || []);
        if (isEdit) {
          const data = await getSKUComp(id);
          setForm({
            sku: data.sku?._id || data.sku, // in case populated or id
            type_code: data.type_code,
            constraints: data.constraints || {}
          });
          setConstraintsText(JSON.stringify(Object.fromEntries(Object.entries(data.constraints || {})), null, 2));
        }
      } catch (e) {
        setErr(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function updateField(k, v) { setForm(prev => ({ ...prev, [k]: v })); }

  async function onSubmit(e) {
    e.preventDefault();
    setErr(null);
    try {
      let constraints = {};
      if (constraintsText && constraintsText.trim()) {
        constraints = JSON.parse(constraintsText);
      }
      const payload = { ...form, constraints };
      if (isEdit) await updateSKUComp(id, payload);
      else await createSKUComp(payload);
      navigate('/sku-compatibilities');
    } catch (e) {
      setErr(e);
    }
  }

  if (loading) return <div className="panel">Loading...</div>;

  return (
    <div className="panel">
      <h2>{isEdit ? 'Edit' : 'New'} SKU Compatibility</h2>
      {err && <ErrorAlert error={err} />}
      <form onSubmit={onSubmit}>
        <div className="row">
          <div className="field col-6">
            <div className="label">SKU</div>
            <select className="select" value={form.sku} onChange={e=>updateField('sku', e.target.value)} required>
              <option value="">Select SKU</option>
              {skuOptions.map(s => <option key={s._id} value={s._id}>{s.sku_code} — {s.description}</option>)}
            </select>
          </div>
          <div className="field col-6">
            <div className="label">Type Code</div>
            <input className="input" value={form.type_code} onChange={e=>updateField('type_code', e.target.value)} placeholder="e.g., LAT-SUSP-132" required />
          </div>
          <div className="field col-12">
            <div className="label">Constraints (JSON key/value)</div>
            <textarea className="textarea" rows={6} value={constraintsText} onChange={e=>setConstraintsText(e.target.value)} />
            <div className="label">Examples: {"{\"min_kv\":\"220\"}"} or {"{\"technology\":\"GIS\"}"} or {"{\"circuit_requirement\":\"DOUBLE\"}"}</div>
          </div>
        </div>

        <div style={{display:'flex', gap:'0.5rem'}}>
          <button className="btn accent" type="submit">{isEdit ? 'Save' : 'Create'}</button>
          <button className="btn" type="button" onClick={() => navigate('/sku-compatibilities')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}