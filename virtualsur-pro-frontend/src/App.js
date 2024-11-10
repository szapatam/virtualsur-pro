import './App.css';
import React from 'react';
import Layout from './components/layout/layout';
import { Routes, Route } from 'react-router-dom';
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

//ESTE COMENTARIO SERA UNA PRUEBA PARA FORK GIT
function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/clientes" element={<ClientList />} />
        <Route path="/clientes/nuevo" element={<ClientCreate />} />
        <Route path="/clientes/:clienteId" element={<ClientDetail />} />
        <Route path="/personal" element={<StaffList />} />
        <Route path="/personal/nuevo" element={<StaffCreate />} />
        <Route path="/personal/:personalId" element={<StaffDetail />} />
        <Route path='/docs/NewDocs' element={<NewDocs />} />
        <Route path='/NewReport' element={<NewReport />} />
        <Route path='/InventoryHistory' element={<InventoryHistory />} />
        
      </Routes>
    </Layout>
  );
}

export default App;
