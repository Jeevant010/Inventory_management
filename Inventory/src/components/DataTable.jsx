export default function DataTable({ columns, rows, actions }) {
  return (
    <div className="panel">
      <table className="table">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.header}>{col.header}</th>
            ))}
            {actions ? <th>Actions</th> : null}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={columns.length + (actions ? 1 : 0)} style={{textAlign:'center', color:'#9ca3af'}}>No records</td></tr>
          ) : rows.map((row) => (
            <tr key={row._id}>
              {columns.map(col => (
                <td key={col.header}>
                  {col.render ? col.render(row) : (col.accessor ? row[col.accessor] : '')}
                </td>
              ))}
              {actions ? <td>{actions(row)}</td> : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}