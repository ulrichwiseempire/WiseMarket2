'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import OrderModal from '@/components/OrderModal';
import { db } from '@/lib/supabase';
import { Produit, Vendeur } from '@/lib/types';
import { ArrowLeft, Star, ShoppingCart, MessageCircle, Store, ShieldCheck, Truck, Plus, Minus } from 'lucide-react';

export default function FicheProduit() {
  const { id } = useParams();
  const router = useRouter();

  const [produit, setProduit] = useState<Produit | null>(null);
  const [vendeur, setVendeur] = useState<Vendeur | null>(null);
  const [quantite, setQuantite] = useState(1);
  const [chargement, setChargement] = useState(true);
  const [modalOuverte, setModalOuverte] = useState(false);

  useEffect(() => {
    async function getProduit() {
      if (!id) return;
      setChargement(true);

      // Récupération du produit
      const { data: prodData } = await db.from('produits').select('*').eq('id', id).single();
      
      if (prodData) {
        setProduit(prodData);
        // Récupération des infos du vendeur associé
        const { data: storeData } = await db.from('vendeurs').select('*').eq('nom_boutique', prodData.nom_boutique).single();
        if (storeData) setVendeur(storeData);
      }

      setChargement(false);
    }

    getProduit();
  }, [id]);

  if (chargement) {
    return (
      <div className="min-h-screen bg-[#090D16] text-white flex flex-col justify-between">
        <Header />
        <div className="text-center py-20 text-xs text-slate-500">Chargement de la fiche produit...</div>
      </div>
    );
  }

  if (!produit) {
    return (
      <div className="min-h-screen bg-[#090D16] text-white flex flex-col justify-between">
        <Header />
        <div className="text-center py-20 text-xs text-slate-500">Article introuvable.</div>
      </div>
    );
  }

  const prixTotal = produit.prix * quantite;
  const prixFormate = `${prixTotal.toLocaleString('fr-FR')} FCFA`;

  // Lien WhatsApp prérempli
  const whatsappNum = vendeur?.whatsapp || '22872119966';
  const msgWa = encodeURIComponent(`Bonjour ! Je souhaite des informations sur l'article "${produit.titre}" (${produit.prix.toLocaleString('fr-FR')} FCFA) disponible sur votre boutique WiseMarket.`);
  const lienWa = `https://wa.me/${whatsappNum.replace(/[^0-9]/g, '')}?text=${msgWa}`;

  return (
    <div className="min-h-screen bg-[#090D16] text-white flex flex-col justify-between">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-6 w-full space-y-6">
        {/* BOUTON RETOUR */}
        <button 
          onClick={() => router.back()} 
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour aux articles</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-[#0F172A] border border-slate-800 p-6 rounded-3xl shadow-2xl">
          {/* IMAGE DU PRODUIT */}
          <div className="space-y-4">
            <div className="relative bg-black/40 w-full h-80 rounded-2xl overflow-hidden border border-slate-800">
              <Image 
                src={produit.image_url || '/placeholder.png'} 
                alt={produit.titre} 
                fill 
                className="object-cover"
              />
              <span className="absolute top-3 right-3 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-3 py-1 rounded-full">
                En stock
              </span>
            </div>
          </div>

          {/* INFORMATIONS PRODUIT */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <Link 
                href={`/boutique/${encodeURIComponent(produit.nom_boutique)}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-400 hover:underline"
              >
                <Store className="w-4 h-4" />
                <span>{produit.nom_boutique}</span>
              </Link>

              <h1 className="text-xl font-black text-white">{produit.titre}</h1>

              {/* PRIX ET AVIS */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-2xl font-black text-emerald-400">{prixFormate}</span>
                <div className="flex items-center gap-1 text-xs text-amber-400 font-bold bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>4.7</span>
                  <span className="text-slate-500 font-normal">(89 avis)</span>
                </div>
              </div>

              {/* SELECTIONS DE QUANTITÉ */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Quantité</span>
                <div className="flex items-center gap-3 bg-[#090D16] border border-slate-800 px-3 py-1.5 rounded-xl">
                  <button 
                    onClick={() => setQuantite(Math.max(1, quantite - 1))}
                    className="text-slate-400 hover:text-white"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-bold text-white px-2">{quantite}</span>
                  <button 
                    onClick={() => setQuantite(quantite + 1)}
                    className="text-slate-400 hover:text-white"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="pt-4 space-y-1">
                <h3 className="text-xs font-bold text-slate-300">Description</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {produit.description || 'Produit de qualité supérieure garanti par le vendeur local sur la plateforme WiseMarket.'}
                </p>
              </div>
            </div>

            {/* GARANTIE / LIVRAISON */}
            <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-800 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-400" />
                <span>Livraison rapide</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-violet-400" />
                <span>Paiement sécurisé</span>
              </div>
            </div>

            {/* BOUTONS D'ACTION */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button 
                onClick={() => setModalOuverte(true)}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Commander</span>
              </button>

              <a 
                href={lienWa}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Discuter</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL DE COMMANDE DIRECTE */}
      {modalOuverte && (
        <OrderModal 
          produit={produit} 
          ouvert={modalOuverte} 
          onFermer={() => setModalOuverte(false)} 
          onSuccess={(code) => {
            setModalOuverte(false);
            router.push(`/?commande=${code}`);
          }} 
        />
      )}
    </div>
  );
          }
