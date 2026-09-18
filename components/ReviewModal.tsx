'use client';

import { useState } from 'react';
import { X, Star, CheckCircle, Send } from 'lucide-react';
import { db } from '@/lib/supabase';

interface ReviewModalProps {
  nomBoutique: string;
  codeCommande?: string;
  ouvert: boolean;
  onFermer: () => void;
  onSuccess?: () => void;
}

export default function ReviewModal({ nomBoutique, codeCommande, ouvert, onFermer, onSuccess }: ReviewModalProps) {
  const [note, setNote] = useState(5);
  const [survolNote, setSurvolNote] = useState(0);
  const [nomClient, setNomClient] = useState('');
  const [commentaire, setCommentaire] = useState('');
  const [chargement, setChargement] = useState(false);
  const [envoye, setEnvoye] = useState(false);

  if (!ouvert) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setChargement(true);

    const { error } = await db.from('avis').insert([
      {
        nom_boutique: nomBoutique,
        code_commande: codeCommande || null,
        nom_client: nomClient || 'Client Anonyme',
        note: note,
        commentaire: commentaire,
      }
    ]);

    setChargement(false);

    if (!error) {
      setEnvoye(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onFermer();
      }, 1500);
    } else {
      alert("Une erreur est survenue lors de l'envoi de votre avis.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0F172A] border border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl relative space-y-4">
        
        {/* EN-TÊTE */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white">Évaluer {nomBoutique}</h3>
          <button onClick={onFermer} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {envoye ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
            <h4 className="text-sm font-bold text-white">Merci pour votre avis !</h4>
            <p className="text-xs text-slate-400">Votre évaluation aide la communauté WiseMarket Togo.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* SELECTION ÉTOILES */}
            <div className="space-y-1 text-center">
              <label className="text-slate-400 block">Note globale</label>
              <div className="flex justify-center gap-2 pt-1">
                {[1, 2, 3, 4, 5].map((etoile) => (
                  <button
                    key={etoile}
                    type="button"
                    onClick={() => setNote(etoile)}
                    onMouseEnter={() => setSurvolNote(etoile)}
                    onMouseLeave={() => setSurvolNote(0)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        etoile <= (survolNote || note)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-700'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* NOM CLIENT */}
            <div>
              <label className="text-slate-400 mb-1 block">Votre nom</label>
              <input
                type="text"
                value={nomClient}
                onChange={(e) => setNomClient(e.target.value)}
                placeholder="Ex: Koffi A."
                className="bg-[#090D16] border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none w-full"
              />
            </div>

            {/* COMMENTAIRE */}
            <div>
              <label className="text-slate-400 mb-1 block">Votre avis / commentaire</label>
              <textarea
                required
                rows={3}
                value={commentaire}
                onChange={(e) => setCommentaire(e.target.value)}
                placeholder="Qualité du produit, rapidité de livraison, accueil..."
                className="bg-[#090D16] border border-slate-800 rounded-xl p-3 text-white focus:outline-none w-full resize-none"
              />
            </div>

            {/* BOUTON ENVOI */}
            <button
              disabled={chargement}
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              {chargement ? (
                <span>Envoi en cours...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Publier mon avis</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
                }
