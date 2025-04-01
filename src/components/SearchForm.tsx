
import React, { useState } from 'react';
import { Search, Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface SearchFormProps {
  onFlightSearch: (flightNumber: string) => Promise<void>;
}

const SearchForm: React.FC<SearchFormProps> = ({ onFlightSearch }) => {
  const [flightNumber, setFlightNumber] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!/^[A-Za-z]{2,3}\d{1,4}$/.test(flightNumber)) {
      toast.error('Geçersiz uçuş formatı! Örnek: TK123');
      return;
    }
    
    setIsSearching(true);
    
    try {
      await onFlightSearch(flightNumber);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };
  
  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="flight-search-form backdrop-blur-lg bg-slate-800/60 border border-slate-700/50 rounded-xl p-6 shadow-lg transition-all hover:shadow-blue-900/20">
        <div className="space-y-2 mb-4">
          <h2 className="text-xl font-semibold text-white">Uçuş Takibi</h2>
          <p className="text-slate-400 text-sm">Uçuş numarası girerek gerçek zamanlı takip bilgilerine ulaşın</p>
        </div>
        
        <div className="search-box relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={flightNumber}
            onChange={(e) => setFlightNumber(e.target.value.toUpperCase())}
            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-3 px-4 pl-10 
              text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 
              focus:border-transparent"
            placeholder="Uçuş numarası girin (Örn: TK123)"
            required
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors"
          disabled={isSearching}
        >
          {isSearching ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
              <span>Aranıyor...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Plane className="h-4 w-4" />
              <span>Uçuşu Takip Et</span>
            </div>
          )}
        </Button>
      </form>
    </div>
  );
};

export default SearchForm;
