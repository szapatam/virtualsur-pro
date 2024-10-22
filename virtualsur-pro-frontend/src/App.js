import './App.css';
import React from 'react';
import Layout from './components/layout/layout';
import ClientList  from './components/clientList/ClientList';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
      <Layout>
        <Routes>
          <Route path="/" element={ <div className="App-content"><h1>Bienvenido a VirtualSur Pro</h1></div>} />
          <Route path="/clientes" element={<div className='App-content'><ClientList /></div>} />
        </Routes>
     </Layout>
  ); 
} 
 
export default App;
