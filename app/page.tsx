'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ProductCard from '@/components/ProductCard';
import StoreCard from '@/components/StoreCard';
import CartDrawer from '@/components/CartDrawer';
import OrderModal from '@/components/OrderModal';
import { db } from '@/lib/supabase';
import { Produit, Vendeur } from '@/lib/types';
import { CheckCircle, AlertCircle, ShoppingBag } from 'lucide-react';

export default function Home() {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [vendeurs, setVendeurs] = useState<Vendeur[]>([]);
  const [chargement, setChargement] = useState(true);

  // État du Panier
  const [panier, setPanier] = useState<{ produit: Produit; quantite: number }[]>([]);
  const [panierOuvert, setPanierOuvert] = useState(false);

  // État de la Modal de Commande
  const [produitACommander, setProduitACommander] = useState<Produit | null>(null);
  const [codeCommandeReussie, setCodeCommandeReussie] = useState<string | null>(null);

  // Charger les données réelles Supabase
  useEffect(() => {
    async function fetchData() {
      setChargement(true);
      
      const { data: produitsData } = await db.from('produits').select('*').limit(8);
      const { data: vendeursData } = await db.from('vendeurs').select('*').limit(4);

      if (produitsData) setProduits(produitsData);
      if (vendeursData) setVendeurs(vendeursData);
      setChargement(false);
    }

    fetchData();
  }, []);

  // Gestion du Panier
  const ajouterAuPanier = (produit: Produit) => {
    setPanier((prev) => {
      const existe = prev.find((item) => item.produit.id === produit.id);
      if (existe) {
        return prev.map((item) =>
          item.produit.id === produit.id ? { ...item, quantite: item.quantite + 1 } : item
        );
      }
      return [...prev, { produit, quantite: 1 }];
    });
    setPanierOuvert(true);
  };

  const updateQuantitePanier = (id: string, delta: number) => {
    setPanier((prev) =>
      prev
        .map((item) => (item.produit.id === id ? { ...item, quantite: item.quantite + delta } : item))
        .filter((item) => item.quantite > 0)
    );
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-white flex flex-col justify-between">
      {/* HEADER */}
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-10 w-full">
        {/* HERO BANNER */}
        <HeroSection />

        {/* NOTIFICATION COMMANDE CONFIRMÉE */}
        {codeCommandeReussie && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl flex items-center justify-between text-xs text-emerald-400">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span>Commande <strong>#{codeCommandeReussie}</strong> enregistrée avec succès !</span>
            </div>
            <button onClick={() => setCodeCommandeReussie(null)} className="underline text-slate-300">
              Fermer
            </button>
          </div>
        )}

        {/* SECTION BOUTIQUES À DÉCOUVRIR */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white tracking-wide">Boutiques à découvrir</h2>
            <span className="text-xs text-violet-400 font-semibold cursor-pointer hover:underline">Voir tout →</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {vendeurs.length > 0 ? (
              vendeurs.map((v) => <StoreCard key={v.nom_boutique} vendeur={v} />)
            ) : (
              <p className="text-xs text-slate-500 col-span-full">Aucune boutique disponible pour le moment.</p>
            )}
          </div>
        </section>

        {/* SECTION PRODUITS RÉCENTS */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white tracking-wide">Produits près de chez vous</h2>
            <span className="text-xs text-violet-400 font-semibold cursor-pointer hover:underline">Tout explorer →</span>
          </div>

          {chargement ? (
            <div className="text-center py-10 text-xs text-slate-500">Chargement des articles...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {produits.map((p) => (
                <ProductCard 
                  key={p.id} 
                  produit={p} 
                  onCommander={(produit) => setProduitACommander(produit)} 
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* BOUTON FLOTTANT PANIER (SUR MOBILE) */}
      {panier.length > 0 && (
        <button
          onClick={() => setPanierOuvert(true)}
          className="fixed bottom-6 right-6 z-30 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold p-4 rounded-full shadow-2xl flex items-center gap-2 border border-emerald-300"
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-xs bg-slate-950 text-emerald-400 px-2 py-0.5 rounded-full font-black">
            {panier.reduce((acc, i) => acc + i.quantite, 0)}
          </span>
        </button>
      )}

      {/* DRAWER PANIER & MODAL COMMANDE */}
      <CartDrawer 
        ouvert={panierOuvert} 
        onFermer={() => setPanierOuvert(false)} 
        articles={panier} 
        onUpdateQuantite={updateQuantitePanier} 
        onCommander={() => {
          setPanierOuvert(false);
          if (panier.length > 0) setProduitACommander(panier[0].produit);
        }} 
      />

      {produitACommander && (
        <OrderModal 
          produit={produitACommander} 
          ouvert={!!produitACommander} 
          onFermer={() => setProduitACommander(null)} 
          onSuccess={(code) => {
            setProduitACommander(null);
            setCodeCommandeReussie(code);
            setPanier([]);
          }} 
        />
      )}
    </div>
  );
    }
              
