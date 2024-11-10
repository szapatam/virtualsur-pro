import React, { useState } from 'react';
import './NewReport.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

function NewReport() {
  // Estado para manejar los contratos y los filtros
  const [contracts] = useState([
    { id: 'C001', name: 'Contrato A', client: 'Cliente X', month: 'Enero', year: '2023' },
    { id: 'C002', name: 'Contrato B', client: 'Cliente Y', month: 'Febrero', year: '2023' },
    { id: 'C003', name: 'Contrato C', client: 'Cliente Z', month: 'Marzo', year: '2023' },
    { id: 'C004', name: 'Contrato D', client: 'Cliente X', month: 'Enero', year: '2024' },
  ]);

  const [filteredContracts, setFilteredContracts] = useState(contracts);
  const [filters, setFilters] = useState({ month: '', year: '', client: '' });

  // Manejar el cambio de los filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Filtrar contratos cuando cambian los filtros
  const applyFilters = () => {
    const filtered = contracts.filter(contract => {
      const matchesMonth = filters.month ? contract.month === filters.month : true;
      const matchesYear = filters.year ? contract.year === filters.year : true;
      const matchesClient = filters.client ? contract.client.toLowerCase().includes(filters.client.toLowerCase()) : true;
      return matchesMonth && matchesYear && matchesClient;
    });
    setFilteredContracts(filtered);
  };

  return (
    <div className="new-report-container">
      <div className="new-report-header">
        <h1>Reporte de contratos</h1>
      </div>

      <div className="new-report-filters">
        <label htmlFor="month">Elegir Mes:</label>
        <select name="month" id="month" value={filters.month} onChange={handleFilterChange}>
          <option value="">Elegir Mes</option>
          <option value="Enero">Enero</option>
          <option value="Febrero">Febrero</option>
          <option value="Marzo">Marzo</option>
        </select>

        <label htmlFor="year">Elegir Año:</label>
        <select name="year" id="year" value={filters.year} onChange={handleFilterChange}>
          <option value="">Elegir Año</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
        </select>

        <label htmlFor="client">Elegir Cliente:</label>
        <input
          type="text"
          id="client"
          name="client"
          value={filters.client}
          onChange={handleFilterChange}
          placeholder="Elegir Cliente"
        />

        <button onClick={applyFilters} className="filter-button">Aplicar Filtros</button>
      </div>

      <div className="new-report-table">
        <table>
          <thead>
            <tr>
              <th>Encabezado A</th>
              <th>Encabezado B</th>
              <th>Encabezado C</th>
              <th>Encabezado D</th>
            </tr>
          </thead>
          <tbody>
            {filteredContracts.map(contract => (
              <tr key={contract.id}>
                <td>{contract.id}</td>
                <td>{contract.name}</td>
                <td>{contract.client}</td>
                <td>
                  <button className="report-button">Ver Contrato</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="new-report-generate">
        <button className="generate-button">Generar Reporte</button>
      </div>
    </div>
  );
}

export default NewReport;
