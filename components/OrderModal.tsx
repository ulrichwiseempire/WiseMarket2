'use client';

import { useState } from 'react';
import { X, User, Phone, MapPin, CreditCard, CheckCircle } from 'lucide-react';
import { db } from '@/lib/supabase';
import { Produit } from '@/lib/types';

interface OrderModalProps {
  produit: Produit;
  ouvert: boolean;
  onFermer: () => void;
  onSuccess: (codeCommande: string) => void;
}

export default function OrderModal({ produit, ouvert, onFermer, onSuccess }: OrderModalProps) {
  const [nom, setNom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [quartier, setQuartier] = useState('Agoè');
  const [adresse, setAdresse] = useState('');
  const [moyenPaiement, setMoyenPaiement] = useState('LIVRAISON');
  const [chargement, setChargement] = useState(false);

  if (!ouvert) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setChargement(true);

    const codeCommande = `WM-${Math.floor(1000 + Math.random() * 9000)}`;

    const { error } = await db.from('commandes').insert([
      {
        code_commande: codeCommande,
        nom_client: nom,
        telephone_client: telephone,
        adresse_livraison: `${quartier} - ${adresse}`,
        titre_produit: produit.titre,
        nom_boutique: produit.nom_boutique,
        prix: produit.prix,
        quantite: 1,
        moyen_paiement: moyenPaiement,
        statut: 'EN_ATTENTE_LIVRAISON'
      }
    ]);

    setChargement(false);

    if (!error) {
      onSuccess(codeCommande);
    } else {
      alert("Erreur lors de l'enregistrement de la commande.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0F172A] border border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl relative space-y-4">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-base font-bold text-white">Informations de livraison</h3>
          <button onClick={onFermer} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="text-slate-400 mb-1 block">Nom complet</label>
            <div className="flex items-center bg-[#090D16] border border-slate-800 rounded-xl px-3 py-2.5">
              <User className="w-4 h-4 text-slate-500 mr-2" />
              <input required value={nom} onChange={(e) => setNom(e.target.value)} type="text" placeholder="Ex: Ulrich M." className="bg-transparent text-white focus:outline-none w-full" />
            </div>
          </div>

          <div>
            <label className="text-slate-400 mb-1 block">Téléphone</label>
            <div className="flex items-center bg-[#090D16] border border-slate-800 rounded-xl px-3 py-2.5">
              <Phone className="w-4 h-4 text-slate-500 mr-2" />
              <input required value={telephone} onChange={(e) => setTelephone(e.target.value)} type="tel" placeholder="+228 97 81 73 76" className="bg-transparent text-white focus:outline-none w-full" />
            </div>
          </div>

          <div>
            <label className="text-slate-400 mb-1 block">Quartier</label>
            <div className="flex items-center bg-[#090D16] border border-slate-800 rounded-xl px-3 py-2.5">
              <MapPin className="w-4 h-4 text-slate-500 mr-2" />
              <select value={quartier} onChange={(e) => setQuartier(e.target.value)} className="bg-transparent text-white focus:outline-none w-full cursor-pointer">
                <option value="Agoè" className="bg-slate-900">Agoè</option>
                <option value="Tokoin" className="bg-slate-900">Tokoin</option>
                <option value="Adéwi" className="bg-slate-900">Adéwi</option>
                <option value="Bè Kpota" className="bg-slate-900">Bè Kpota</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-slate-400 mb-1 block">Adresse / Indication</label>
            <input required value={adresse} onChange={(e) => setAdresse(e.target.value)} type="text" placeholder="Ex: Près du marché" className="bg-[#090D16] border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none w-full" />
          </div>

          {/* MODE DE PAIEMENT */}
          <div>
            <label className="text-slate-400 mb-2 block">Mode de paiement</label>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setMoyenPaiement('LIVRAISON')} className={`p-2.5 rounded-xl border flex items-center gap-2 ${moyenPaiement === 'LIVRAISON' ? 'border-emerald-500 bg-emerald-500/10 text-white' : 'border-slate-800 text-slate-400'}`}>
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span>Espèces à la livraison</span>
              </button>
              <button type="button" onClick={() => setMoyenPaiement('MOBILE_MONEY')} className={`p-2.5 rounded-xl border flex items-center gap-2 ${moyenPaiement === 'MOBILE_MONEY' ? 'border-emerald-500 bg-emerald-500/10 text-white' : 'border-slate-800 text-slate-400'}`}>
                <CreditCard className="w-4 h-4 text-violet-400" />
                <span>TMoney / Flooz / Wave</span>
              </button>
            </div>
          </div>

          <button disabled={chargement} type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 pt-3">
            {chargement ? <span>Enregistrement...</span> : <><CheckCircle className="w-4 h-4" /><span>Confirmer la commande</span></>}
          </button>
        </form>
      </div>
    </div>
  );
                                                                                                                                                   }
