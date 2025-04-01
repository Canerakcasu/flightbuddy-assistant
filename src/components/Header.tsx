
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-6 px-4 text-center">
      <h1 className="text-3xl md:text-4xl font-bold flex items-center justify-center gap-2">
        <span role="img" aria-label="airplane">✈️</span> 
        SkyTrack Pro
      </h1>
      <p className="text-slate-400 mt-2">Gerçek Zamanlı Uçuş Takip Sistemi</p>
    </header>
  );
};

export default Header;
