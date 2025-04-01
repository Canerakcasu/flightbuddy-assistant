
import React from 'react';
import { FlightData } from '../types/flight';

interface FlightDetailsProps {
  flight: FlightData | null;
}

const FlightDetails: React.FC<FlightDetailsProps> = ({ flight }) => {
  if (!flight) return null;

  return (
    <div className="flight-status-card">
      <div className="flight-header">
        <h2 className="text-xl font-bold">{flight.number}</h2>
        <span className="status-badge">{flight.status}</span>
      </div>
      
      <div className="flight-info-grid">
        <div className="flight-info-item">
          <i className="fas">🛫</i>
          <div>
            <h3 className="text-sm font-medium text-slate-400">Kalkış</h3>
            <p className="text-lg">{flight.departure.airport} • {flight.departure.time}</p>
          </div>
        </div>
        
        <div className="flight-info-item">
          <i className="fas">🛬</i>
          <div>
            <h3 className="text-sm font-medium text-slate-400">Varış</h3>
            <p className="text-lg">{flight.arrival.airport} • {flight.arrival.time}</p>
          </div>
        </div>
      </div>

      <div className="flight-progress">
        <div className="progress-header">
          <span>Uçuş İlerlemesi</span>
          <span>%{flight.progress}</span>
        </div>
        <progress className="w-full h-2 bg-slate-700 rounded" value={flight.progress} max="100"></progress>
        <div className="text-sm text-slate-400 mt-2">{flight.remaining}</div>
      </div>
    </div>
  );
};

export default FlightDetails;
