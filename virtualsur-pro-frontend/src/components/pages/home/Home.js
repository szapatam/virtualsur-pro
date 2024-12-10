// src/pages/home/Home.js
import React from 'react';
import './Home.css';
import ContractCalendar from '../../calendar/CustomCalendar';
import InventoryLevels from '../../InventoryLevels/InventoryLevels';

function Home() {

    return (
        <div className="home-container">
            <header className="welcome-header">
                <h1>Bienvenido a VisualSur Pro</h1>
            </header>
            <div className="main-section">
                <div className="calendar-section">
                    <ContractCalendar />
                </div>
                <div className="yellow-section">
                <InventoryLevels />
                </div>
            </div>
        </div>
    );
}

export default Home;