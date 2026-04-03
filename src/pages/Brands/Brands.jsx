import "./Brands.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { CATEGORIES } from "../../constants/categories";
// on importe la liste d'urls d'API pour chaque catégorie depuis categories.js
// categories est dans un dosssier appelé constants (=const) car son contenu n'est pas amené à changer, configuration statique

/**
 * ÉTAPE 1: Nettoyer les marques
 * L'API retourne les marques en format différent (string, array, ou vide)
 * Cette fonction standardise toujours un array de strings propres
 */
const uniformBrands = (value) =>
  (Array.isArray(value) ? value : String(value ?? "").split(","))
    .map((brand) => brand.trim())
    .filter(Boolean);

/**
 * ÉTAPE 2: Grouper par première lettre
 * Prend une liste triée de marques et les organise par lettre (A, B, C... #)
 * Utilisé avant l'affichage final pour structurer la page
 */
const groupBrandsByLetter = (brands) =>
  brands.reduce((grouped, brand) => {
    const key = /[A-Z]/.test(brand[0].toUpperCase())
      ? brand[0].toUpperCase()
      : "#";
    (grouped[key] ??= []).push(brand);
    return grouped;
  }, {});

/**
 * COMPOSANT PRINCIPAL: Brands
 *
 * FLUX GÉNÉRAL:
 * 1. Au chargement: récupérer les marques de TOUTES les catégories
 * 2. Fusionner et dédupliquer les marques
 * 3. Afficher "Chargement..." jusqu'à ce que les données arrivent
 * 4. Grouper les marques par lettre et afficher
 */
const Brands = () => {
  // État 1: Stocke toutes les marques récupérées
  const [data, setData] = useState([]);
  // État 2: Indique si on est en train de charger
  const [isLoading, setIsLoading] = useState(true);

  /**
   * ÉTAPE 3: Récupérer les marques au démarrage
   *
   * PROCESSUS:
   * - Promise.all = Attendre que TOUTES les catégories répondent
   * - Pour chaque catégorie: appeler l'API et extraire les marques
   * - Fusionner toutes les marques dans un array unique
   * - Éliminer les doublons avec Set
   * - Trier alphabétiquement
   */
  useEffect(() => {
    Promise.all(
      CATEGORIES.map((category) =>
        fetch(category.url)
          .then((response) => response.json())
          // Extraire les marques brutes de chaque catégorie
          .then(({ products = [] }) =>
            products.flatMap((product) => uniformBrands(product.brands)),
          ),
      ),
    ).then((responses) => {
      // Fusionner tous les arrays et éliminer les doublons
      const allUnique = [...new Set(responses.flat())].sort();
      setData(allUnique);
      setIsLoading(false);
    });
  }, []);

  /**
   * ÉTAPE 4: Affichage conditionnel
   * Si on charge -> Montrer "Chargement..."
   * Sinon -> Afficher les marques groupées par lettre
   */
  if (isLoading) {
    return (
      <section className="brands-page">
        <p>Loading</p>
      </section>
    );
  }

  // Grouper les marques par première lettre (A, B, C... #)
  const groupedBrands = groupBrandsByLetter(data);

  return (
    <section className="brands-page">
      {/* Titre de la page */}
      <div className="brands-page__hero">
        <h1 className="brands-page__title">Brands</h1>
      </div>
      {/* Compteur de marques uniques */}
      <p className="brands-page__count">{data.length} marques uniques</p>

      {/* 
        ÉTAPE 5: Afficher les marques groupées
        - Pour chaque lettre (A, B, C... #)
        - Afficher un articles avec le badge de la lettre
        - Afficher toutes les marques de ce groupe en liste
      */}
      <div className="brands-groups">
        {Object.keys(groupedBrands)
          .sort()
          .map((letter) => (
            <article key={letter} className="brands-group">
              <div className="brands-group__letter">{letter}</div>
              <ul className="brands-group__list">
                {groupedBrands[letter].map((brand) => (
                  <li key={brand} className="brands-group__item">
                    <Link
                      to={`/marques/${encodeURIComponent(brand)}`}
                      style={{ color: "#513c2d" }}
                    >
                      {brand}
                    </Link>
                  </li>
                ))}
              </ul>
            </article>
          ))}
      </div>
    </section>
  );
};

export default Brands;
