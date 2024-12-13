import React, { useState, useEffect } from 'react';
import './EquipmentDetail.css';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../../api';

function EquipmentDetail() {
  const { equipmentId } = useParams(); // Obtener el id del equipo desde los parámetros de la URL
  const navigate = useNavigate();

  // Estados para almacenar datos del equipo y categorías
  const [equipmentName, setEquipmentName] = useState('');
  const [techCode, settechCode] = useState('');
  const [statusEquipment, setstatusEquipment] = useState('');
  //estado para cateogria y subcategoria
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');
  const {mensaje, setMensaje} = useState('');

  useEffect(() =>{
    const fetchInitialData = async () => {
      try {
        const response = await api.get(`http://127.0.0.1:5000/equipment/${equipmentId}`);
        const data = response.data;

        // Rellenan los estados con los datos
        setEquipmentName(data.equipment_name);
        setSubcategoryId(data.subcategory_id);
        settechCode(data.tech_code);
        setstatusEquipment(data.status_equipment);

        //Inicializa categoria y subcategoria con el valor actual
        setCategoryId(data.category_id);
        setSubcategoryId(data.subcategory_id);

        //Solicitar categoria
        const categoriesResponse = await api.get('http://127.0.0.1:5000/category')
        setCategories(categoriesResponse.data);

            // Solicitar las subcategorías
            const subcategoriesResponse = await api.get('http://127.0.0.1:5000/subcategory');
            setSubCategories(subcategoriesResponse.data);
      }catch (error){
        console.error("hubo un error al obtener los detalles del equipamiento", error);
        alert("Hubo un error al obtener los detalles del equipamiento");
      }
    };

    fetchInitialData();
  }, [equipmentId])

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    try {
        // Datos a actualizar en el equipamiento
        const updatedEquipment = {
            subcategory_id: subcategoryId,
            status_equipment: statusEquipment,
            equipment_name: equipmentName,
        };

        // Realiza la solicitud PUT al backend con el ID del equipamiento
        const response = await api.put(`http://127.0.0.1:5000/equipment/${equipmentId}`, updatedEquipment);

        alert('Equipamiento actualizado con éxito.');
        navigate('/InventoryList');  // Navegar de vuelta a la lista de inventario
    } catch (error) {
        console.error('Error al actualizar el equipamiento:', error);
        setMensaje('Hubo un error al actualizar el equipamiento.');
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
          <form className="new-equipment-form" onSubmit={handleUpdateSubmit}>
            <fieldset>
              <legend>Editar Equipamiento</legend>
              <div>
                <label>Categoría:</label>
                <select value={categoryId} onChange={(e) => {
                  const selectedCategoryId = e.target.value;
                  setCategoryId(selectedCategoryId);
                  //filtrar las subcategorias 
                  setSubCategories(subcategories.filter((subcat) => subcat.category_id === parseInt(selectedCategoryId)));
                  //Limpia la subcategoría actual
                  setSubcategoryId('');
                }}>
                  <option value="">Seleccione una categorías</option>
                  {categories.map((category) => (
                    <option key={category.category_id} value={category.category_id}>
                      {category.category_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Subcategoría:</label>
                <select value={subcategoryId} onChange={(e) => setSubcategoryId(e.target.value)}>
                  <option value="">Seleccione una subcategoria</option>
                  {subcategories.filter((subcat) => subcat.category_id === parseInt(categoryId))
                  .map((subcategory) => (
                    <option key={subcategory.subcategory_id} value={subcategory.subcategory_id}>
                      {subcategory.subcategory_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Nombre del Equipo:</label>
                <input type="text" value={equipmentName} onChange={(e) => setEquipmentName(e.target.value)}/>
              </div>
              <div>
                <label>Estado:</label>
                <select  value={statusEquipment} onChange={(e) => setstatusEquipment(e.target.value)}>
                  <option value="Operativo">Operativo</option>
                  <option value="No Operativo">No Operativo</option>
                  <option value="En Mantención">En Mantención</option>
                  <option value="Asignado">Asignado</option>
                </select>
              </div>
            </fieldset>
            <div className='save-button-container'>
              <button type="submit" className="submit-button">Guardar Cambios</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EquipmentDetail;
