import React, { useState } from 'react';
import './InventoryHistory.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

function InventoryHistory() {
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [filteredInventory, setFilteredInventory] = useState([]);

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };

  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  const handleGenerateReport = () => {
    // Aquí se manejaría la lógica para filtrar el inventario en base al mes y año seleccionados
    // De momento se dejará como ejemplo el mismo array
    setFilteredInventory([
      { id: 'I001', name: 'Equipo A', detail: 'Detalles del equipo A' },
      { id: 'I002', name: 'Equipo B', detail: 'Detalles del equipo B' },
      { id: 'I003', name: 'Equipo C', detail: 'Detalles del equipo C' },
      { id: 'I004', name: 'Equipo D', detail: 'Detalles del equipo D' },
    ]);
  };

  return (
    <div className="inventory-history-container">
      <div className="inventory-history-header">
        <h1>Histórico de inventario</h1>
      </div>

      <div className="inventory-history-filters">
        <label htmlFor="month">Filtros:</label>
        <select id="month" value={month} onChange={handleMonthChange}>
          <option value="">Elegir Mes</option>
          <option value="Enero">Enero</option>
          <option value="Febrero">Febrero</option>
          <option value="Marzo">Marzo</option>
          <option value="Abril">Abril</option>
          <option value="Mayo">Mayo</option>
          <option value="Junio">Junio</option>
          <option value="Julio">Julio</option>
          <option value="Agosto">Agosto</option>
          <option value="Septiembre">Septiembre</option>
          <option value="Octubre">Octubre</option>
          <option value="Noviembre">Noviembre</option>
          <option value="Diciembre">Diciembre</option>
        </select>

        <select id="year" value={year} onChange={handleYearChange}>
          <option value="">Elegir Año</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
        </select>
      </div>

      <div className="inventory-history-table">
        <table>
          <thead>
            <tr>
              <th>Encabezado A</th>
              <th>Encabezado B</th>
              <th>Encabezado C</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="inventory-history-buttons">
        <button className="generate-report-button" onClick={handleGenerateReport}>Generar Reporte</button>
      </div>
    </div>
  );
}

export default InventoryHistory;
