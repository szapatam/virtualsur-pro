import React, { useState, useEffect } from 'react';
import './ContractDetail.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function ContractDetail() {

    const navigate = useNavigate();
    const { contractId } = useParams(); // Obtener ID por URL

    //Estados
    const [contract, setContract] = useState({});
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [contractEquipments, setContractEquipments] = useState([]); // Equipos asignados
    const [isModalOpen, setIsModalOpen] = useState(false); // Estado del modal
    const [availableEquipments, setAvailableEquipments] = useState([]); // Equipos disponibles
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const [selectedQuantity, setSelectedQuantity] = useState('');
    const [removedEquipments, setRemovedEquipments] = useState([]);

    
    

    // Abrir y cerrar el modal
    const openModal = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/equipment/available');
            const filteredEquipments = response.data.filter(
                (equipment) => equipment.available_count > 0
            );
            setAvailableEquipments(filteredEquipments);
            setIsModalOpen(true);
        } catch (error) {
            console.error("Error al cargar equipos disponibles:", error);
            alert("Hubo un error al cargar los equipos disponibles.");
        }
    };
    


      useEffect(() => {
        const fetchAvailableEquipments = async () => {
          try {
            const response = await axios.get("http://127.0.0.1:5000/equipment/available");
            console.log("Response from backend:", response.data);
            setAvailableEquipments(response.data);
          } catch (error) {
            console.error("Error fetching available equipment:", error);
          }
        };
      
        fetchAvailableEquipments();
      }, []);
      
      const handleAssignEquipment = () => {
        const selectedEquipment = availableEquipments.find(
            (equipment) => equipment.subcategory_id === selectedSubcategory
        );
    
        if (selectedEquipment) {
            const newAssignedEquipment = {
                subcategory_name: selectedEquipment.subcategory_name,
                quantity: selectedQuantity,
                subcategory_id: selectedSubcategory,
            };
    
            setContractEquipments([...contractEquipments, newAssignedEquipment]);
            setSelectedSubcategory('');
            setSelectedQuantity('');
            setIsModalOpen(false);
        } else {
            alert("Seleccione una subcategoría válida.");
        }
    };

    const handleAssignQuantity = (subcategoryId, quantity) => {
        setContractEquipments((prevEquipments) => {
            const updatedEquipments = prevEquipments.filter(
                (equipment) => equipment.subcategory_id !== subcategoryId
            );
            return [
                ...updatedEquipments,
                { subcategory_id: subcategoryId, quantity },
            ];
        });
    
        // Actualiza el input localmente
        setAvailableEquipments((prevEquipments) =>
            prevEquipments.map((equipment) =>
                equipment.subcategory_id === subcategoryId
                    ? { ...equipment, quantity }
                    : equipment
            )
        );
    };
    
    

    useEffect(() =>{
        //función para obtener detalle del contrato
        const fetchContractDetails = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/contracts/${contractId}`)
                setContract(response.data);

                //Actualizar los equipos asignados
                if (response.data.equipments){
                    setContractEquipments(response.data.equipments)
                }
                setLoading(false);
            } catch (error) {
                console.error("Error al obtener los detalles del contrato", error);
                alert("Hubo un error al obtener los detalles del contrato.");
                setLoading(false);
            }
    };

    //Función para obtener los clientes para el dropdown
    const fetchClients = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/clientes');
            setClients(response.data);
        } catch (error){
                console.error("Error al obtener los clientes", error);
            }
        };
    fetchContractDetails();
    fetchClients();
    }, [contractId]);
    
    useEffect(() => {
        const total = Math.round(
          (parseFloat(contract.square_meters) || 0) * (parseFloat(contract.square_meter_value) || 0) + (parseFloat(contract.additional_cost) || 0)
        );
        setContract((prevContract) => ({
          ...prevContract,
          total_cost: total,
        }));
      }, [contract.square_meters, contract.square_meter_value, contract.additional_cost]);

    if (loading){
        return <p>Cargando...</p>;
    }

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const payload = {
                ...contract,
                equipments: contractEquipments, // Incluye equipos asignados
                removed_equipments: removedEquipments, // Equipos eliminados
            };
            await axios.put(`http://127.0.0.1:5000/contracts/${contract.contract_id}`, payload);
            alert('Contrato actualizado con éxito.');
            navigate('/ContractList'); // Navegar de vuelta a la lista de contratos después de guardar los cambios
        } catch (error) {
            console.error('Error al actualizar el contrato:', error);
            alert('Hubo un error al actualizar el contrato.');
        }
    };


    const handleRemoveEquipment = (techCode) => {
    setContractEquipments((prevEquipments) =>
        prevEquipments.filter((equipment) => equipment.tech_code !== techCode)
    );

    setRemovedEquipments((prevRemoved) =>[
        ...prevRemoved,
        techCode,
    ]);
};
    

// Modal para asignar equipamiento
const Modal = ({
    availableEquipments,
    selectedSubcategory,
    setSelectedSubcategory,
    selectedQuantity,
    setSelectedQuantity,
    handleAssignEquipment,
    onSave,
    equipments,
    onClose,
    filteredEquipments,
    closeModal,
}) => {


    const handleSave = async () => {
        try {
            // Preparar datos para enviar al backend
            const dataToReserve = equipments.map((equipment) => ({
                subcategory_id: equipment.subcategory_id,
                quantity: parseInt(equipment.quantity || 0, 10),
            })).filter((item) => item.quantity > 0); // Filtrar solo los que tienen una cantidad válida
    
            if (dataToReserve.length === 0) {
                alert("No hay equipamiento para asignar.");
                return;
            }
    
            // Hacer POST al backend
            const response = await axios.post('http://127.0.0.1:5000/equipment/reserve', dataToReserve);

    
            // Actualizar la lista de equipos asignados en el estado principal
            onSave(response.data); // Pasar los equipos reservados al estado principal
    
            // Cerrar el Modal
            onClose();
        } catch (error) {
            console.error("Error asignando equipamiento:", error);
            alert("Hubo un error asignando el equipamiento.");
        }
    };
    return (
        <div className="modal">
            <div className="modal-content">
                <h3>Asignar Equipamiento</h3>
                <table className="modal-table">
                    <thead>
                        <tr>
                            <th>Subcategoría</th>
                            <th>Disponibles</th>
                            <th>Cantidad a Asignar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {availableEquipments.map((equipment) => (
                            <tr key={equipment.subcategory_id}>
                                <td>{equipment.subcategory_name}</td>
                                <td>{equipment.available_count}</td>
                                <td>
                                <input
                                    type="number"
                                    min="1"
                                    max={equipment.available_count}
                                    value={equipment.quantity || ''} // Asegúrate de que el valor persista
                                    onChange={(e) => {
                                        const quantity = parseInt(e.target.value, 10) || 0;
                                        
                                        // Actualiza el estado local para mostrar el número en el input
                                        setAvailableEquipments((prevEquipments) =>
                                            prevEquipments.map((eq) =>
                                                eq.subcategory_id === equipment.subcategory_id
                                                    ? { ...eq, quantity }
                                                    : eq
                                            )
                                        );
                                    }}
                                />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="modal-actions">
                    <button onClick={handleSave}>Guardar</button>
                    <button onClick={onClose}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};


    return (
        <div className="form-detail-container">
            <div className="contract">
                <div className='new-contract-header'>
                    <h1>Crear Contrato</h1>
                    <button className="back-to-list-button" onClick={() => navigate('/ContractList')}>
                        Volver al Listado
                    </button>
                </div>
                <div className='contract-section-box'>
                    <form onSubmit={handleUpdateSubmit}>
                    <fieldset>
                        <div className='form-detail-row'>
                            <div className='form-detail-group'>
                                <label>Ingresar Cliente: </label>
                                <select value={contract.client_id || ''} onChange={(e) => setContract({...contract, client_id: e.target.value})}>
                                    <option value="">Seleccione un cliente</option>
                                    {clients.map((client) => (
                                        <option key={client.client_id} value={client.client_id}>
                                            {client.client_name}
                                        </option>
                                    ))}
                                </select>
                                <label>Nombre del evento: </label>
                                <input type='text' value={contract.event_name} onChange={(e) => setContract({...contract, event_name: e.target.value})} />
                            </div>
                        </div>
                        <div className='form-detail-row'>
                            <div className='form-detail-group'>
                                <label>Fecha Inicio contrato: </label>
                                <input type='date' value={contract.contract_start_date} onChange={(e) => setContract({...contract, contract_start_date: e.target.value})} />
                                <label>Fecha Ejec. evento: </label>
                                <input type='date' value={contract.event_execution_date} onChange={(e) => setContract({...contract, event_execution_date: e.target.value})}/>
                            </div>
                        </div>
                        <div className='form-detail-row'>
                            <div className='form-detail-group'>
                                <label>Lugar del evento: </label>
                                <input type='text' value={contract.event_location} onChange={(e) => setContract({...contract, event_location: e.target.value})}/>
                                <label>Metros cuadrados: </label>
                                <input type='number' value={contract.square_meters} onChange={(e) => setContract({...contract, square_meters: e.target.value})}/>
                            </div>
                        </div>
                        <div className='form-detail-row'>
                            <div className='form-detail-group'>
                                <label>Valor metro cuadrado: </label>
                                <input type='number' value={contract.square_meter_value} onChange={(e) => setContract({...contract, square_meter_value: e.target.value})}/>
                                <label>Costo Adicional: </label>
                                <input type='number' value={contract.additional_cost} onChange={(e) => setContract({...contract, additional_cost: e.target.value})}/>
                            </div>
                        </div>
                        <div className='form-detail-row'>
                            <div className='form-detail-final-price-group'>
                                <label>VALOR TOTAL</label>
                                <input type='number' value={contract.total_cost} disabled/>
                            </div>
                        </div>
                    </fieldset>
                    <div className='save-button-container'>
                        <button className='submit-button' type='submit'> Guardar Cambios</button>
                    </div>
                    </form>
                </div>
            </div>
                <div className="equipment-section">
                     <h3>Equipamiento Asignado</h3>
                    <table className="assigned-equipment-table">
                        <thead>
                            <tr>
                                <th>Codigo Tecnico</th>
                                <th>Nombre Equipo</th>
                                <th>Subcategoría</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contractEquipments.map((equipment, index) => (
                            <tr key={index}>
                                <td>{equipment.tech_code || 'N/A'}</td>
                                <td>{equipment.equipment_name || 'N/A'}</td>
                                <td>{equipment.subcategory_name || 'N/A'}</td>
                                <td>
                            <button
                              className="remove-equipment-button" onClick={() => handleRemoveEquipment(equipment.tech_code)}
                            >
                                 Eliminar
                            </button>
                                </td>
                            </tr>
                            ))}
                            </tbody>
                    </table>
                    <button className="assign-equipment-button" onClick={openModal}>
                        Asignar Equipamiento
                    </button>
                </div>
            <div className="personal">
                <div className="contract-section-box">
                    <fieldset>
                        <legend>Personal</legend>
                        <table className="contracts-table">
                            <thead>
                                <tr>
                                    <th>Encabezado A</th>
                                    <th>Encabezado B</th>
                                    <th>Encabezado C</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Celda A</td>
                                    <td>Celda B</td>
                                    <td>Celda C</td>
                                </tr>
                            </tbody>
                        </table>
                    </fieldset>
                    <button className='add-iventory-item'>Añadir</button>
                    <button className='remove-item'>Eliminar</button>
                </div>
            </div>
            <div className="docs">
                <div className="contract-section-box">
                    <fieldset>
                        <legend>Documentos</legend>
                        <table className="contracts-table">
                            <thead>
                                <tr>
                                    <th>Encabezado A</th>
                                    <th>Encabezado B</th>
                                    <th>Encabezado C</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Celda A</td>
                                    <td>Celda B</td>
                                    <td>Celda C</td>
                                </tr>
                            </tbody>
                        </table>
                    </fieldset>
                    <button className='add-iventory-item'>Añadir</button>
                    <button className='remove-item'>Eliminar</button>
                </div>
            </div>
            {/* Renderizar modal */}
            {isModalOpen && (
    <Modal
        availableEquipments={availableEquipments}
        selectedSubcategory={selectedSubcategory}
        setSelectedSubcategory={setSelectedSubcategory}
        selectedQuantity={selectedQuantity}
        setSelectedQuantity={setSelectedQuantity}
        handleAssignEquipment={handleAssignEquipment}
        equipments={availableEquipments}
        onSave={(reservedEquipments) => {
            setContractEquipments((prevEquipments) =>[
                ...prevEquipments,
                ...reservedEquipments.map((equipment) => ({
                    tech_code: equipment.tech_code,
                    equipment_name: equipment.equipment_name,
                    subcategory_name: equipment.subcategory_name,
                    quantity: equipment.quantity,
                })),
            ]);
        }}
        onClose={() => setIsModalOpen(false)}
    />
)}
        </div>
    );
}

export default ContractDetail;