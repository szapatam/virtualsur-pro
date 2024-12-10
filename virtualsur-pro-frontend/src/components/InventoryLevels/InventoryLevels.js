import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './InventoryLevels.css';

const InventoryLevels = () => {
  const [inventoryData, setInventoryData] = useState([]);

  useEffect(() => {
    const fetchInventoryLevels = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/inventory/levels');
        setInventoryData(response.data.categories);
      } catch (error) {
        console.error('Error fetching inventory levels:', error);
      }
    };

    fetchInventoryLevels();
  }, []);

  const getProgressBarColor = (occupancy) => {
    if (occupancy >= 90) return '#ff5722'; // Naranja fuerte (90%-99%)
    if (occupancy === 100) return '#e51e1e'; // Rojo (100%)
    if (occupancy >= 50) return '#ffc107'; // Amarillo (50%-89%)
    return '#4caf50'; // Verde (0%-49%)
  };

  return (
    <div className="inventory-container">
      <h2>Niveles de Inventario</h2>
      {inventoryData.length > 0 ? (
        <table className="client-table">
          <thead>
            <tr>
              <th>Categoría</th>
              <th>Subcategoría</th>
              <th>Ocupación</th>
            </tr>
          </thead>
          <tbody>
            {inventoryData.map((category) => (
              <React.Fragment key={category.category_name}>
                <tr>
                  <td rowSpan={category.subcategories.length + 1} className="category-name">
                    {category.category_name}
                  </td>
                </tr>
                {category.subcategories.map((sub) => (
                  <tr key={sub.subcategory_name}>
                    <td>{sub.subcategory_name}</td>
                    <td>
                      <div className="progress-container">
                        <div
                          className="progress-bar"
                          style={{ width: `${sub.occupancy}%`,
                        backgroundColor: getProgressBarColor(sub.occupancy), }}
                        >
                          {parseInt(sub.occupancy)}%
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Cargando niveles de inventario...</p>
      )}
    </div>
  );
};

export default InventoryLevels;
