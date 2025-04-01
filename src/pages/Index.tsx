
import React, { useState } from 'react';
import { Toaster } from 'sonner';
import Header from '../components/Header';
import SearchForm from '../components/SearchForm';
import FlightDetails from '../components/FlightDetails';
import ChatAssistant from '../components/ChatAssistant';
import { FlightData } from '../types/flight';
import { searchFlight, chatWithAssistant } from '../services/flightApi';
import { toast } from 'sonner';

const Index: React.FC = () => {
  const [activeFlight, setActiveFlight] = useState<string | null>(null);
  const [flightData, setFlightData] = useState<FlightData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFlightSearch = async (flightNumber: string) => {
    setError(null);
    
    try {
      const data = await searchFlight(flightNumber);
      setFlightData(data);
      setActiveFlight(flightNumber);
      toast.success(`${flightNumber} uçuşu takip ediliyor!`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Uçuş bilgisi alınamadı.';
      setError(errorMessage);
      toast.error(errorMessage);
      setActiveFlight(null);
    }
  };

  const handleSendMessage = async (message: string): Promise<string> => {
    if (!activeFlight) {
      throw new Error('Aktif uçuş bulunamadı');
    }
    
    return await chatWithAssistant(activeFlight, message);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster position="top-center" richColors />
      
      <Header />
      
      <main className="container px-4 mx-auto flex-grow pb-24">
        <SearchForm onFlightSearch={handleFlightSearch} />
        
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}
        
        <FlightDetails flight={flightData} />
      </main>
      
      <ChatAssistant 
        activeFlight={activeFlight} 
        onSendMessage={handleSendMessage} 
      />
    </div>
  );
};

export default Index;
