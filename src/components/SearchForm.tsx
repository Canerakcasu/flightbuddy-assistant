
import React, { useState } from 'react';
import { toast } from 'sonner';

interface SearchFormProps {
  onFlightSearch: (flightNumber: string) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ onFlightSearch }) => {
  const [flightNumber, setFlightNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedFlightNumber = flightNumber.trim().toUpperCase();
    
    if (!/^[A-Z]{2,3}\d{1,4}$/.test(trimmedFlightNumber)) {
      toast.error('Geçersiz uçuş formatı! Örnek: TK123');
      return;
    }
    
    onFlightSearch(trimmedFlightNumber);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="flight-search-form">
        <div className="search-box">
          <input
            type="text"
            className="search-input"
            placeholder="Uçuş numarası girin (Örn: TK123)"
            value={flightNumber}
            onChange={(e) => setFlightNumber(e.target.value)}
            required
          />
          <i className="fas fa-search search-icon">🔍</i>
        </div>
        <button type="submit" className="search-btn">
          <i className="fas fa-plane-departure">🛫</i> Uçuşu Takip Et
        </button>
      </form>
    </div>
  );
};

export default SearchForm;
