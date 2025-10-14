import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ErrorAlert from '../../components/ErrorAlert.jsx';
import { createAsset, getAsset, updateAsset } from '../../api/assets.js';
import { ASSET_TYPES, ASSET_STATUS } from '../../../constants.js';

const initial = {
  asset_type: 'TOWER',
  type_code: '',
  voltage_class_kv: '',
  voltage_levels_kv: [],
  location: { lat: '', lon: '', address: '' },
  line_id: '',
  site_id: '',
  manufacturer: '',
  model: '',
  year: '',
  status: 'IN_SERVICE',
  attributes: {}
};

export default function AssetForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const [form, setForm] = useState(initial);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(!!id);
  const [levelsText, setLevelsText] = useState('');
  const [attrsText, setAttrsText] = useState('{}');
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const data = await getAsset(id);
        setForm({
          ...initial,
          ...data,
          location: data.location || initial.location
        });
        setLevelsText((data.voltage_levels_kv || []).join(','));
        setAttrsText(JSON.stringify(Object.fromEntries(Object.entries(data.attributes || {})), null, 2));
      } catch (e) {
        setErr(e);
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function updateField(k, v) { setForm(prev => ({ ...prev, [k]: v })); }

  async function onSubmit(e) {
    e.preventDefault();
    setErr(null);
    try {
      const payload = {
        ...form,
        voltage_class_kv: form.voltage_class_kv === '' ? undefined : Number(form.voltage_class_kv),
        voltage_levels_kv: levelsText ? levelsText.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n)) : undefined,
        location: {
          lat: form.location.lat === '' ? undefined : Number(form.location.lat),
          lon: form.location.lon === '' ? undefined : Number(form.location.lon),
          address: form.location.address || undefined
        },
        year: form.year === '' ? undefined : Number(form.year),
        attributes: attrsText ? JSON.parse(attrsText) : {}
      };
      if (isEdit) await updateAsset(id, payload);
      else await createAsset(payload);
      navigate('/assets');
    } catch (e) {
      setErr(e);
    }
  }

  if (loading) return <div className="panel">Loading...</div>;

  return (
    <div className="panel">
      <h2>{isEdit ? 'Edit' : 'New'} Asset</h2>
      {err && <ErrorAlert error={err} />}
      <form onSubmit={onSubmit}>
        <div className="row">
          <div className="field col-3">
            <div className="label">Asset Type</div>
            <select className="select" value={form.asset_type} onChange={e=>updateField('asset_type', e.target.value)}>
              {ASSET_TYPES.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div className="field col-9">
            <div className="label">Type Code</div>
            <input className="input" value={form.type_code} onChange={e=>updateField('type_code', e.target.value)} required />
          </div>

          <div className="field col-3">
            <div className="label">Voltage Class (kV)</div>
            <input type="number" className="input" value={form.voltage_class_kv} onChange={e=>updateField('voltage_class_kv', e.target.value)} />
          </div>
          <div className="field col-9">
            <div className="label">Voltage Levels (kV, comma-separated)</div>
            <input className="input" value={levelsText} onChange={e=>setLevelsText(e.target.value)} placeholder="e.g., 132,33" />
          </div>

          <div className="field col-4">
            <div className="label">Latitude</div>
            <input type="number" className="input" value={form.location.lat} onChange={e=>updateField('location', { ...form.location, lat: e.target.value })} />
          </div>
          <div className="field col-4">
            <div className="label">Longitude</div>
            <input type="number" className="input" value={form.location.lon} onChange={e=>updateField('location', { ...form.location, lon: e.target.value })} />
          </div>
          <div className="field col-4">
            <div className="label">Address</div>
            <input className="input" value={form.location.address} onChange={e=>updateField('location', { ...form.location, address: e.target.value })} />
          </div>

          <div className="field col-3">
            <div className="label">Line ID</div>
            <input className="input" value={form.line_id} onChange={e=>updateField('line_id', e.target.value)} />
          </div>
          <div className="field col-3">
            <div className="label">Site ID</div>
            <input className="input" value={form.site_id} onChange={e=>updateField('site_id', e.target.value)} />
          </div>
          <div className="field col-2">
            <div className="label">Manufacturer</div>
            <input className="input" value={form.manufacturer} onChange={e=>updateField('manufacturer', e.target.value)} />
          </div>
          <div className="field col-2">
            <div className="label">Model</div>
            <input className="input" value={form.model} onChange={e=>updateField('model', e.target.value)} />
          </div>
          <div className="field col-2">
            <div className="label">Year</div>
            <input type="number" className="input" value={form.year} onChange={e=>updateField('year', e.target.value)} />
          </div>

          <div className="field col-3">
            <div className="label">Status</div>
            <select className="select" value={form.status} onChange={e=>updateField('status', e.target.value)}>
              {ASSET_STATUS.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>

          <div className="field col-12">
            <div className="label">Attributes (JSON)</div>
            <textarea className="textarea" rows={6} value={attrsText} onChange={e=>setAttrsText(e.target.value)} />
            <div className="label">Examples: {"{\"height_m\":\"45\",\"foundation_type\":\"RAFT\"}"} or {"{\"technology\":\"GIS\",\"busbar_scheme\":\"RING\"}"}</div>
          </div>
        </div>

        <div style={{display:'flex', gap:'0.5rem'}}>
          <button className="btn accent" type="submit">{isEdit ? 'Save' : 'Create'}</button>
          <button className="btn" type="button" onClick={() => navigate('/assets')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}