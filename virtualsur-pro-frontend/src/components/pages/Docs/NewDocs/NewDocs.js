// src/pages/NewDocs/NewDocs.js
import React, { useState } from 'react';
import './NewDocs.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function NewDocs() {
    const navigate = useNavigate();
    
    const [contracts] = useState([
        { id: 'C001', name: 'Contrato A', detail: 'Detalles del contrato A' },
        { id: 'C002', name: 'Contrato B', detail: 'Detalles del contrato B' },
        { id: 'C003', name: 'Contrato C', detail: 'Detalles del contrato C' },
        { id: 'C004', name: 'Contrato D', detail: 'Detalles del contrato D' }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [filteredContracts, setFilteredContracts] = useState(contracts);
    const [selectedContract, setSelectedContract] = useState(null);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    
        const filtered = contracts.filter(contract =>
            contract.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
            contract.id.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setFilteredContracts(filtered);
    };

    const handleRowClick = (contract) => {
        if (selectedContract && selectedContract.id === contract.id){
            setSelectedContract(null);
        }else {
        setSelectedContract(contract);
        }
    };

    const handleContainerClick = (e) => {
        if (!e.target.closest('.new-docs-table')) {
          setSelectedContract(null);
        }
      };

    return (
        <div className="new-docs-container" onClick={handleContainerClick}>
            <div className="new-docs-header">
                <h1>Generar Docs</h1>
            </div>

            <div className="new-docs-search">
                <label htmlFor="search">Buscar Contrato:</label>
                <div className="search-input-container">
                    <input type="text" id="search" placeholder="Código del contrato" value={searchTerm} onChange={handleSearchChange} />
                    <FontAwesomeIcon icon={faSearch} className="search-icon" />
                </div>
            </div>

            <div className="new-docs-table">
                <table>
                    <thead>
                        <tr>
                            <th>Encabezado A</th>
                            <th>Encabezado B</th>
                            <th>Encabezado C</th>
                        </tr>
                    </thead>
                    <tbody>
                            {filteredContracts.map(contract => (
                                <tr key={contract.id} onClick={() => handleRowClick(contract)} className={selectedContract && selectedContract.id === contract.id ? 'selected-row' : ''}>
                                    <td>{contract.id}</td>
                                    <td>{contract.name}</td>
                                    <td>{contract.detail}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            <div className="new-docs-buttons">
                <button className="docs-button" disabled={!selectedContract} onClick={() => navigate(`/ContractDetail/${selectedContract ? selectedContract.id : ''}`)}>Ver Contrato</button>
                <button className="docs-button" disabled={!selectedContract}>Generar Cotización</button>
                <button className="docs-button" disabled={!selectedContract}>Generar Guía DE/RE</button>
            </div>
        </div>
    );
}

export default NewDocs;
