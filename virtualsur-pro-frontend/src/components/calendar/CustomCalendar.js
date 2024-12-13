import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CustomCalendar.css'
import { useNavigate } from 'react-router-dom';
import api from '../../api';

const ContractCalendar = () => {
  const [events, setEvents] = useState([]);
  const [markedDates, setMarkedDates] = useState([]);
  const [selectedMonthEvents, setSelectedMonthEvents] = useState([]);
  const navigate = useNavigate();

  const fetchEvents = async (month, year) => {
    try {
      const response = await api.get('http://127.0.0.1:5000/contracts/events', {
        params: { month, year },
      });
      let events = response.data;

      //Ordenar contratos
      events = events.sort((a,b) => new Date(a.event_execution_date) - new Date(b.event_execution_date));

      setEvents(events);

      // Resaltar las fechas en el calendario
      const dates = response.data.map(event => {const [year, month, day] = event.event_execution_date.split ('-')
        return new Date(Number(year), Number(month) -1, Number(day), 12);
      });
      setMarkedDates(dates);

      // Configurar los eventos del mes seleccionado para la tabla
      setSelectedMonthEvents(response.data);
    } catch (error) {
      console.error('Error fetching event data:', error);
    }
  };

  useEffect(() => {
    // Cargar eventos del mes actual al cargar el componente
    const today = new Date();
    fetchEvents(today.getMonth() + 1, today.getFullYear());
  }, []);

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const normalizeDate = d => new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const currentDate = normalizeDate(date);
      const today = normalizeDate(new Date());
  
      const isMarked = markedDates.some(markedDate => {
        const normalizedMarkedDate = normalizeDate(markedDate);
        return normalizedMarkedDate.getTime() === currentDate.getTime();
      });
  
      if (isMarked) {
        // Verificar si es un evento pasado
        return currentDate < today ? 'past-event' : 'highlight';
      }
    }
    return null;
  };

  const handleActiveStartDateChange = ({ activeStartDate }) => {
    // Cuando el usuario cambia de mes en el calendario
    const month = activeStartDate.getMonth() + 1;
    const year = activeStartDate.getFullYear();
    fetchEvents(month, year);
  };

  return (
    <div className='calendar-main'>
      <div className='calendar-self'>
        <h2>Calendario de Contratos</h2>
        <Calendar tileClassName={tileClassName} onActiveStartDateChange={handleActiveStartDateChange}  />
      </div>

      <div className='calendar-table-self'>
        <h2>Eventos del Mes</h2>
        {selectedMonthEvents.length > 0 ? (
          <table className="client-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Evento</th>
                <th>Fecha</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {selectedMonthEvents.map(event => (
                <tr key={event.contract_id}>
                  <td>{event.contract_code}</td>
                  <td>{event.event_name}</td>
                  <td>
                  {new Date(
                    new Date(event.event_execution_date).setDate(
                      new Date(event.event_execution_date).getDate() + 1
                    )
                  ).toLocaleDateString()}
                  </td>
                  <td>
                  <button onClick={() => navigate(`/contract/${event.contract_id}`)} className="action-button edit">
                    Ver/Editar
                  </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay eventos para este mes.</p>
        )}
      </div>
    </div>
  );
};

export default ContractCalendar;