export interface Vendeur {
  nom_boutique: string;
  whatsapp?: string;
  ville?: string;
  quartier?: string;
  description?: string;
  logo_url?: string;
}

export interface Produit {
  id: string;
  titre: string;
  description?: string;
  prix: number;
  image_url?: string;
  categorie?: string;
  nom_boutique: string;
  created_at?: string;
}

export interface Commande {
  id?: string;
  code_commande: string;
  nom_client: string;
  telephone_client: string;
  adresse_livraison: string;
  titre_produit: string;
  nom_boutique: string;
  prix: number;
  quantite: number;
  moyen_paiement: string;
  statut: 'EN_ATTENTE_LIVRAISON' | 'EN_PREPARATION' | 'LIVREE' | 'ANNULEE';
}
