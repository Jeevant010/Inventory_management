import client from './client';
import { toQuery } from './helpers';

export async function listSKUComps({ page=1, limit=10 } = {}) {
  const q = toQuery({ page, limit });
  const res = await client.get(`/sku-compatibilities${q}`);
  return res.data;
}

export async function getSKUComp(id) {
  const res = await client.get(`/sku-compatibilities/${id}`);
  return res.data.data;
}

export async function createSKUComp(payload) {
  const res = await client.post('/sku-compatibilities', payload);
  return res.data.data;
}

export async function updateSKUComp(id, payload) {
  const res = await client.patch(`/sku-compatibilities/${id}`, payload);
  return res.data.data;
}

export async function deleteSKUComp(id) {
  const res = await client.delete(`/sku-compatibilities/${id}`);
  return res.data.data;
}