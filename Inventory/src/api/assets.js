import client from './client';
import { toQuery } from './helpers';

export async function listAssets({ page=1, limit=10, search='' } = {}) {
  const q = toQuery({ page, limit, type_code: search });
  const res = await client.get(`/assets${q}`);
  return res.data;
}

export async function getAsset(id) {
  const res = await client.get(`/assets/${id}`);
  return res.data.data;
}

export async function createAsset(payload) {
  const res = await client.post('/assets', payload);
  return res.data.data;
}

export async function updateAsset(id, payload) {
  const res = await client.patch(`/assets/${id}`, payload);
  return res.data.data;
}

export async function deleteAsset(id) {
  const res = await client.delete(`/assets/${id}`);
  return res.data.data;
}