import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ErrorAlert from '../../components/ErrorAlert.jsx';
import { createSubstationType, getSubstationType, updateSubstationType } from '../../api/substationTypes.js';
import { PURPOSES, TECHNOLOGIES, BUSBAR_SCHEMES } from '../../../constants.js';

const initial = {
  code: '',
  purpose: 'STEP_DOWN',
  technology: 'AIS',
  busbar_scheme: 'SINGLE',
  voltage_high_kv: 132,
  voltage_low_kv: 33,
  capacity_mva_min: '',
  capacity_mva_max: '',
  bays_in: 0,
  bays_out: 0,
  notes: ''
};

export default function SubstationTypeForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const [form, setForm] = useState(initial);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(!!id);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const data = await getSubstationType(id);
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

  async function onSubmit(e) {
    e.preventDefault();
    setErr(null);
    try {
      if (isEdit) await updateSubstationType(id, form);
      else await createSubstationType(form);
      navigate('/substation-types');
    } catch (e) {
      setErr(e);
    }
  }

  if (loading) return <div className="panel">Loading...</div>;

  return (
    <div className="panel">
      <h2>{isEdit ? 'Edit' : 'New'} Substation Type</h2>
      {err && <ErrorAlert error={err} />}
      <form onSubmit={onSubmit}>
        <div className="row">
          <div className="field col-4">
            <div className="label">Code</div>
            <input className="input" value={form.code} onChange={e=>updateField('code', e.target.value)} required />
          </div>
          <div className="field col-4">
            <div className="label">Purpose</div>
            <select className="select" value={form.purpose} onChange={e=>updateField('purpose', e.target.value)}>
              {PURPOSES.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div className="field col-4">
            <div className="label">Technology</div>
            <select className="select" value={form.technology} onChange={e=>updateField('technology', e.target.value)}>
              {TECHNOLOGIES.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>

          <div className="field col-4">
            <div className="label">Busbar Scheme</div>
            <select className="select" value={form.busbar_scheme} onChange={e=>updateField('busbar_scheme', e.target.value)}>
              {BUSBAR_SCHEMES.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div className="field col-4">
            <div className="label">Voltage High (kV)</div>
            <input type="number" className="input" value={form.voltage_high_kv} onChange={e=>updateField('voltage_high_kv', Number(e.target.value))} required />
          </div>
          <div className="field col-4">
            <div className="label">Voltage Low (kV)</div>
            <input type="number" className="input" value={form.voltage_low_kv} onChange={e=>updateField('voltage_low_kv', e.target.value ? Number(e.target.value) : '')} />
          </div>

          <div className="field col-4">
            <div className="label">Capacity Min (MVA)</div>
            <input type="number" className="input" value={form.capacity_mva_min} onChange={e=>updateField('capacity_mva_min', e.target.value ? Number(e.target.value) : '')} />
          </div>
          <div className="field col-4">
            <div className="label">Capacity Max (MVA)</div>
            <input type="number" className="input" value={form.capacity_mva_max} onChange={e=>updateField('capacity_mva_max', e.target.value ? Number(e.target.value) : '')} />
          </div>
          <div className="field col-2">
            <div className="label">Bays In</div>
            <input type="number" className="input" value={form.bays_in} onChange={e=>updateField('bays_in', Number(e.target.value))} />
          </div>
          <div className="field col-2">
            <div className="label">Bays Out</div>
            <input type="number" className="input" value={form.bays_out} onChange={e=>updateField('bays_out', Number(e.target.value))} />
          </div>

          <div className="field col-12">
            <div className="label">Notes</div>
            <textarea className="textarea" rows={3} value={form.notes} onChange={e=>updateField('notes', e.target.value)} />
          </div>
        </div>
        <div style={{display:'flex', gap:'0.5rem'}}>
          <button className="btn accent" type="submit">{isEdit ? 'Save' : 'Create'}</button>
          <button className="btn" type="button" onClick={() => navigate('/substation-types')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}