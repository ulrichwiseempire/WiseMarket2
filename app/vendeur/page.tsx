'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { db } from '@/lib/supabase';
import { Commande } from '@/lib/types';
import { Package, Clock, CheckCircle, MapPin, Phone, User, Store } from 'lucide-react';

export default function EspaceVendeur() {
  const [nomBoutique, setNomBoutique] = useState('TechZone');
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [chargement, setChargement] = useState(true);

  const chargerCommandes = async () => {
    setChargement(true);
    const { data } = await db
      .from('commandes')
      .select('*')
      .eq('nom_boutique', nomBoutique)
      .order('id', { ascending: false });

    if (data) setCommandes(data);
    setChargement(false);
  };

  useEffect(() => {
    chargerCommandes();
  }, [nomBoutique]);

  // Changer le statut d'une commande
  const changerStatut = async (id: string, nouveauStatut: string) => {
    const { error } = await db
      .from('commandes')
      .update({ statut: nouveauStatut })
      .eq('id', id);

    if (!error) {
      chargerCommandes();
    }
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-white flex flex-col justify-between">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8 w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0F172A] border border-slate-800 p-6 rounded-3xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Store className="w-5 h-5 text-violet-400" />
              <h1 className="text-lg font-black text-white">Espace Vendeur</h1>
            </div>
            <p className="text-xs text-slate-400">Gérez les commandes reçues pour votre boutique.</p>
          </div>

          {/* SÉLECTEUR DE BOUTIQUE (TEST) */}
          <div className="flex items-center gap-2 bg-[#090D16] border border-slate-800 px-3 py-2 rounded-xl text-xs">
            <span className="text-slate-500">Boutique:</span>
            <input 
              type="text" 
              value={nomBoutique} 
              onChange={(e) => setNomBoutique(e.target.value)} 
              className="bg-transparent text-emerald-400 font-bold focus:outline-none"
            />
          </div>
        </div>

        {/* LISTE DES COMMANDES REÇUES */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-300">Commandes reçues ({commandes.length})</h2>

          {chargement ? (
            <div className="text-center py-12 text-xs text-slate-500">Chargement des commandes...</div>
          ) : commandes.length === 0 ? (
            <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-8 text-center text-xs text-slate-500">
              Aucune commande enregistrée pour "{nomBoutique}".
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {commandes.map((cmd) => (
                <div key={cmd.id} className="bg-[#0F172A] border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="text-xs font-black text-emerald-400">{cmd.code_commande}</span>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                      cmd.statut === 'LIVREE' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}>
                      {cmd.statut === 'LIVREE' ? 'Livrée' : 'En préparation'}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-white font-bold">
                      <Package className="w-4 h-4 text-violet-400" />
                      <span>{cmd.titre_produit}</span>
                    </div>

                    <div className="space-y-1 text-slate-400 text-[11px] pt-1">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-slate-500" />
                        <span>Client : {cmd.nom_client}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-500" />
                        <span>Tél : {cmd.telephone_client}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        <span>Adresse : {cmd.adresse_livraison}</span>
                      </div>
                    </div>
                  </div>

                  {/* ACTION MARQUER COMME LIVRÉ */}
                  {cmd.statut !== 'LIVREE' && (
                    <button 
                      onClick={() => cmd.id && changerStatut(cmd.id, 'LIVREE')}
                      className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Marquer comme livré</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
                        }
