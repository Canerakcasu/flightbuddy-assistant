
import React from 'react';
import { Plane, Clock } from 'lucide-react';
import { FlightData } from '../types/flight';

interface FlightDetailsProps {
  flight: FlightData | null;
}

const FlightDetails: React.FC<FlightDetailsProps> = ({ flight }) => {
  if (!flight) return null;
  
  return (
    <div className="flight-status-card">
      <div className="flight-header">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Plane className="text-blue-500" size={20} />
          {flight.number}
        </h2>
        <span className={`status-badge ${flight.status === 'Gecikti' ? 'bg-amber-600' : flight.status === 'İptal Edildi' ? 'bg-red-600' : 'bg-blue-600'}`}>
          {flight.status}
        </span>
      </div>
      
      <div className="flight-info-grid">
        <div className="flight-info-item">
          <Plane className="transform -rotate-45 text-blue-500 mt-1" size={18} />
          <div>
            <h3 className="text-sm font-medium text-slate-300">Kalkış</h3>
            <p className="text-white font-semibold">{flight.departure.airport}</p>
            <p className="text-sm text-slate-400">{flight.departure.time}</p>
          </div>
        </div>
        
        <div className="flight-info-item">
          <Plane className="transform rotate-45 text-blue-500 mt-1" size={18} />
          <div>
            <h3 className="text-sm font-medium text-slate-300">Varış</h3>
            <p className="text-white font-semibold">{flight.arrival.airport}</p>
            <p className="text-sm text-slate-400">{flight.arrival.time}</p>
          </div>
        </div>
      </div>
      
      <div className="flight-progress">
        <div className="progress-header">
          <span className="flex items-center gap-1">
            <Clock size={14} /> Uçuş İlerlemesi
          </span>
          <span>%{flight.progress}</span>
        </div>
        
        <div className="relative pt-1">
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-slate-700">
            <div 
              style={{ width: `${flight.progress}%` }} 
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-blue-600"
            ></div>
          </div>
        </div>
        
        <div className="flex justify-between text-xs text-slate-400">
          <div>Kalkış: {flight.departure.airport}</div>
          <div>Kalan Süre: {flight.remaining}</div>
          <div>Varış: {flight.arrival.airport}</div>
        </div>
      </div>
    </div>
  );
};

export default FlightDetails;
