'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { db } from '@/lib/supabase';
import { Commande } from '@/lib/types';
import { Search, Package, Clock, CheckCircle, MessageCircle, AlertCircle, MapPin, CreditCard } from 'lucide-react';

export default function SuiviCommandes() {
  const [code, setCode] = useState('');
  const [commande, setCommande] = useState<Commande | null>(null);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  const rechercherCommande = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setChargement(true);
    setErreur(null);
    setCommande(null);

    const codeFormate = code.trim().toUpperCase();

    const { data, error } = await db
      .from('commandes')
      .select('*')
      .eq('code_commande', codeFormate)
      .single();

    setChargement(false);

    if (error || !data) {
      setErreur(`Aucune commande trouvée avec le code "${codeFormate}".`);
    } else {
      setCommande(data);
    }
  };

  // WhatsApp Vendeur (Message prérempli pour le suivi)
  const msgWa = commande ? encodeURIComponent(`Bonjour ! Je souhaite avoir des nouvelles de ma commande ${commande.code_commande} (${commande.titre_produit}) sur WiseMarket.`) : '';
  const lienWa = `https://wa.me/22872119966?text=${msgWa}`;

  return (
    <div className="min-h-screen bg-[#090D16] text-white flex flex-col justify-between">
      <Header />

      <main className="max-w-xl mx-auto px-4 py-8 w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-xl font-black text-white">Suivi de vos commandes</h1>
          <p className="text-xs text-slate-400">Entrez votre code de commande (ex: WM-1048) pour vérifier son statut en direct.</p>
        </div>

        {/* FORMULAIRE DE RECHERCHE */}
        <form onSubmit={rechercherCommande} className="bg-[#0F172A] border border-slate-800 p-2 rounded-2xl flex items-center gap-2 shadow-xl">
          <div className="flex items-center gap-2 px-3 flex-1">
            <Search className="w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              value={code} 
              onChange={(e) => setCode(e.target.value)} 
              placeholder="Ex: WM-1048" 
              className="bg-transparent text-xs text-white uppercase placeholder-slate-500 focus:outline-none w-full"
            />
          </div>
          <button 
            type="submit" 
            disabled={chargement}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-md shadow-emerald-500/20"
          >
            {chargement ? 'Recherche...' : 'Rechercher'}
          </button>
        </form>

        {/* AFFICHAGE DES ERREURS */}
        {erreur && (
          <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-2xl flex items-center gap-2 text-xs text-rose-400">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{erreur}</span>
          </div>
        )}

        {/* FICHE DÉTAILLÉE DE LA COMMANDE */}
        {commande && (
          <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl relative overflow-hidden">
            {/* EN-TÊTE : CODE & STATUT */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Numéro de commande</span>
                <h2 className="text-lg font-black text-emerald-400">{commande.code_commande}</h2>
              </div>

              {/* BADGE DE STATUT */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border bg-amber-500/10 text-amber-400 border-amber-500/30">
                {commande.statut === 'LIVREE' ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Livrée</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>En attente de livraison</span>
                  </>
                )}
              </div>
            </div>

            {/* DÉTAILS PRODUIT & VENDEUR */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center bg-[#090D16] p-3 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-violet-400" />
                  <div>
                    <h4 className="font-bold text-white">{commande.titre_produit}</h4>
                    <span className="text-slate-500">Boutique: {commande.nom_boutique}</span>
                  </div>
                </div>
                <span className="font-black text-emerald-400">{commande.prix.toLocaleString('fr-FR')} FCFA</span>
              </div>

              {/* LIVRAISON & CLIENT */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-2">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span className="truncate">{commande.adresse_livraison}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-slate-500" />
                  <span>{commande.moyen_paiement}</span>
                </div>
              </div>
            </div>

            {/* ACTION WHATSAPP */}
            <div className="pt-2 border-t border-slate-800">
              <a 
                href={lienWa}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Contacter le vendeur sur WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
          }
              
