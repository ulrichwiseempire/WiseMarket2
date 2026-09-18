'use client';

import { Headphones } from 'lucide-react';

export default function ButtonServiceClient() {
  // Numéro du Support WhatsApp WiseMarket Togo
  const numeroSupport = "22872119966"; 
  const messageWa = encodeURIComponent("Bonjour Support WiseMarket ! J'ai une question concernant la plateforme.");
  const lienWa = `https://wa.me/${numeroSupport}?text=${messageWa}`;

  return (
    <a
      href={lienWa}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-40 bg-violet-600 hover:bg-violet-500 text-white font-bold p-3.5 rounded-full shadow-2xl flex items-center gap-2 border border-violet-400/30 transition-transform active:scale-95 group"
      title="Contacter le Service Client"
    >
      <Headphones className="w-5 h-5 text-emerald-400" />
      <span className="hidden sm:inline text-xs pr-1">Besoin d'aide ?</span>
    </a>
  );
}
