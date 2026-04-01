/**
 * Configuration centralisée de toutes les catégories de produits
 *
 * FINALITÉ: Stocker tous les liens API OpenBeautyFacts pour chaque catégorie.
 * Cette constante est réutilisée dans Brands.jsx pour récupérer les marques
 * de chaque catégorie en parallèle.
 *
 * Structure de chaque objet:
 * - label: Nom français affiché à l'utilisateur
 * - slug: Identifiant unique (pour la navigation, les URLs, etc.)
 * - url: Lien d'API OpenBeautyFacts avec les paramètres pour récupérer les produits
 */
export const CATEGORIES = [
  {
    label: "Crème visage",
    slug: "face-creams",
    url: "https://world.openbeautyfacts.org/api/v2/search?categories_tags=en:face-creams&fields=code,product_name,categories_tags,ingredients_text,quantity,image_url,brands&json=1&page_size=50",
  },
  {
    label: "Masque visage",
    slug: "face-masks",
    url: "https://world.openbeautyfacts.org/api/v2/search?categories_tags=en:face-masks&fields=code,product_name,categories_tags,ingredients_text,quantity,image_url,brands&json=1&page_size=50",
  },
  {
    label: "Sérums",
    slug: "face-scrubs",
    url: "https://world.openbeautyfacts.org/api/v2/search?categories_tags=en:face-scrubs&fields=code,product_name,ingredients_text,image_front_url,quantity,brands,labels&json=1&page_size=50",
  },
  {
    label: "Soap",
    slug: "soaps",
    url: "https://world.openbeautyfacts.org/api/v2/search?categories_tags=en:soaps&fields=code,product_name,categories_tags,ingredients_text,quantity,image_url,brands&json=1&page_size=50",
  },
  {
    label: "Cleansers",
    slug: "cleansers",
    url: "https://world.openbeautyfacts.org/api/v2/search?categories_tags=en:cleansers&fields=code,product_name,ingredients_text,image_url,brands&page_size=50",
  },
  {
    label: "Sunscreen",
    slug: "sunscreens",
    url: "https://world.openbeautyfacts.org/api/v2/search?categories_tags=en:sunscreens&fields=code,product_name,ingredients_text,image_url,brands&page_size=50",
  },
];
