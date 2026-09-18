'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Search, MapPin, Store, Menu, X, Bell } from 'lucide-react';

export default function Header() {
  const [menuOuvert, setMenuOuvert] = useState(false);

  return (
    <header className="border-b border-slate-800 bg-[#0F172A]/90 backdrop-blur-md sticky top-0 z-40 p-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        
        {/* LOGO */}
        <Link href="/" className="text-xl font-black text-white tracking-wider flex items-center gap-1">
          Wise<span className="text-emerald-400">Market</span>
        </Link>

        {/* BARRE DE RECHERCHE & GÉOLOCALISATION */}
        <div className="hidden md:flex items-center bg-[#090D16] border border-slate-800 rounded-xl px-3 py-1.5 flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 mr-2" />
          <input 
            type="text" 
            placeholder="Rechercher un produit, une boutique..." 
            className="bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none w-full"
          />
          <div className="border-l border-slate-800 pl-2 ml-2 flex items-center text-xs text-slate-400 gap-1">
            <MapPin className="w-4 h-4 text-violet-400" />
            <select className="bg-transparent focus:outline-none text-white cursor-pointer">
              <option value="">Toutes les zones</option>
              <option value="Agoè">Agoè</option>
              <option value="Tokoin">Tokoin</option>
              <option value="Adewi">Adéwi</option>
            </select>
          </div>
        </div>

        {/* BOUTONS ACTIONS */}
        <div className="flex items-center gap-3">
          <Link 
            href="/vendeur" 
            className="bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 shadow-lg shadow-violet-600/20"
          >
            <Store className="w-4 h-4" />
            <span className="hidden sm:inline">Devenir vendeur</span>
          </Link>

          <button 
            onClick={() => setMenuOuvert(!menuOuvert)}
            className="w-9 h-9 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center text-slate-300 hover:text-white"
          >
            {menuOuvert ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
}

