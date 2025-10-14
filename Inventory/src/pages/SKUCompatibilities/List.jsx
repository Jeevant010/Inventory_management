import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../components/DataTable.jsx';
import Pagination from '../../components/Pagination.jsx';
import ConfirmDelete from '../../components/ConfirmDelete.jsx';
import ErrorAlert from '../../components/ErrorAlert.jsx';
import Loading from '../../components/Loading.jsx';
import { listSKUComps, deleteSKUComp } from '../../api/skuCompatibility.js';

export default function SKUCompList() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const navigate = useNavigate();

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const res = await listSKUComps({ page, limit });
      setItems(res.data);
      setTotalPages(res.totalPages);
    } catch (e) {
      setErr(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [page, limit]);

  const columns = [
    { header: 'SKU', render: (r) => r.sku ? r.sku.sku_code : '(unpopulated)' },
    { header: 'Type Code', accessor: 'type_code' },
    { header: 'Constraints', render: (r) => r.constraints ? JSON.stringify(Object.fromEntries(Object.entries(r.constraints)), null, 0) : '' }
  ];

  async function confirmDelete() {
    if (!toDelete) return;
    try {
      await deleteSKUComp(toDelete._id);
      setToDelete(null);
      load();
    } catch (e) {
      setErr(e);
    }
  }

  return (
    <>
      <div className="toolbar">
        <h2>SKU Compatibilities</h2>
        <div style={{display:'flex', gap:'0.5rem'}}>
          <button className="btn accent" onClick={() => navigate('/sku-compatibilities/new')}>+ New</button>
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
                <button className="btn" onClick={() => navigate(`/sku-compatibilities/${row._id}/edit`)}>Edit</button>
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
            message={`Delete SKU compatibility for "${toDelete.type_code}"?`}
          />
        </div>
      )}
    </>
  );
}