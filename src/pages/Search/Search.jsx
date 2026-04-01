import "./Search.css";
import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!query.trim()) return;

    const fetchResults = async () => {
      setIsLoading(true);
      setError("");
      setData([]);

      try {
        const response = await axios.get(
          `https://world.openbeautyfacts.org/api/v2/search?search_terms=${encodeURIComponent(query)}&fields=code,product_name,quantity,image_front_url,brands&json=1&page_size=50`,
        );
        const products = response.data.products ?? [];
        setData(
          products.filter((p) => p.product_name?.trim() && p.image_front_url),
        );
      } catch (err) {
        setError("Erreur lors de la recherche.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <section className="search-page">
      <div className="search-page__hero">
        <h1 className="search-page__title">
          Résultats pour <em>"{query}"</em>
        </h1>
      </div>

      {isLoading && (
        <div className="search-page__status">
          <p>Recherche en cours...</p>
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
                  to={`/produit/${product.code}`}
                  className="search-card"
                  key={product.code}
                >
                  <img
                    className="search-card__img"
                    src={product.image_front_url}
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
