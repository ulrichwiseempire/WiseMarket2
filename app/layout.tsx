import './globals.css';
import ButtonServiceClient from '@/components/ButtonServiceClient';

export const metadata = {
  title: 'WiseMarket Togo — Le marché digital',
  description: 'Achetez localement auprès des meilleures boutiques au Togo.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-[#090D16] text-white antialiased">
        {children}
        
        {/* BOUTON FLOTTANT SERVICE CLIENT VISIBLE SUR TOUT LE SITE */}
        <ButtonServiceClient />
      </body>
    </html>
  );
}
