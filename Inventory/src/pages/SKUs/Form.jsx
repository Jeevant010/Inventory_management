import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ErrorAlert from '../../components/ErrorAlert.jsx';
import { createSKU, getSKU, updateSKU } from '../../api/skus.js';
import { SKU_CATEGORIES, COMPAT_ASSET_TYPES } from '../../../constants.js';

const initial = {
  sku_code: '',
  description: '',
  category: 'HARDWARE',
  compatible_asset_type: 'TOWER',
  compatible_type_codes: [],
  voltage_min_kv: '',
  voltage_max_kv: '',
  specs: {},
  uom: 'EA',
  serialization_required: false,
  lot_controlled: false,
  reorder_point: 0,
  min_level: 0,
  max_level: 0,
  preferred_vendor_id: ''
};

export default function SKUForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const [form, setForm] = useState(initial);
  const [typeCodeInput, setTypeCodeInput] = useState('');
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(!!id);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const data = await getSKU(id);
        setForm({ ...initial, ...data });
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
  function addTypeCode() {
    if (!typeCodeInput) return;
    if (form.compatible_type_codes.includes(typeCodeInput)) return;
    updateField('compatible_type_codes', [...form.compatible_type_codes, typeCodeInput]);
    setTypeCodeInput('');
  }
  function removeTypeCode(code) {
    updateField('compatible_type_codes', form.compatible_type_codes.filter(c => c !== code));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr(null);
    try {
      const payload = {
        ...form,
        voltage_min_kv: form.voltage_min_kv === '' ? undefined : Number(form.voltage_min_kv),
        voltage_max_kv: form.voltage_max_kv === '' ? undefined : Number(form.voltage_max_kv)
      };
      if (isEdit) await updateSKU(id, payload);
      else await createSKU(payload);
      navigate('/skus');
    } catch (e) {
      setErr(e);
    }
  }

  if (loading) return <div className="panel">Loading...</div>;

  return (
    <div className="panel">
      <h2>{isEdit ? 'Edit' : 'New'} SKU</h2>
      {err && <ErrorAlert error={err} />}
      <form onSubmit={onSubmit}>
        <div className="row">
          <div className="field col-4">
            <div className="label">SKU Code</div>
            <input className="input" value={form.sku_code} onChange={e=>updateField('sku_code', e.target.value)} required />
          </div>
          <div className="field col-8">
            <div className="label">Description</div>
            <input className="input" value={form.description} onChange={e=>updateField('description', e.target.value)} required />
          </div>

          <div className="field col-4">
            <div className="label">Category</div>
            <select className="select" value={form.category} onChange={e=>updateField('category', e.target.value)}>
              {SKU_CATEGORIES.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div className="field col-4">
            <div className="label">Compatible Asset Type</div>
            <select className="select" value={form.compatible_asset_type} onChange={e=>updateField('compatible_asset_type', e.target.value)}>
              {COMPAT_ASSET_TYPES.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div className="field col-4">
            <div className="label">UOM</div>
            <input className="input" value={form.uom} onChange={e=>updateField('uom', e.target.value)} />
          </div>

          <div className="field col-3">
            <div className="label">Voltage Min (kV)</div>
            <input type="number" className="input" value={form.voltage_min_kv} onChange={e=>updateField('voltage_min_kv', e.target.value)} />
          </div>
          <div className="field col-3">
            <div className="label">Voltage Max (kV)</div>
            <input type="number" className="input" value={form.voltage_max_kv} onChange={e=>updateField('voltage_max_kv', e.target.value)} />
          </div>
          <div className="field col-3">
            <div className="label">Reorder Point</div>
            <input type="number" className="input" value={form.reorder_point} onChange={e=>updateField('reorder_point', Number(e.target.value))} />
          </div>
          <div className="field col-3">
            <div className="label">Min Level</div>
            <input type="number" className="input" value={form.min_level} onChange={e=>updateField('min_level', Number(e.target.value))} />
          </div>

          <div className="field col-3">
            <div className="label">Max Level</div>
            <input type="number" className="input" value={form.max_level} onChange={e=>updateField('max_level', Number(e.target.value))} />
          </div>
          <div className="field col-3">
            <div className="label">Serialized?</div>
            <select className="select" value={form.serialization_required ? 'yes' : 'no'} onChange={e=>updateField('serialization_required', e.target.value === 'yes')}>
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
          <div className="field col-3">
            <div className="label">Lot Controlled?</div>
            <select className="select" value={form.lot_controlled ? 'yes' : 'no'} onChange={e=>updateField('lot_controlled', e.target.value === 'yes')}>
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
          <div className="field col-3">
            <div className="label">Preferred Vendor Id</div>
            <input className="input" value={form.preferred_vendor_id} onChange={e=>updateField('preferred_vendor_id', e.target.value)} />
          </div>

          <div className="field col-12">
            <div className="label">Compatible Type Codes</div>
            <div style={{display:'flex', gap:'0.5rem', marginBottom: '0.5rem'}}>
              <input className="input" value={typeCodeInput} onChange={e=>setTypeCodeInput(e.target.value)} placeholder="e.g., LAT-SUSP-132 or AIS-STEPDOWN-132/33" />
              <button className="btn" type="button" onClick={addTypeCode}>Add</button>
            </div>
            <div style={{display:'flex', gap:'0.5rem', flexWrap:'wrap'}}>
              {form.compatible_type_codes.map(code => (
                <span key={code} className="badge" style={{display:'inline-flex', alignItems:'center', gap:'0.4rem'}}>
                  {code}
                  <button className="btn danger" type="button" onClick={()=>removeTypeCode(code)} style={{padding:'0.1rem 0.4rem'}}>x</button>
                </span>
              ))}
            </div>
          </div>

          <div className="field col-12">
            <div className="label">Specs (JSON key/value)</div>
            <textarea className="textarea" rows={3} placeholder='{"material":"SS304","length_mm":"120"}'
              value={JSON.stringify(form.specs || {}, null, 2)}
              onChange={e=>{
                try { updateField('specs', JSON.parse(e.target.value || '{}')); }
                catch { /* ignore parse errors until submit */ }
              }}
            />
          </div>
        </div>

        <div style={{display:'flex', gap:'0.5rem'}}>
          <button className="btn accent" type="submit">{isEdit ? 'Save' : 'Create'}</button>
          <button className="btn" type="button" onClick={() => navigate('/skus')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}