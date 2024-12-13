import './App.css';
import React from 'react';
import Layout from './components/layout/layout';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './components/pages/home/Home';
import ClientList from './components/pages/clients/ClientList/ClientList'
import ClientCreate from './components/pages/clients/ClientCreate/ClientCreate';
import ClientDetail from './components/pages/clients/ClientDetails/ClientDetail';
import StaffList from './components/pages/staff/StaffList/StaffList';
import StaffCreate from './components/pages/staff/StaffCreate/StaffCreate';
import StaffDetail from './components/pages/staff/StaffDetails/StaffDetail';
import NewDocs from './components/pages/Docs/NewDocs/NewDocs';
import NewReport from './components/pages/Docs/NewReport/NewReport';
import InventoryHistory from './components/pages/Docs/InventoryHistory/InventoryHistory';
import InventoryList from './components/pages/inventory/InventoryList/InventoryList';
import NewEquipment from './components/pages/inventory/NewEquipment/NewEquipment';
import EquipmentDetail from './components/pages/inventory/EquipmentDetail/EquipmentDetail';
import ContractList from './components/pages/contracts/ContractList/ContractList';
import ContractCreate from './components/pages/contracts/ContractCreate/ContractCreate';
import ContractDetail from './components/pages/contracts/ContractDetail/ContractDetail';
import Login from './components/login/Login';


const ProtectedRoute = ({ children }) => {
  
  const token = localStorage.getItem('token'); // Obtenemos el token JWT

  if (!token) {
    // Si no hay token, redirige al login
    return <Navigate to="/login" replace />;
  }

  return children; // Si hay token, renderiza la ruta protegida
};


//ESTE COMENTARIO SERA UNA PRUEBA PARA FORK GIT
function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/clientes" element={<ProtectedRoute><ClientList /></ProtectedRoute>} />
        <Route path="/clientes/nuevo" element={<ProtectedRoute><ClientCreate /></ProtectedRoute>} />
        <Route path="/clientes/:clientId" element={<ProtectedRoute><ClientDetail /></ProtectedRoute>} />
        <Route path="/personal" element={<ProtectedRoute><StaffList /></ProtectedRoute>} />
        <Route path="/personal/nuevo" element={<ProtectedRoute><StaffCreate /></ProtectedRoute>} />
        <Route path="/personal/:staffId" element={<ProtectedRoute><StaffDetail /></ProtectedRoute>} />
        <Route path='/docs/NewDocs' element={<ProtectedRoute><NewDocs /></ProtectedRoute>} />
        <Route path='/NewReport' element={<ProtectedRoute><NewReport /></ProtectedRoute>} />
        <Route path='/InventoryHistory' element={<ProtectedRoute><InventoryHistory /></ProtectedRoute>} />
        <Route path='/InventoryList' element={<ProtectedRoute><InventoryList /></ProtectedRoute>} />
        <Route path='/equipment' element={<ProtectedRoute><NewEquipment /></ProtectedRoute>} />
        <Route path='/equipment/:equipmentId' element={<ProtectedRoute><EquipmentDetail /></ProtectedRoute>} />
        <Route path='/ContractList/' element={<ProtectedRoute><ContractList /></ProtectedRoute>} />
        <Route path='/ContractCreate' element={<ProtectedRoute><ContractCreate /></ProtectedRoute>} />
        <Route path='/contract/:contractId' element={<ProtectedRoute><ContractDetail /></ProtectedRoute>} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
    </Routes> 
    </Layout>
  );
}

export default App;
