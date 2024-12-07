import React, { useState, useEffect} from 'react';
import './NewEquipment.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function NewEquipment() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [estado, setEstado] = useState('Operativo');
  const [equipment_name, setEquipmentName] = useState('');
  const [mensaje, setMensaje] = useState('');

  // Cargar categorías y subcategorías al cargar el componente
  useEffect(() => {
    const fetchCategories = async () => {
        const response = await axios.get('http://127.0.0.1:5000/category');
        setCategories(response.data);
    };
    fetchCategories();
  }, []);

// Manejar el cambio de categoría y cargar subcategorías asociadas
const handleCategoryChange = async (e) => {
  const categoryId = e.target.value;
  setSelectedCategory(categoryId);

  const response = await axios.get(`http://127.0.0.1:5000/subcategory/${categoryId}`);
  setSubcategories(response.data);
};

// Manejar el envío del formulario
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
      // Datos del equipo a enviar al backend
      const nuevoEquipo = {
          subcategory_id: selectedSubcategory,
          cantidad: cantidad,
          estado: estado,
          equipment_name: equipment_name
      };

      const response = await axios.post('http://127.0.0.1:5000/equipment', nuevoEquipo);
      setMensaje(response.data.message);
      alert('Se ha creado el Equipamiento con exito.')
      // Limpiar el formulario
      setSelectedCategory('');
      setSelectedSubcategory('');
      setCantidad('');
      setEquipmentName('');
      setEstado('Operativa');

      navigate('/InventoryList')
  } catch (error) {
      console.error('Error al ingresar el equipo:', error);
      setMensaje('Hubo un error al ingresar el equipo.');
  }
};



  return (
    <div className="new-equipment-container">
      <div className="new-equipment-header">
        <h1>Ingresar Equipamiento (Lote)</h1>
        {mensaje && <p>{mensaje}</p>}
        <button className="back-to-list-button" onClick={() => navigate('/InventoryList')}>
            Volver al Listado
        </button>
        </div>  
      <form onSubmit={handleSubmit} className="new-equipment-form">
        <fieldset>
        <legend>Nuevo Equipamiento</legend>
        <div>
            <label>Categoría:</label>
            <select value={selectedCategory} onChange={handleCategoryChange}>
              <option value="">Seleccione una categoría</option>
                {categories.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {category.category_name}
              </option>
             ))}
            </select>
          </div>
        <div>
            <label>Subcategoría:</label>
            <select value={selectedSubcategory} onChange={(e) => setSelectedSubcategory(e.target.value)}>
              <option value="">Seleccione una subcategoría</option>
                {subcategories.map((subcategory) => (
              <option key={subcategory.subcategory_id} value={subcategory.subcategory_id}>
                {subcategory.subcategory_name}
              </option>
              ))}
              </select>
          </div>
          <div>
            <label>Nombre del Equipo:</label>
              <input
                type="text"
                value={equipment_name}
                onChange={(e) => setEquipmentName(e.target.value)}
              />
          </div>
          <div>
            <label>Cantidad:</label>
            <input
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              min="1"
              required
            />
          </div>
          <div>
            <label>Estado:</label>
            <select value={estado} onChange={(e) => setEstado(e.target.value)}>
              <option value="Operativo">Operativo</option>
              <option value="No Operativo">No Operativo</option>
              <option value="En Mantención">En Mantención</option>
              <option value="Asignado">Asignado</option>
            </select>
          </div>
        </fieldset>
        <div className='save-button-container'>
            <button type="submit" className="submit-button">Ingresar</button>
        </div>

      </form>
    </div>
  );
}

export default NewEquipment;
