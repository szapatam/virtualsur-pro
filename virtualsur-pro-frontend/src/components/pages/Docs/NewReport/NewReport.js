import React, { useState, useEffect } from 'react';
import './NewReport.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

function NewReport() {

  const [clients, setClients] = useState([]);
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [clientId, setClientId] = useState('');
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
      // Obtener clientes para el select
      const fetchClients = async () => {
          try {
              const response = await axios.get('http://127.0.0.1:5000/clientes');
              setClients(response.data);
          } catch (error) {
              console.error("Error al cargar clientes:", error);
          }
      };
      fetchClients();
  }, []);

  const handleSearchContracts = async () => {
      try {
          setLoading(true);
          const filters = {
              month: month ? parseInt(month) : undefined,
              year: year ? parseInt(year) : undefined,
              client_id: clientId || undefined,
          };

          const response = await axios.get('http://127.0.0.1:5000/contracts/filter', {
              params: filters,
          });

          setContracts(response.data);
          setLoading(false);
      } catch (error) {
          console.error("Error al buscar contratos:", error);
          alert("Hubo un error al buscar los contratos.");
          setLoading(false);
      }
  };

  const handleGenerateReport = async () => {
      try {
          setLoading(true);
          const filters = {
              month: month ? parseInt(month) : undefined,
              year: year ? parseInt(year) : undefined,
              client_id: clientId || undefined,
          };

          const response = await axios.post('http://127.0.0.1:5000/contracts/filter/report', filters, {
              responseType: 'blob', // Para manejar el PDF directamente
          });

          // Descargar el archivo PDF
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'Reporte_Contratos.pdf');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          setLoading(false);
      } catch (error) {
          console.error("Error al generar el reporte:", error);
          alert("Hubo un error al generar el reporte.");
          setLoading(false);
      }
  };

  return (
    <div className="new-report-container">
      <div className="new-report-header">
        <h1>Reporte de contratos</h1>
      </div>

      <div className="new-report-filters">
        <label htmlFor="month">Elegir Mes:</label>
        <select name="month" id="month" value={month} onChange={(e) => setMonth(e.target.value)}>
        <option value="">Seleccionar Mes</option>
          <option value="1">Enero</option>
          <option value="2">Febrero</option>
          <option value="3">Marzo</option>
          <option value="4">Abril</option>
          <option value="5">Mayo</option>
          <option value="6">Junio</option>
          <option value="7">Julio</option>
          <option value="8">Agosto</option>
          <option value="9">Septiembre</option>
          <option value="10">Octubre</option>
          <option value="11">Noviembre</option>
          <option value="12">Diciembre</option>
        </select>

        <label htmlFor="year">Seleccionar Año</label>
        <select name="year" id="year" value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="">Elegir Año</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
        </select>

        <label htmlFor="client">Seleccionar Cliente</label>
        <select id="client" value={clientId} onChange={(e) => setClientId(e.target.value)}>
          <option value="">Seleccionar Cliente</option>
          {clients.map((client) => (
              <option key={client.client_id} value={client.client_id}>
                  {client.client_name}
              </option>
          ))}
        </select>

        <button className="filter-button" onClick={handleSearchContracts} disabled={loading}>
        {loading ? 'Buscando...' : 'Buscar Contratos'}
        </button>
      </div>

      <div className="new-report-table">
      <table>
        <thead>
            <tr>
                <th>Código</th>
                <th>Evento</th>
                <th>Cliente</th>
                <th>Ubicación</th>
                <th>Metros Cuadrados</th>
                <th>Costo Total</th>
            </tr>
        </thead>
        <tbody>
            {contracts.map((contract) => (
                <tr key={contract.contract_id}>
                    <td>{contract.contract_code}</td>
                    <td>{contract.event_name}</td>
                    <td>{contract.client_name}</td>
                    <td>{contract.event_location}</td>
                    <td>{contract.square_meters}</td>
                    <td>${contract.total_cost}</td>
                </tr>
            ))}
        </tbody>
    </table>
      </div>

      <div className="new-report-generate">
        <button className="generate-button" onClick={handleGenerateReport}>Generar Reporte</button>
      </div>
    </div>
  );
}

export default NewReport;
