import client from './client';
import { toQuery } from './helpers';

export async function listTowerTypes({ page=1, limit=10, search='' } = {}) {
  const q = toQuery({ page, limit, code: search });
  const res = await client.get(`/tower-types${q}`);
  return res.data;
}

export async function getTowerType(id) {
  const res = await client.get(`/tower-types/${id}`);
  return res.data.data;
}

export async function createTowerType(payload) {
  const res = await client.post('/tower-types', payload);
  return res.data.data;
}

export async function updateTowerType(id, payload) {
  const res = await client.patch(`/tower-types/${id}`, payload);
  return res.data.data;
}

export async function deleteTowerType(id) {
  const res = await client.delete(`/tower-types/${id}`);
  return res.data.data;
}