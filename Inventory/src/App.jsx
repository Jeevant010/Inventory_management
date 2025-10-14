import { NavLink, Route, Routes, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';

// Pages
import TowerTypeList from './pages/TowerTypes/List.jsx';
import TowerTypeForm from './pages/TowerTypes/Form.jsx';
import SubstationTypeList from './pages/SubstationTypes/List.jsx';
import SubstationTypeForm from './pages/SubstationTypes/Form.jsx';
import SKUList from './pages/SKUs/List.jsx';
import SKUForm from './pages/SKUs/Form.jsx';
import SKUCompList from './pages/SKUCompatibilities/List.jsx';
import SKUCompForm from './pages/SKUCompatibilities/Form.jsx';
import AssetList from './pages/Assets/List.jsx';
import AssetForm from './pages/Assets/Form.jsx';

export default function App() {
  return (
    <Layout
      nav={
        <>
          <NavLink to="/tower-types" className={({isActive}) => isActive ? 'active' : ''}>Tower Types</NavLink>
          <NavLink to="/substation-types" className={({isActive}) => isActive ? 'active' : ''}>Substation Types</NavLink>
          <NavLink to="/skus" className={({isActive}) => isActive ? 'active' : ''}>SKUs</NavLink>
          <NavLink to="/sku-compatibilities" className={({isActive}) => isActive ? 'active' : ''}>SKU Compat</NavLink>
          <NavLink to="/assets" className={({isActive}) => isActive ? 'active' : ''}>Assets</NavLink>
        </>
      }
    >
      <Routes>
        <Route path="/" element={<Navigate to="/tower-types" replace />} />

        <Route path="/tower-types" element={<TowerTypeList />} />
        <Route path="/tower-types/new" element={<TowerTypeForm />} />
        <Route path="/tower-types/:id/edit" element={<TowerTypeForm />} />

        <Route path="/substation-types" element={<SubstationTypeList />} />
        <Route path="/substation-types/new" element={<SubstationTypeForm />} />
        <Route path="/substation-types/:id/edit" element={<SubstationTypeForm />} />

        <Route path="/skus" element={<SKUList />} />
        <Route path="/skus/new" element={<SKUForm />} />
        <Route path="/skus/:id/edit" element={<SKUForm />} />

        <Route path="/sku-compatibilities" element={<SKUCompList />} />
        <Route path="/sku-compatibilities/new" element={<SKUCompForm />} />
        <Route path="/sku-compatibilities/:id/edit" element={<SKUCompForm />} />

        <Route path="/assets" element={<AssetList />} />
        <Route path="/assets/new" element={<AssetForm />} />
        <Route path="/assets/:id/edit" element={<AssetForm />} />
      </Routes>
    </Layout>
  );
}