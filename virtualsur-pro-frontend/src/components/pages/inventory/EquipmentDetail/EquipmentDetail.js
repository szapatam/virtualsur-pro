import React, { useState, useEffect } from 'react';
import './EquipmentDetail.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function EquipmentDetail() {
  const { equipment_id } = useParams(); // Obtener el id del equipo desde los parámetros de la URL
  const navigate = useNavigate();

  // Estados para almacenar datos del equipo y categorías
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  // Fetch para obtener detalles del equipo y listas de categorías
  useEffect(() => {
    const fetchEquipmentDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/equipment/${equipment_id}`);
        const data = response.data;

        // Actualizar estados con los datos recibidos
        setCategory(data.category_id);
        setSubcategory(data.subcategory_id);
        setName(data.equipment_name);
        setStatus(data.status_equipment);
      } catch (error) {
        console.error('Hubo un error al obtener los detalles del equipo:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/category');
        setCategories(response.data);
      } catch (error) {
        console.error('Hubo un error al obtener las categorías:', error);
      }
    };

    const fetchSubcategories = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/subcategory');
        setSubcategories(response.data);
      } catch (error) {
        console.error('Hubo un error al obtener las subcategorías:', error);
      }
    };

    fetchEquipmentDetails();
    fetchCategories();
    fetchSubcategories();
  }, [equipment_id]);

  // Manejar el guardado de cambios
  const handleSaveChanges = async () => {
    try {
      const updatedEquipment = {
        category_id: category,
        subcategory_id: subcategory,
        equipment_name: name,
        status_equipment: status,
      };

      await axios.put(`http://127.0.0.1:5000/equipment/${equipment_id}`, updatedEquipment);
      alert('Cambios guardados exitosamente');
    } catch (error) {
      console.error('Hubo un error al guardar los cambios:', error);
    }
  };

  return (
    <div className="equipment-detail-container">
      <div className="equipment-detail-header">
        <h2>Detalle Equipamiento</h2>
        <button className='back-to-list-button' onClick={() => navigate('/InventoryList')}>Volver al listado</button>
      </div>

      <div className="equipment-detail-info">
        <div className="equipment-section">
          <form className="new-equipment-form">
            <fieldset>
              <legend>Editar Equipamiento</legend>
              <div>
                <label>Categoría:</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="">Seleccione una categoría</option>
                  {categories.map((cat) => (
                    <option key={cat.category_id} value={cat.category_id}>
                      {cat.category_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Subcategoría:</label>
                <select value={subcategory} onChange={(e) => setSubcategory(e.target.value)}>
                  <option value="">Seleccione una subcategoría</option>
                  {subcategories
                    .filter((sub) => sub.category_id === parseInt(category))
                    .map((sub) => (
                      <option key={sub.subcategory_id} value={sub.subcategory_id}>
                        {sub.subcategory_name}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label>Nombre del Equipo:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <label>Estado:</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="Operativa">Operativa</option>
                  <option value="No Operativa">No Operativa</option>
                  <option value="En Mantención">En Mantención</option>
                </select>
              </div>
            </fieldset>
            <div className='save-button-container'>
              <button type="button" onClick={handleSaveChanges} className="submit-button">Guardar Cambios</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EquipmentDetail;
