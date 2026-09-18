'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { db } from '@/lib/supabase';
import { Vendeur, Produit } from '@/lib/types';
import { Store, Package, ShoppingBag, CheckCircle, XCircle, TrendingUp, ShieldCheck } from 'lucide-react';

export default function SuperAdmin() {
  const [boutiques, setBoutiques] = useState<Vendeur[]>([]);
  const [totalProduits, setTotalProduits] = useState(0);
  const [totalCommandes, setTotalCommandes] = useState(0);
  const [produitsTops, setProduitsTops] = useState<Produit[]>([]);
  const [chargement, setChargement] = useState(true);

  const chargerAdminData = async () => {
    setChargement(true);

    // 1. Charger toutes les boutiques
    const { data: bData } = await db.from('vendeurs').select('*');
    if (bData) setBoutiques(bData);

    // 2. Nombre total d'articles et aperçu
    const { count: pCount, data: pData } = await db.from('produits').select('*', { count: 'exact' });
    if (pCount !== null) setTotalProduits(pCount);
    if (pData) setProduitsTops(pData.slice(0, 5));

    // 3. Nombre total de commandes
    const { count: cCount } = await db.from('commandes').select('*', { count: 'exact' });
    if (cCount !== null) setTotalCommandes(cCount);

    setChargement(false);
  };

  useEffect(() => {
    chargerAdminData();
  }, []);

  // Action pour Valider ou Refuser une boutique
  const changerStatutBoutique = async (nomBoutique: string, nouveauStatut: 'APPROUVE' | 'REJETTE') => {
    const { error } = await db
      .from('vendeurs')
      .update({ statut: nouveauStatut })
      .eq('nom_boutique', nomBoutique);

    if (!error) {
      chargerAdminData();
    }
  };

  const boutiquesEnAttente = boutiques.filter((b: any) => b.statut === 'EN_ATTENTE' || !b.statut);
  const boutiquesValidees = boutiques.filter((b: any) => b.statut === 'APPROUVE');

  return (
    <div className="min-h-screen bg-[#090D16] text-white flex flex-col justify-between">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8 w-full space-y-8">
        
        {/* EN-TÊTE ADMIN PROPRE */}
        <div className="flex items-center gap-3 bg-[#0F172A] border border-slate-800 p-6 rounded-3xl">
          <div className="p-3 bg-violet-600/20 border border-violet-500/30 rounded-2xl text-violet-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">Panneau de Contrôle Admin</h1>
            <p className="text-xs text-slate-400">Espace de modération et gestion globale de WiseMarket Togo</p>
          </div>
        </div>

        {/* STATISTIQUES GLOBALES */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#0F172A] border border-slate-800 p-5 rounded-3xl space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Boutiques inscrites</span>
              <Store className="w-4 h-4 text-violet-400" />
            </div>
            <p className="text-2xl font-black text-white">{boutiques.length}</p>
            <p className="text-[10px] text-emerald-400 font-semibold">{boutiquesValidees.length} valides • {boutiquesEnAttente.length} en attente</p>
          </div>

          <div className="bg-[#0F172A] border border-slate-800 p-5 rounded-3xl space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Total Articles en ligne</span>
              <Package className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-black text-white">{totalProduits}</p>
            <p className="text-[10px] text-slate-500">Mise à jour automatique</p>
          </div>

          <div className="bg-[#0F172A] border border-slate-800 p-5 rounded-3xl space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Total Commandes</span>
              <ShoppingBag className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-black text-white">{totalCommandes}</p>
            <p className="text-[10px] text-emerald-400 font-semibold">Générées via la plateforme</p>
          </div>
        </div>

        {/* MODÉRATION DES BOUTIQUES EN ATTENTE */}
        <section className="space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>Inscriptions de boutiques à valider</span>
            <span className="bg-amber-500/20 text-amber-400 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-500/30">
              {boutiquesEnAttente.length}
            </span>
          </h2>

          {chargement ? (
            <div className="text-center py-8 text-xs text-slate-500">Chargement des demandes...</div>
          ) : boutiquesEnAttente.length === 0 ? (
            <div className="bg-[#0F172A] border border-slate-800 p-6 rounded-3xl text-center text-xs text-slate-500">
              Aucune nouvelle boutique en attente de validation.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {boutiquesEnAttente.map((b) => (
                <div key={b.nom_boutique} className="bg-[#0F172A] border border-slate-800 p-5 rounded-3xl flex items-center justify-between gap-4 shadow-xl">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white">{b.nom_boutique}</h3>
                    <p className="text-xs text-slate-400">Ville: {b.ville || 'Non précisé'} • Tél: {b.whatsapp || 'N/A'}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => changerStatutBoutique(b.nom_boutique, 'APPROUVE')}
                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1 shadow-md shadow-emerald-500/20"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Valider</span>
                    </button>

                    <button 
                      onClick={() => changerStatutBoutique(b.nom_boutique, 'REJETTE')}
                      className="bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/30 text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Refuser</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* APERÇU RAPIDE DU CATALOGUE */}
        <section className="space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Articles récemment ajoutés</span>
          </h2>

          <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-4 overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-slate-500 border-b border-slate-800 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Article</th>
                  <th className="p-3">Boutique</th>
                  <th className="p-3">Prix</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {produitsTops.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/30">
                    <td className="p-3 font-bold text-white">{p.titre}</td>
                    <td className="p-3 text-violet-400">{p.nom_boutique}</td>
                    <td className="p-3 font-bold text-emerald-400">{p.prix.toLocaleString('fr-FR')} FCFA</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
                }
