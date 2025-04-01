
import React, { useState } from 'react';
import { Toaster } from 'sonner';
import SearchForm from '../components/SearchForm';
import FlightDetails from '../components/FlightDetails';
import ChatAssistant from '../components/ChatAssistant';
import { FlightData } from '../types/flight';
import { searchFlight, chatWithAssistant } from '../services/flightApi';
import { toast } from 'sonner';
import { Plane } from 'lucide-react';

const Index: React.FC = () => {
  const [activeFlight, setActiveFlight] = useState<string | null>(null);
  const [flightData, setFlightData] = useState<FlightData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const handleFlightSearch = async (flightNumber: string) => {
    setError(null);
    
    try {
      const data = await searchFlight(flightNumber);
      setFlightData(data);
      setActiveFlight(flightNumber);
      
      // Add to search history if not already there
      if (!searchHistory.includes(flightNumber)) {
        setSearchHistory(prev => [flightNumber, ...prev].slice(0, 10)); // Keep only the last 10 searches
      }
      
      toast.success(`Now tracking flight ${flightNumber}!`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Could not retrieve flight information.';
      setError(errorMessage);
      toast.error(errorMessage);
      setActiveFlight(null);
    }
  };

  const handleSendMessage = async (message: string): Promise<string> => {
    if (!activeFlight) {
      throw new Error('No active flight found');
    }
    
    return await chatWithAssistant(activeFlight, message);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Toaster position="top-center" richColors />
      
      <header className="py-6 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Plane className="text-blue-500" size={32} />
          <h1 className="text-3xl font-bold text-white">SkyTrack Pro</h1>
        </div>
        <p className="text-slate-400">Real-Time Flight Tracking System</p>
      </header>
      
      <main className="container px-4 mx-auto flex-grow pb-24">
        <SearchForm onFlightSearch={handleFlightSearch} />
        
        {error && (
          <div className="error-message bg-red-900/70 text-white p-4 rounded-lg my-4 text-center border border-red-700">
            <p>{error}</p>
          </div>
        )}
        
        <FlightDetails flight={flightData} />
      </main>
      
      <ChatAssistant 
        activeFlight={activeFlight} 
        onSendMessage={handleSendMessage}
        searchHistory={searchHistory}
      />
    </div>
  );
};

export default Index;
