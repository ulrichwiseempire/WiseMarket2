'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, CheckCircle, ChevronRight, Star } from 'lucide-react';
import { Vendeur } from '@/lib/types';

interface StoreCardProps {
  vendeur: Vendeur;
  estOuvert?: boolean;
}

export default function StoreCard({ vendeur, estOuvert = true }: StoreCardProps) {
  return (
    <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-4 flex flex-col justify-between hover:border-violet-500/50 transition group">
      <div className="space-y-3">
        {/* EN-TÊTE : LOGO + INFOS + BADGE */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 flex-shrink-0">
              <Image 
                src={vendeur.logo_url || '/placeholder-store.png'} 
                alt={vendeur.nom_boutique}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <h3 className="text-sm font-bold text-white group-hover:text-violet-400 transition">
                  {vendeur.nom_boutique}
                </h3>
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                <MapPin className="w-3 h-3 text-slate-500" />
                <span>{vendeur.quartier ? `${vendeur.quartier}, ${vendeur.ville}` : vendeur.ville || 'Togo'}</span>
              </div>
            </div>
          </div>

          {/* STATUT OUVERT/FERMÉ */}
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
            estOuvert 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
              : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
          }`}>
            {estOuvert ? 'Ouvert' : 'Fermé'}
          </span>
        </div>

        {/* DESCRIPTION */}
        <p className="text-xs text-slate-400 line-clamp-2">
          {vendeur.description || 'Boutique vérifiée sur WiseMarket Togo.'}
        </p>
      </div>

      {/* PIED DE CARTE */}
      <div className="pt-4 mt-2 border-t border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold">
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          <span>4.8</span>
          <span className="text-slate-500 font-normal">(120)</span>
        </div>

        <Link 
          href={`/boutique/${encodeURIComponent(vendeur.nom_boutique)}`}
          className="text-xs font-bold text-violet-400 hover:text-white flex items-center gap-1 transition"
        >
          <span>Voir la boutique</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
