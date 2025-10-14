import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../components/DataTable.jsx';
import Pagination from '../../components/Pagination.jsx';
import ConfirmDelete from '../../components/ConfirmDelete.jsx';
import ErrorAlert from '../../components/ErrorAlert.jsx';
import Loading from '../../components/Loading.jsx';
import { listTowerTypes, deleteTowerType } from '../../api/towerTypes.js';

export default function TowerTypeList() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [search, setSearch] = useState('');
  const [toDelete, setToDelete] = useState(null);

  const navigate = useNavigate();

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const res = await listTowerTypes({ page, limit, search });
      setItems(res.data);
      setTotalPages(res.totalPages);
    } catch (e) {
      setErr(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [page, limit, search]);

  const columns = [
    { header: 'Code', accessor: 'code' },
    { header: 'Structure', accessor: 'structure_form' },
    { header: 'Function', accessor: 'function' },
    { header: 'Circuits', accessor: 'circuits_supported' },
    { header: 'Voltage (kV)', render: (r) => `${r.voltage_min_kv} - ${r.voltage_max_kv}` },
  ];

  async function confirmDelete() {
    if (!toDelete) return;
    try {
      await deleteTowerType(toDelete._id);
      setToDelete(null);
      load();
    } catch (e) {
      setErr(e);
    }
  }

  return (
    <>
      <div className="toolbar">
        <h2>Tower Types</h2>
        <div style={{display:'flex', gap:'0.5rem'}}>
          <input className="input" placeholder="Search by code..." value={search} onChange={e=>{setPage(1); setSearch(e.target.value);}} />
          <button className="btn accent" onClick={() => navigate('/tower-types/new')}>+ New</button>
        </div>
      </div>
      {err && <ErrorAlert error={err} />}
      {loading ? <Loading /> : (
        <>
          <DataTable
            columns={columns}
            rows={items}
            actions={(row) => (
              <div style={{display:'flex', gap:'0.4rem'}}>
                <button className="btn" onClick={() => navigate(`/tower-types/${row._id}/edit`)}>Edit</button>
                <button className="btn danger" onClick={() => setToDelete(row)}>Delete</button>
              </div>
            )}
          />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
      {toDelete && (
        <div style={{marginTop:'0.8rem'}}>
          <ConfirmDelete
            onConfirm={confirmDelete}
            onCancel={() => setToDelete(null)}
            message={`Delete tower type "${toDelete.code}"?`}
          />
        </div>
      )}
    </>
  );
}