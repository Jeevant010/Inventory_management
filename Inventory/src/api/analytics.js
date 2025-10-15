import client from './client';
import { toQuery } from './helpers';

export async function getOverview() {
  const res = await client.get('/analytics/overview');
  return res.data.data;
}

export async function getTowerBreakdown() {
  const res = await client.get('/analytics/towers');
  return res.data.data;
}

export async function getSubstationBreakdown() {
  const res = await client.get('/analytics/substations');
  return res.data.data;
}

export async function getSkuBreakdown() {
  const res = await client.get('/analytics/skus');
  return res.data.data;
}

export async function getCompatibilityGaps() {
  const res = await client.get('/analytics/compatibility-gaps');
  return res.data.data;
}

export async function getRequiredParts(params) {
  const q = toQuery(params);
  const res = await client.get(`/analytics/required-parts${q}`);
  return res.data.data;
}