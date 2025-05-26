
import React from 'react';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-blue-600 to-red-500 bg-clip-text text-transparent">
          Eu No Evento
        </h1>
      </div>
    </header>
  );
};

export default Header;
