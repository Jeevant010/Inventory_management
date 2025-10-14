import client from './client';
import { toQuery } from './helpers';

export async function listSubstationTypes({ page=1, limit=10, search='' } = {}) {
  const q = toQuery({ page, limit, code: search });
  const res = await client.get(`/substation-types${q}`);
  return res.data;
}

export async function getSubstationType(id) {
  const res = await client.get(`/substation-types/${id}`);
  return res.data.data;
}

export async function createSubstationType(payload) {
  const res = await client.post('/substation-types', payload);
  return res.data.data;
}

export async function updateSubstationType(id, payload) {
  const res = await client.patch(`/substation-types/${id}`, payload);
  return res.data.data;
}

export async function deleteSubstationType(id) {
  const res = await client.delete(`/substation-types/${id}`);
  return res.data.data;
}