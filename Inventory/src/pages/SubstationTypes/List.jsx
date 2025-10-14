import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../components/DataTable.jsx';
import Pagination from '../../components/Pagination.jsx';
import ConfirmDelete from '../../components/ConfirmDelete.jsx';
import ErrorAlert from '../../components/ErrorAlert.jsx';
import Loading from '../../components/Loading.jsx';
import { listSubstationTypes, deleteSubstationType } from '../../api/substationTypes.js';

export default function SubstationTypeList() {
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
      const res = await listSubstationTypes({ page, limit, search });
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
    { header: 'Purpose', accessor: 'purpose' },
    { header: 'Tech', accessor: 'technology' },
    { header: 'Busbar', accessor: 'busbar_scheme' },
    { header: 'Voltages', render: (r)=> r.voltage_low_kv ? `${r.voltage_high_kv}/${r.voltage_low_kv}` : `${r.voltage_high_kv}` }
  ];

  async function confirmDelete() {
    if (!toDelete) return;
    try {
      await deleteSubstationType(toDelete._id);
      setToDelete(null);
      load();
    } catch (e) {
      setErr(e);
    }
  }

  return (
    <>
      <div className="toolbar">
        <h2>Substation Types</h2>
        <div style={{display:'flex', gap:'0.5rem'}}>
          <input className="input" placeholder="Search by code..." value={search} onChange={e=>{setPage(1); setSearch(e.target.value);}} />
          <button className="btn accent" onClick={() => navigate('/substation-types/new')}>+ New</button>
        </div>
      </div>
      {err && <ErrorAlert error={err} />}
      {loading ? <Loading /> : (
        <>
          <DataTable
            columns={columns}
            rows={items}
            actions={(row)=>(
              <div style={{display:'flex', gap:'0.4rem'}}>
                <button className="btn" onClick={() => navigate(`/substation-types/${row._id}/edit`)}>Edit</button>
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
            message={`Delete substation type "${toDelete.code}"?`}
          />
        </div>
      )}
    </>
  );
}