import "./Search.css";
import { useState, useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";

const CATEGORIES = [
  { tag: "en:face-creams", path: "/cremes" },
  { tag: "en:face-masks", path: "/masques" },
  { tag: "en:soaps", path: "/savons" },
  { tag: "en:face-scrubs", path: "/exfoliants" },
  { tag: "en:cleansers", path: "/cleansers" },
  { tag: "en:sunscreens", path: "/solaires" },
];

const FIELDS = "code,product_name,quantity,image_front_url,image_url,brands";

async function fetchCategory(tag, path) {
  try {
    const res = await fetch(
      `https://world.openbeautyfacts.org/api/v2/search?categories_tags=${tag}&fields=${FIELDS}&json=1&page_size=100`,
    );
    const data = await res.json();
    return (data.products ?? []).map((p) => ({ ...p, _path: path }));
  } catch {
    return [];
  }
}

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const allProductsRef = useRef(null);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch toutes les catégories une seule fois
  useEffect(() => {
    if (allProductsRef.current) return;

    async function load() {
      setIsLoading(true);
      try {
        const results = await Promise.all(
          CATEGORIES.map((c) => fetchCategory(c.tag, c.path)),
        );
        const seen = new Set();
        allProductsRef.current = results
          .flat()
          .filter((p) => {
            if (!p.code || seen.has(p.code) || !p.product_name?.trim())
              return false;
            if (!p.image_front_url && !p.image_url) return false;
            seen.add(p.code);
            return true;
          })
          .map((p) => ({
            ...p,
            image: p.image_front_url || p.image_url,
          }));
      } catch {
        setError("Erreur lors du chargement des produits.");
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, []);

  // Filtrer par nom ou marque à chaque changement de query
  useEffect(() => {
    if (!allProductsRef.current || !query.trim()) {
      setData([]);
      return;
    }
    const lowerQuery = query.toLowerCase();
    setData(
      allProductsRef.current.filter(
        (p) =>
          p.product_name?.toLowerCase().includes(lowerQuery) ||
          p.brands?.toLowerCase().includes(lowerQuery),
      ),
    );
  }, [query, isLoading]);

  return (
    <section className="search-page">
      <div className="search-page__hero">
        <h1 className="search-page__title">
          Résultats pour <em>"{query}"</em>
        </h1>
      </div>

      {isLoading && (
        <div className="search-page__status">
          <p>Chargement des produits...</p>
        </div>
      )}

      {error && !isLoading && (
        <div className="search-page__status">
          <p>{error}</p>
        </div>
      )}

      {!isLoading && !error && !query.trim() && (
        <div className="search-page__status">
          <p>Entrez un terme de recherche.</p>
        </div>
      )}

      {!isLoading && !error && query.trim() && (
        <>
          <p className="search-page__count">{data.length} produits trouvés</p>
          {data.length === 0 ? (
            <div className="search-page__status">
              <p>Aucun résultat pour "{query}".</p>
            </div>
          ) : (
            <div className="search-grid">
              {data.map((product) => (
                <Link
                  key={product.code}
                  to={`${product._path}/${product.code}`}
                  className="search-card"
                >
                  <img
                    className="search-card__img"
                    src={product.image}
                    alt={product.product_name}
                  />
                  <div className="search-card__body">
                    {product.brands && (
                      <span className="search-card__brand">
                        {product.brands}
                      </span>
                    )}
                    <span className="search-card__name">
                      {product.product_name}
                    </span>
                    {product.quantity && (
                      <span className="search-card__qty">
                        {product.quantity}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default Search;
