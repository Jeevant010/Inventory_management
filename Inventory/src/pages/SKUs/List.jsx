import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../components/DataTable.jsx';
import Pagination from '../../components/Pagination.jsx';
import ConfirmDelete from '../../components/ConfirmDelete.jsx';
import ErrorAlert from '../../components/ErrorAlert.jsx';
import Loading from '../../components/Loading.jsx';
import { listSKUs, deleteSKU } from '../../api/skus.js';

export default function SKUList() {
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
      const res = await listSKUs({ page, limit, search });
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
    { header: 'SKU Code', accessor: 'sku_code' },
    { header: 'Description', accessor: 'description' },
    { header: 'Category', accessor: 'category' },
    { header: 'Asset Type', accessor: 'compatible_asset_type' },
    { header: 'Voltage', render: (r) => (r.voltage_min_kv && r.voltage_max_kv) ? `${r.voltage_min_kv}-${r.voltage_max_kv}` : '' }
  ];

  async function confirmDelete() {
    if (!toDelete) return;
    try {
      await deleteSKU(toDelete._id);
      setToDelete(null);
      load();
    } catch (e) {
      setErr(e);
    }
  }

  return (
    <>
      <div className="toolbar">
        <h2>SKUs</h2>
        <div style={{display:'flex', gap:'0.5rem'}}>
          <input className="input" placeholder="Search by SKU code..." value={search} onChange={e=>{setPage(1); setSearch(e.target.value);}} />
          <button className="btn accent" onClick={() => navigate('/skus/new')}>+ New</button>
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
                <button className="btn" onClick={() => navigate(`/skus/${row._id}/edit`)}>Edit</button>
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
            message={`Delete SKU "${toDelete.sku_code}"?`}
          />
        </div>
      )}
    </>
  );
}