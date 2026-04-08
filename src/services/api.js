// async function fetchFromAPI(url) {
//   try {
//     const res = await fetch(url);
//     const data = await res.json();
//     return data.products || [];
//   } catch (error) {
//     console.error("Erreur fetch API:", error);
//     return [];
//   }
// }

// export async function fetchFaceCreams() {
//   const url =
//     "https://world.openbeautyfacts.org/api/v2/search?categories_tags=en:face-creams&fields=code,product_name,ingredients_text,image_url,brands&page_size=50";
//   return await fetchFromAPI(url);
// }

// export async function fetchFaceScrubs() {
//   const url =
//     "https://world.openbeautyfacts.org/api/v2/search?categories_tags_en=face-scrubs&fields=cod[…],ingredients_text,image_front_url,quantity,brands,labels";
//   return await fetchFromAPI(url);
// }

// export async function fetchFaceMasks() {
//   const url =
//     "https://world.openbeautyfacts.org/api/v2/search?categories_tags=en:face-masks&fields=code[…]ients_text,quantity,image_url,brands&json=1&page_size=50";
//   return await fetchFromAPI(url);
// }

// export async function fetchCleansers() {
//   const url =
//     "https://world.openbeautyfacts.org/api/v2/search?categories_tags=en:cleansers&fields=code,product_name,ingredients_text,image_url,brands&page_size=50";
//   return await fetchFromAPI(url);
// }

// export async function fetchSunScreen() {
//   const url =
//     "https://world.openbeautyfacts.org/api/v2/search?categories_tags=en:sunscreens&fields=code[…]duct_name,ingredients_text,image_url,brands&page_size=50";
//   return await fetchFromAPI(url);
// }

// export async function fetchProducts() {
//   const [creams, masks, scrubs, cleansers, sunScreen] = await Promise.all([
//     fetchFaceCreams(),
//     fetchFaceMasks(),
//     fetchFaceScrubs(),
//     fetchCleansers(),
//     fetchSunScreen(),
//   ]);

//   return [...creams, ...masks, ...scrubs, ...cleansers, ...sunScreen];
// }

import { CATEGORIES } from "../constants/categories.js";

/**
 * Fonction générique pour fetch une URL d'API
 * @param {string} url - L'URL de l'API à appeler
 * @returns {Promise<Array>} - Liste des produits
 */
async function fetchFromAPI(url) {
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data.products || [];
  } catch (error) {
    console.error("Erreur fetch API:", error);
    return [];
  }
}

/**
 * Fetch tous les produits de toutes les catégories en parallèle
 * Utilise les URLs définies dans CATEGORIES (source unique de vérité)
 * @returns {Promise<Array>} - Tableau de tous les produits
 */
export async function fetchProducts() {
  // On map sur CATEGORIES et on fetch chaque URL en parallèle
  const productsArrays = await Promise.all(
    CATEGORIES.map((category) => fetchFromAPI(category.url)),
  );

  // On aplatit le tableau de tableaux en un seul tableau
  return productsArrays.flat();
}

/**
 * Fetch les produits d'une catégorie spécifique par son slug
 * @param {string} slug - Le slug de la catégorie (ex: "face-creams")
 * @returns {Promise<Array>} - Liste des produits de cette catégorie
 */
export async function fetchProductsByCategory(slug) {
  const category = CATEGORIES.find((cat) => cat.slug === slug);

  if (!category) {
    console.warn(`Catégorie "${slug}" introuvable`);
    return [];
  }

  return await fetchFromAPI(category.url);
}

/**
 * Fetch plusieurs catégories spécifiques
 * @param {Array<string>} slugs - Tableau de slugs (ex: ["face-creams", "soaps"])
 * @returns {Promise<Array>} - Tous les produits des catégories demandées
 */
export async function fetchProductsBySlugs(slugs) {
  const urls = CATEGORIES.filter((cat) => slugs.includes(cat.slug)).map(
    (cat) => cat.url,
  );

  const productsArrays = await Promise.all(
    urls.map((url) => fetchFromAPI(url)),
  );

  return productsArrays.flat();
}
