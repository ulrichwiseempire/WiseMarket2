'use client';

import Image from 'next/image';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { Produit } from '@/lib/types';

interface CartItem {
  produit: Produit;
  quantite: number;
}

interface CartDrawerProps {
  ouvert: boolean;
  onFermer: () => void;
  articles: CartItem[];
  onUpdateQuantite: (id: string, delta: number) => void;
  onCommander: () => void;
}

export default function CartDrawer({ ouvert, onFermer, articles, onUpdateQuantite, onCommander }: CartDrawerProps) {
  if (!ouvert) return null;

  const sousTotal = articles.reduce((acc, item) => acc + (item.produit.prix * item.quantite), 0);
  const fraisLivraison = articles.length > 0 ? 2000 : 0;
  const total = sousTotal + fraisLivraison;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
      <div className="bg-[#0F172A] w-full max-w-md h-full flex flex-col justify-between border-l border-slate-800 p-6 shadow-2xl">
        
        {/* EN-TÊTE */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base font-bold text-white">Mon panier</h2>
              <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2 py-0.5 rounded-full">
                {articles.reduce((acc, item) => acc + item.quantite, 0)}
              </span>
            </div>
            <button onClick={onFermer} className="p-1 text-slate-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* LISTE ARTICLES */}
          <div className="py-4 space-y-4 max-h-[50vh] overflow-y-auto">
            {articles.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-8">Votre panier est vide.</p>
            ) : (
              articles.map(({ produit, quantite }) => (
                <div key={produit.id} className="flex items-center justify-between bg-[#090D16] p-3 rounded-2xl border border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0">
                      <Image src={produit.image_url || '/placeholder.png'} alt={produit.titre} fill className="object-cover" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white line-clamp-1">{produit.titre}</h4>
                      <p className="text-xs text-emerald-400 font-semibold">{produit.prix.toLocaleString('fr-FR')} FCFA</p>
                    </div>
                  </div>

                  {/* CONTROLES QUANTITÉ */}
                  <div className="flex items-center gap-2 bg-slate-800/80 px-2 py-1 rounded-xl border border-slate-700">
                    <button onClick={() => onUpdateQuantite(produit.id, -1)} className="text-slate-400 hover:text-white">
                      {quantite === 1 ? <Trash2 className="w-3.5 h-3.5 text-rose-400" /> : <Minus className="w-3.5 h-3.5" />}
                    </button>
                    <span className="text-xs font-bold text-white px-1">{quantite}</span>
                    <button onClick={() => onUpdateQuantite(produit.id, 1)} className="text-slate-400 hover:text-white">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RECAPITULATIF & BOUTON */}
        {articles.length > 0 && (
          <div className="border-t border-slate-800 pt-4 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Sous-total</span>
                <span>{sousTotal.toLocaleString('fr-FR')} FCFA</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Livraison</span>
                <span>{fraisLivraison.toLocaleString('fr-FR')} FCFA</span>
              </div>
              <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-slate-800">
                <span>Total</span>
                <span className="text-emerald-400">{total.toLocaleString('fr-FR')} FCFA</span>
              </div>
            </div>

            <button 
              onClick={onCommander}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold py-3.5 rounded-2xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              <span>Passer la commande</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
                                    }
