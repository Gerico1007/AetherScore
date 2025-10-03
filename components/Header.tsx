
import React from 'react';
import { Link } from 'react-router-dom';
import { Aperture } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="p-4 sm:p-6 border-b border-portal-border">
      <div className="container mx-auto">
        <Link to="/" className="flex items-center gap-3">
            <Aperture className="text-aureon-green h-8 w-8 animate-spin" style={{ animationDuration: '10s' }} />
            <h1 className="text-2xl font-bold tracking-wider text-gray-100 uppercase">
              Score <span className="text-aureon-green">Portal</span>
            </h1>
        </Link>
      </div>
    </header>
  );
};

export default Header;
