import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ErrorAlert from '../../components/ErrorAlert.jsx';
import { createTowerType, getTowerType, updateTowerType } from '../../api/towerTypes.js';
import { STRUCTURE_FORMS, TOWER_FUNCTIONS } from '../../constants.js';

const initial = {
  code: '',
  structure_form: 'LATTICE',
  function: 'SUSPENSION',
  circuits_supported: 1,
  voltage_min_kv: 33,
  voltage_max_kv: 132,
  height_class: '',
  material_grade: '',
  foundation_type: '',
  design_code: '',
  notes: ''
};

export default function TowerTypeForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(initial);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(!!id);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const data = await getTowerType(id);
        setForm({
          ...initial,
          ...data
        });
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
      if (isEdit) await updateTowerType(id, form);
      else await createTowerType(form);
      navigate('/tower-types');
    } catch (e) {
      setErr(e);
    }
  }

  if (loading) return <div className="panel">Loading...</div>;

  return (
    <div className="panel">
      <h2>{isEdit ? 'Edit' : 'New'} Tower Type</h2>
      {err && <ErrorAlert error={err} />}
      <form onSubmit={onSubmit}>
        <div className="row">
          <div className="field col-4">
            <div className="label">Code</div>
            <input className="input" value={form.code} onChange={e=>updateField('code', e.target.value)} required />
          </div>
          <div className="field col-4">
            <div className="label">Structure Form</div>
            <select className="select" value={form.structure_form} onChange={e=>updateField('structure_form', e.target.value)}>
              {STRUCTURE_FORMS.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div className="field col-4">
            <div className="label">Function</div>
            <select className="select" value={form.function} onChange={e=>updateField('function', e.target.value)}>
              {TOWER_FUNCTIONS.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>

          <div className="field col-3">
            <div className="label">Circuits Supported</div>
            <select className="select" value={form.circuits_supported} onChange={e=>updateField('circuits_supported', Number(e.target.value))}>
              <option value={1}>1</option>
              <option value={2}>2</option>
            </select>
          </div>
          <div className="field col-3">
            <div className="label">Voltage Min (kV)</div>
            <input type="number" className="input" value={form.voltage_min_kv} onChange={e=>updateField('voltage_min_kv', Number(e.target.value))} required />
          </div>
          <div className="field col-3">
            <div className="label">Voltage Max (kV)</div>
            <input type="number" className="input" value={form.voltage_max_kv} onChange={e=>updateField('voltage_max_kv', Number(e.target.value))} required />
          </div>
          <div className="field col-3">
            <div className="label">Height Class</div>
            <input className="input" value={form.height_class} onChange={e=>updateField('height_class', e.target.value)} />
          </div>

          <div className="field col-4">
            <div className="label">Material Grade</div>
            <input className="input" value={form.material_grade} onChange={e=>updateField('material_grade', e.target.value)} />
          </div>
          <div className="field col-4">
            <div className="label">Foundation Type</div>
            <input className="input" value={form.foundation_type} onChange={e=>updateField('foundation_type', e.target.value)} />
          </div>
          <div className="field col-4">
            <div className="label">Design Code</div>
            <input className="input" value={form.design_code} onChange={e=>updateField('design_code', e.target.value)} />
          </div>

          <div className="field col-12">
            <div className="label">Notes</div>
            <textarea className="textarea" rows={3} value={form.notes} onChange={e=>updateField('notes', e.target.value)} />
          </div>
        </div>
        <div style={{display:'flex', gap:'0.5rem'}}>
          <button className="btn accent" type="submit">{isEdit ? 'Save' : 'Create'}</button>
          <button className="btn" type="button" onClick={() => navigate('/tower-types')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}