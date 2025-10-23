import { NavLink } from 'react-router-dom';

export default function Layout({ nav, children }) {
  return (
    <>
      <div className="navbar">
        <NavLink to="/dashboard" style={{fontWeight:700, marginRight: '0.5rem'}}>Inventory</NavLink>
        {nav}
        <div style={{marginLeft: 'auto'}}></div>
      </div>
      <div className="container">
        {children}
        <div className="footer">Smart India Hackathon • Inventory Management</div>
      </div>
    </>
  );
}