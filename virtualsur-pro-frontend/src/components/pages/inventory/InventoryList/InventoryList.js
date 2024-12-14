import React, { useState, useEffect } from 'react';
import './InventoryList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import api from '../../../../api';

function InventoryList() {
    const navigate = useNavigate();
    const [groupedEquipments, setGroupedEquipments] = useState([]); // Datos agrupados
    const [expandedSubcategories, setExpandedSubcategories] = useState({}); // Estado de desplegables
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchEquipments = async () => {
        try {
            const response = await api.get('http://127.0.0.1:5000/equipment/grouped');
            setGroupedEquipments(response.data);
            setLoading(false);
        } catch (error) {
            setError("Hubo un error al obtener el inventario");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEquipments();
    }, []);

    const toggleSubcategory = (subcategory) => {
        setExpandedSubcategories((prevState) => ({
            ...prevState,
            [subcategory]: !prevState[subcategory]
        }));
    };

    const handleDeleteEquipment = (equipmentId) => {
        api.delete(`http://127.0.0.1:5000/equipment/${equipmentId}`)
            .then(() => {
                fetchEquipments(); // Refrescar la tabla después de eliminar
                alert('Equipamiento eliminado con éxito');
            })
            .catch((error) => {
                console.error('Error al eliminar equipamiento', error);
                alert('Hubo un error al eliminar equipamiento');
            });
    };

    return (
        <div className="inventory-list-container">
            <div className="inventory-list-header">
                <h1>Listado de Inventario</h1>
                {loading && <p>Cargando...</p>}
                {error && <p className="error-message">{error}</p>}
                <button className="new-equipment-button" onClick={() => navigate('/equipment')}>
                    Nuevo Equipamiento
                </button>
            </div>
            <div className="inventory-list-table">
                <table>
                    <thead>
                        <tr>
                            <th>Subcategoría</th>
                            <th>Código Técnico</th>
                            <th>Nombre</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {groupedEquipments.map((group, index) => (
                            <React.Fragment key={index}>
                                {/* Fila de la subcategoría */}
                                <tr>
                                    <td colSpan="5" className='subcategory-row'>
                                        <button
                                            className={`dropdown-button ${expandedSubcategories[group.subcategory_name] ? 'expanded' : ''}`}
                                            onClick={() => toggleSubcategory(group.subcategory_name)}
                                        >
                                            {expandedSubcategories[group.subcategory_name] ? (
                                                <FontAwesomeIcon icon={faChevronDown} className="chevron-icon"  />
                                            ) : (
                                                <FontAwesomeIcon icon={faChevronRight} />
                                            )}
                                            {group.subcategory_name}
                                        </button>
                                    </td>
                                </tr>
                                {/* Filas de los equipos, visibles solo si la subcategoría está expandida */}
                                {expandedSubcategories[group.subcategory_name] &&
                                    group.equipments.map((equipment) => (
                                        <tr key={equipment.equipment_id} className={`equipment-row ${
                                          expandedSubcategories[group.subcategory_name] ? 'expanded' : ''
                                      }`}>
                                            <td className='filler'></td>
                                            <td>{equipment.tech_code}</td>
                                            <td>{equipment.equipment_name}</td>
                                            <td>{equipment.status_equipment}</td>
                                            <td>
                                                <button
                                                    onClick={() => navigate(`/equipment/${equipment.equipment_id}`)}
                                                    className="action-button edit"
                                                >
                                                    <FontAwesomeIcon icon={faEdit} /> Ver/Editar
                                                </button>
                                                <button
                                                    className="action-button delete"
                                                    onClick={() => handleDeleteEquipment(equipment.equipment_id)}
                                                >
                                                    <FontAwesomeIcon icon={faTrash} /> Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default InventoryList;
