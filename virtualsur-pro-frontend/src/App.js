import './App.css';
import React from 'react';
import Layout from './components/layout/layout';
import ClientList from './components/pages/clients/ClientList/ClientList'
import { Routes, Route } from 'react-router-dom';
import Home from './components/pages/home/Home';
import ClientCreate from './components/pages/clients/ClientCreate/ClientCreate';

//ESTE COMENTARIO SERA UNA PRUEBA PARA FORK GIT
function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/clientes" element={<ClientList />} />
        <Route path="/clientes/nuevo" element={<ClientCreate />} />
      </Routes>
    </Layout>
  );
}

export default App;
