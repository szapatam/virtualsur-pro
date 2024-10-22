import './App.css';
import React from 'react';
import Layout from './components/layout/layout';
import ClientList from './components/pages/clients/ClientList/ClientList'
import { Routes, Route } from 'react-router-dom';
import Home from './components/pages/home/Home';

//ESTE COMENTARIO SERA UNA PRUEBA PARA FORK GIT
function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/clientes" element={<ClientList />} />
      </Routes>
    </Layout>
  );
}

export default App;
