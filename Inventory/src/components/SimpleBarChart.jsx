import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function SimpleBarChart({ data, xKey, yKey }) {
  return (
    <div className="panel" style={{height: 320}}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey={xKey} stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip />
          <Bar dataKey={yKey} fill="#22c55e" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}