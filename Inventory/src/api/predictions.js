import client from './client';
import { toQuery } from './helpers';

export async function listPredictions({ page=1, limit=20, subject_type, subject_id, task } = {}) {
  const q = toQuery({ page, limit, subject_type, subject_id, task });
  const res = await client.get(`/predictions${q}`);
  return res.data;
}