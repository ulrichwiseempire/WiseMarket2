'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, MessageCircle, Store } from 'lucide-react';
import { Produit } from '@/lib/types';

interface ProductCardProps {
  produit: Produit;
  whatsappVendeur?: string;
  onCommander: (produit: Produit) => void;
}

export default function ProductCard({ produit, whatsappVendeur = '22872119966', onCommander }: ProductCardProps) {
  const prixFormate = produit.prix ? `${produit.prix.toLocaleString('fr-FR')} FCFA` : 'Sur devis';
  
  // Message WhatsApp prérempli
  const msgWa = encodeURIComponent(`Bonjour ! Je suis intéressé par votre article "${produit.titre}" (${prixFormate}) vu sur WiseMarket.`);
  const lienWa = `https://wa.me/${whatsappVendeur.replace(/[^0-9]/g, '')}?text=${msgWa}`;

  return (
    <div className="bg-[#0F172A] border border-slate-800 rounded-3xl overflow-hidden flex flex-col justify-between hover:border-slate-700 transition shadow-lg relative group">
      <div>
        {/* IMAGE PRODUIT */}
        <div className="relative bg-black/30 h-52 w-full">
          <Image
            src={produit.image_url || '/placeholder.png'}
            alt={produit.titre}
            fill
            className="object-cover cursor-pointer"
          />
          {produit.categorie && (
            <span className="absolute top-3 left-3 bg-violet-600/90 text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              {produit.categorie}
            </span>
          )}
        </div>

        {/* DETAILS */}
        <div className="p-4 space-y-2">
          <Link 
            href={`/boutique/${encodeURIComponent(produit.nom_boutique)}`} 
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-400 hover:text-violet-300 transition"
          >
            <Store className="w-3.5 h-3.5" />
            <span>{produit.nom_boutique}</span>
          </Link>

          <h3 className="text-sm font-bold text-white line-clamp-1">{produit.titre}</h3>
          <p className="text-xs text-slate-400 line-clamp-2">{produit.description || 'Aucune description disponible.'}</p>
          
          <div className="pt-2">
            <span className="text-base font-black text-emerald-400">{prixFormate}</span>
          </div>
        </div>
      </div>

      {/* BOUTONS D'ACTION (DOUBLE OPTION) */}
      <div className="p-4 pt-0 grid grid-cols-2 gap-2">
        <button 
          onClick={() => onCommander(produit)}
          className="bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-500/30 text-emerald-300 hover:text-white text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Commander</span>
        </button>

        <a 
          href={lienWa} 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-violet-600/20 hover:bg-violet-600 border border-violet-500/30 text-violet-300 hover:text-white text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Discuter</span>
        </a>
      </div>
    </div>
  );
}
