import "./Brands.css";
import { useEffect, useMemo, useState } from "react";
import { CATEGORIES } from "../../constants/categories";

/**
 * Fonction utilitaire: Normaliser les marques provenant de l'API
 *
 * PROBLÈME: L'API retourne parfois les marques comme:
 * - Chaîne de caractères: "Marque1, Marque2, Marque3"
 * - Array: ["Marque1", "Marque2"]
 * - Valeur vide: null ou undefined
 *
 * SOLUTION: Cette fonction standardise le format pour toujours retourner un array de strings
 */
const normalizeBrands = (brandsValue) => {
  // Si aucune valeur, retourner un array vide
  if (!brandsValue) {
    return [];
  }

  // Si c'est déjà un array, nettoyer chaque marque (trim + filter)
  if (Array.isArray(brandsValue)) {
    return brandsValue
      .map((brand) => String(brand).trim())
      .filter((brand) => brand.length > 0);
  }

  // Si c'est une string, la diviser par virgules, nettoyer et filtrer
  return String(brandsValue)
    .split(",")
    .map((brand) => brand.trim())
    .filter((brand) => brand.length > 0);
};

const Brands = () => {
  // ========== ÉTATS (State) ==========
  // État de chargement: true au démarrage, false quand les données sont là
  const [loading, setLoading] = useState(true);
  // État d'erreur: stocke les messages si quelque chose échoue
  const [error, setError] = useState("");
  // État principal: toutes les marques fusionnées et triées de toutes les catégories
  const [allBrands, setAllBrands] = useState([]);

  // ========== CALCULS OPTIMISÉS (useMemo) ==========
  /**
   * groupedBrands: Groupe les marques par leur première lettre
   *
   * ÉTAPES:
   * 1. Prendre chaque marque de allBrands
   * 2. Obtenir la première lettre en majuscule (ex: "Dior" → "D")
   * 3. Si c'est une lettre (A-Z), l'utiliser comme clé
   * 4. Sinon (chiffre, caractère spécial), utiliser "#" comme clé
   * 5. Créer un objet: { "A": [...], "B": [...], "#": [...] }
   *
   * RÉSULTAT EXEMPLE:
   * {
   *   "A": ["Aveeno", "Aqua Fresh"],
   *   "D": ["Dior", "Dove"],
   *   "#": ["3M", "77"]
   * }
   *
   * useMemo: Recalcule seulement quand allBrands change (performance)
   */
  const groupedBrands = useMemo(() => {
    return allBrands.reduce((accumulator, brand) => {
      const firstLetter = brand.charAt(0).toUpperCase();
      const groupKey = /[A-Z]/.test(firstLetter) ? firstLetter : "#";

      if (!accumulator[groupKey]) {
        accumulator[groupKey] = [];
      }

      accumulator[groupKey].push(brand);
      return accumulator;
    }, {});
  }, [allBrands]);

  /**
   * sortedLetters: Récupère les clés (lettres) de groupedBrands et les trie
   *
   * ÉTAPES:
   * 1. Object.keys(groupedBrands) → ["D", "A", "#", "Z"]
   * 2. .sort() → Trier alphabétiquement en français ["#", "A", "D", "Z"]
   *
   * UTILITÉ: Afficher les groupes de marques dans l'ordre correct (A, B, C... puis #)
   */
  const sortedLetters = Object.keys(groupedBrands).sort((a, b) =>
    a.localeCompare(b, "fr", { sensitivity: "base" }),
  );

  // ========== RÉCUPÉRATION DES DONNÉES (useEffect) ==========
  /**
   * FINALITÉ:
   * Récupérer les marques de TOUTES les catégories au chargement de la page,
   * les fusionner, éliminer les doublons et les stocker.
   *
   * FLOW:
   * 1. Boucler sur chaque catégorie dans CATEGORIES
   * 2. Appeler l'API de chaque catégorie EN PARALLÈLE (Promise.all)
   * 3. Pour chaque catégorie: récupérer les produits et leurs marques
   * 4. Normaliser les marques et éliminer les doublons
   * 5. Fusionner toutes les marques de toutes les catégories
   * 6. Éliminer les doublons GLOBAUX et trier
   * 7. Stocker le résultat final dans allBrands
   */
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        setError("");

        // ÉTAPE 1: Récupérer les données de TOUTES les catégories en parallèle
        // Promise.all = ATTEND que TOUTES les requêtes soient complètes avant de continuer
        const responses = await Promise.all(
          CATEGORIES.map(async (category) => {
            // Pour chaque catégorie, faire une requête API
            const response = await fetch(category.url);

            // Vérifier que la requête a réussi
            if (!response.ok) {
              throw new Error(
                `Erreur API pour ${category.label} (status ${response.status})`,
              );
            }

            const data = await response.json();
            const products = data.products ?? []; // ?? = utiliser [] si products est undefined

            // ÉTAPE 2: Extraire et nettoyer les marques de cette catégorie
            // flatMap = boucler sur chaque produit ET appliquer normalizeBrands
            // Set = éliminer les doublons DANS cette catégorie
            const uniqueBrands = Array.from(
              new Set(
                products.flatMap((product) => normalizeBrands(product.brands)),
              ),
            ).sort((a, b) => a.localeCompare(b, "fr", { sensitivity: "base" }));

            return {
              brands: uniqueBrands,
            };
          }),
        );

        // ÉTAPE 3: Fusionner les marques de TOUTES les catégories
        // responses = [
        //   { brands: ["Dior", "Guerlain", "Chanel"] },  // de crèmes visage
        //   { brands: ["Lush", "Bioré", "Dior"] },       // de masques
        //   ...
        // ]
        // On extrait toutes les marques et on élimine les doublons GLOBAUX
        const allUniqueBrands = Array.from(
          new Set(responses.flatMap((item) => item.brands)),
        ).sort((a, b) => a.localeCompare(b, "fr", { sensitivity: "base" }));

        // ÉTAPE 4: Stocker le résultat final
        setAllBrands(allUniqueBrands);
      } catch (requestError) {
        // Si erreur, afficher un message à l'utilisateur
        setError(
          requestError.message || "Erreur lors du chargement des marques.",
        );
      } finally {
        // TOUJOURS arrêter le loading (qu'il y ait erreur ou succès)
        setLoading(false);
      }
    };

    // Lancer la récupération au chargement de la page (tableau vide = une seule fois)
    fetchBrands();
  }, []);

  return (
    <section className="brands-page">
      <div className="brands-page__hero">
        <h1 className="brands-page__title">Brands</h1>
      </div>

      {/* ========== AFFICHAGE CONDITIONNEL ========== */}

      {/* Si encore en cours de chargement → afficher un message */}
      {loading && (
        <div className="brands-page__status">
          <p>Chargement des marques...</p>
        </div>
      )}

      {/* Si erreur ET pas en cours de chargement → afficher l'erreur */}
      {error && !loading && (
        <div className="brands-page__status">
          <p>{error}</p>
        </div>
      )}

      {/* Si pas d'erreur ET pas de chargement → afficher les marques groupées */}
      {!loading && !error && (
        <>
          {/* Compteur: afficher le nombre total de marques uniques */}
          <p className="brands-page__count">
            {allBrands.length} marques uniques
          </p>

          {/* Conteneur principal des groupes */}
          <div className="brands-groups">
            {/* Pour chaque lettre triée (A, B, C... # */}
            {sortedLetters.map((letter) => (
              <article key={letter} className="brands-group">
                {/* Afficher le titre de la lettre (ex: "A", "B", "#") */}
                <div className="brands-group__letter">{letter}</div>

                {/* Afficher la liste des marques pour cette lettre */}
                <ul className="brands-group__list">
                  {/* Boucler sur chaque marque du groupe actuel */}
                  {groupedBrands[letter].map((brand) => (
                    <li key={brand} className="brands-group__item">
                      {brand}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
};

// Export du composant pour que l'app puisse l'utiliser dans les routes
export default Brands;
