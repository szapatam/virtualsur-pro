// src/pages/NewDocs/NewDocs.js
import React, { useEffect, useState } from 'react';
import './NewDocs.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

function NewDocs() {

    const [contracts] = useState([
        { id: 'C001', name: 'Contrato A', detail: 'Detalles del contrato A' },
        { id: 'C002', name: 'Contrato B', detail: 'Detalles del contrato B' },
        { id: 'C003', name: 'Contrato C', detail: 'Detalles del contrato C' },
        { id: 'C004', name: 'Contrato D', detail: 'Detalles del contrato D' }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [filteredContracts, setFilteredContracts] = useState(contracts);

    useEffect(() => {
        const filtered = contracts.filter(contract =>
            contract.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contract.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredContracts(filtered);
    }, [searchTerm, contracts]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="new-docs-container">
            <div className="new-docs-header">
                <h1>Generar Docs</h1>
            </div>

            <div className="new-docs-search">
                <label htmlFor="contractSearch">Buscar Contrato:</label>
                <div className="search-input-container">
                    <input type="text" id="contractSearch" placeholder="Código del contrato" value={searchTerm} onChange={handleSearchChange} />
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
                        {filteredContracts.length > 0 ? (
                            filteredContracts.map(contract => (
                                <tr key={contract.id}>
                                    <td>{contract.id}</td>
                                    <td>{contract.name}</td>
                                    <td>{contract.detail}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3">No se encontraron contratos</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="new-docs-buttons">
                <button className="docs-button">Ver Contrato</button>
                <button className="docs-button">Generar Cotización</button>
                <button className="docs-button">Generar Guía DE/RE</button>
            </div>
        </div>
    );
}

export default NewDocs;
