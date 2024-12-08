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
    //sección de personal
    const [contractPersonal, setContractPersonal] = useState([]); // Personal asignado al contrato
    const [availablePersonal, setAvailablePersonal] = useState([]); // Personal disponible
    const [isPersonalModalOpen, setIsPersonalModalOpen] = useState(false); // Estado del modal para personal
    const [assignedPersonnel, setAssignedPersonnel] = useState([]);
    

    //sección personal
    useEffect(() => {
        const fetchContractPersonal = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/contracts/${contractId}/personal`);
                console.log("Datos del personal asignado", response.data);
                setContractPersonal(response.data || []);
            } catch (error) {
                console.error("Error al obtener el personal asignado:", error);
            }
        };
    
        fetchContractPersonal();
    }, [contractId]);
    
    const openPersonalModal = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:5000/personal/available");
            setAvailablePersonal(response.data);
            setIsPersonalModalOpen(true);
        } catch (error) {
            console.error("Error al obtener personal disponible:", error);
            alert("Hubo un error al cargar el personal disponible.");
        }
    };

    const handleAssignPersonnel = async (staffId) => {
        try {
            const response = await axios.post(`http://127.0.0.1:5000/contracts/${contractId}/assign_personal`, {
                contract_id: contractId,
                staff_id: staffId,
            });
    
            const assignedPerson = response.data.assigned_personnel; // Revisa que el backend retorne los datos completos
    
            // Actualiza el estado de personal asignado
            setContractPersonal((prevPersonnel) => [...prevPersonnel, assignedPerson]);
            setAssignedPersonnel((prevPersonnel) => [...prevPersonnel, assignedPerson]);
        } catch (error) {
            console.error('Error al asignar personal:', error);
            alert('Hubo un error al asignar el personal.');
        }
    };
    
    const handleRemovePersonal = async (staffId) => {
        try {
            await axios.delete(`http://127.0.0.1:5000/contracts/${contractId}/remove_personal/${staffId}`);
    
            // Mover el personal de asignados a disponibles
            const removedPersonal = contractPersonal.find((person) => person.staff_id === staffId);
            setAvailablePersonal([...availablePersonal, removedPersonal]);
    
            // Actualizar el estado local
            setContractPersonal(contractPersonal.filter((person) => person.staff_id !== staffId));
    
            alert("Personal eliminado del contrato.");
        } catch (error) {
            console.error("Error al eliminar personal:", error);
            alert("Hubo un error al eliminar el personal.");
        }
    };
    
    
    

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
                equipment_id: selectedEquipment.equipment_id,
            };
    
            setContractEquipments([...contractEquipments, newAssignedEquipment]);
            setSelectedSubcategory('');
            setSelectedQuantity('');
            setIsModalOpen(false);
        } else {
            alert("Seleccione una subcategoría válida.");
        }
    };

    const handleAssignQuantity = async (subcategoryId, quantity) => {
        if (!quantity || quantity <= 0) return;
    
        const selectedEquipment = availableEquipments.find(
            (equipment) => equipment.subcategory_id === subcategoryId
        );
    
        if (selectedEquipment) {
            const idsToAssign = selectedEquipment.equipment_ids.slice(0, quantity); // Seleccionar los IDs necesarios
    
            setContractEquipments((prevEquipments) => [
                ...prevEquipments,
                ...idsToAssign.map((id, index) => ({
                    tech_code: selectedEquipment.tech_codes[index],
                    equipment_name: selectedEquipment.equipment_names[index],
                    subcategory_name: selectedEquipment.subcategory_name,
                    equipment_id: id, // Asegúrate de incluir el equipment_id
                    quantity: 1, // Cada equipo es individual
                })),
            ]);
    
            // Actualizar los disponibles
            setAvailableEquipments((prevEquipments) =>
                prevEquipments.map((equipment) =>
                    equipment.subcategory_id === subcategoryId
                        ? {
                            ...equipment,
                            available_count: equipment.available_count - quantity,
                            equipment_ids: equipment.equipment_ids.slice(quantity),
                            tech_codes: equipment.tech_codes.slice(quantity),
                            equipment_names: equipment.equipment_names.slice(quantity),
                        }
                        : equipment
                )
            );
        }
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
                // Actualiza el personal asignado
                if (response.data.assigned_personnel) {
                    setAssignedPersonnel(response.data.assigned_personnel);
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
                personal: contractPersonal, // Incluir Personal asignado
            };
            await axios.put(`http://127.0.0.1:5000/contracts/${contract.contract_id}`, payload);
            alert('Contrato actualizado con éxito.');
            navigate('/ContractList'); // Navegar de vuelta a la lista de contratos después de guardar los cambios
        } catch (error) {
            console.error('Error al actualizar el contrato:', error);
            alert('Hubo un error al actualizar el contrato.');
        }
    };


    const handleRemoveEquipment = async (equipmentId) => {
        try {
            // Llama al backend para actualizar el estado del equipo
            await axios.delete(`http://127.0.0.1:5000/contracts/${contract.contract_id}/remove_equipment/${equipmentId}`);
    
            // Actualiza el estado local para eliminar el equipo
            setContractEquipments((prevEquipments) =>
                prevEquipments.filter((equipment) => equipment.equipment_id !== equipmentId)
            );
        } catch (error) {
            console.error("Error al eliminar el equipo:", error);
            alert("Hubo un error al eliminar el equipo.");
        }
    };


    
    

// Modal para asignar equipamiento
const Modal = ({
    availableEquipments,
    onSave,
    equipments,
    onClose
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
            <div className="contract-section-box">
                <fieldset>
                    <legend>Seleccionar cantidad</legend>
                <table className="assigned-equipment-table">
                    <thead>
                        <tr>
                            <th>Subcategoría</th>
                            <th>Disponibles</th>
                            <th>Cantidad a Asignar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {availableEquipments.map((equipment, index) => (
                            <tr key={equipment.subcategory_id}>
                                <td>{equipment.subcategory_name}</td>
                                <td>{equipment.available_count}</td>
                                <td>
                                <input
                                    className='modal-input'
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

                                        handleAssignQuantity(equipment.subcategory_id, quantity);
                                    }}
                                />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </fieldset>
                <div className="modal-actions">
                    <button onClick={onClose} className='modal-button'>Confirmar</button>
                </div>
            </div>
        </div>
    );
};

// Modal para asignar Personal
const PersonalModal = ({ availablePersonal, onClose, onAssign }) => {
    return (
        <div className="modal">
            <div className="contract-section-box"> 
                <table>
                <fieldset>
                    <legend>Asignar Personal</legend>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {availablePersonal.map((person) => (
                            <tr key={person.staff_id}>
                                <td>{person.name}</td>
                                <td>{person.role}</td>
                                <td>
                                    <button onClick={() => onAssign(person.staff_id)} className='modal-button'>Asignar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </fieldset>
                </table>
                <button onClick={onClose} className='modal-button'>Cerrar</button>
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
        <div className='inventory'>
                <div className="contract-section-box">
                    <fieldset>
                        <legend>Equipamiento</legend>
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
                              className="remove-item" onClick={() => handleRemoveEquipment(equipment.equipment_id)}
                            >
                                 Eliminar
                            </button>
                                </td>
                            </tr>
                            ))}
                            </tbody>
                    </table>
                    </fieldset>
                    <button className="add-iventory-item" onClick={openModal}>
                        Asignar Equipamiento
                    </button>
                </div>
            </div>
            <div className='personal'>
                <div className="contract-section-box">
                    <fieldset>
                        <legend>Personal</legend>
                    <table className="assigned-equipment-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Rol</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                                {contractPersonal.map((person) => (
                                    <tr key={person.staff_id}>
                                        <td>{person.name}</td>
                                        <td>{person.role}</td>
                                        <td>
                                            <button
                                                className="remove-item"
                                                onClick={() => handleRemovePersonal(person.staff_id)}
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                    </fieldset>
                    <button className="add-iventory-item" onClick={openPersonalModal}>
                        Asignar Personal
                    </button>
                    {isPersonalModalOpen && (
                        <PersonalModal
                            availablePersonal={availablePersonal}
                            onClose={() => setIsPersonalModalOpen(false)}
                            onAssign={handleAssignPersonnel}
                        />
                    )}
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
                    equipment_id: equipment.equipment_id,
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