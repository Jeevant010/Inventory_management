import { NavLink, Route, Routes, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';

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

// New pages
import Dashboard from './pages/Analytics/Dashboard.jsx';
import TowerAnalysis from './pages/Analytics/TowerAnalysis.jsx';
import SubstationAnalysis from './pages/Analytics/SubstationAnalysis.jsx';
import SKUAnalysis from './pages/Analytics/SKUAnalysis.jsx';
import RequiredParts from './pages/Requirements/RequiredParts.jsx';
import PredictDemand from './pages/ML/PredictDemand.jsx';

export default function App() {
  return (
    <Layout
      nav={
        <>
          <NavLink to="/dashboard" className={({isActive}) => isActive ? 'active' : ''}>Dashboard</NavLink>
          <NavLink to="/tower-types" className={({isActive}) => isActive ? 'active' : ''}>Tower Types</NavLink>
          <NavLink to="/substation-types" className={({isActive}) => isActive ? 'active' : ''}>Substation Types</NavLink>
          <NavLink to="/skus" className={({isActive}) => isActive ? 'active' : ''}>SKUs</NavLink>
          <NavLink to="/sku-compatibilities" className={({isActive}) => isActive ? 'active' : ''}>SKU Compat</NavLink>
          <NavLink to="/assets" className={({isActive}) => isActive ? 'active' : ''}>Assets</NavLink>
          <NavLink to="/analysis/towers" className={({isActive}) => isActive ? 'active' : ''}>Towers Analysis</NavLink>
          <NavLink to="/analysis/substations" className={({isActive}) => isActive ? 'active' : ''}>Substations Analysis</NavLink>
          <NavLink to="/analysis/skus" className={({isActive}) => isActive ? 'active' : ''}>SKUs Analysis</NavLink>
          <NavLink to="/requirements" className={({isActive}) => isActive ? 'active' : ''}>Required Parts</NavLink>
          <NavLink to="/ml/predict-demand" className={({isActive}) => isActive ? 'active' : ''}>Predict Demand</NavLink>
        </>
      }
    >
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />

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

        <Route path="/analysis/towers" element={<TowerAnalysis />} />
        <Route path="/analysis/substations" element={<SubstationAnalysis />} />
        <Route path="/analysis/skus" element={<SKUAnalysis />} />

        <Route path="/requirements" element={<RequiredParts />} />
        <Route path="/ml/predict-demand" element={<PredictDemand />} />
      </Routes>
    </Layout>
  );
}