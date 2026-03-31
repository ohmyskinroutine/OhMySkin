import "./Exfoliants.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Exfoliants = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://world.openbeautyfacts.org/api/v2/search?categories_tags=en:face-scrubs&fields=code,product_name,quantity,image_front_url,brands&json=1&page_size=50",
        );
        const products = response.data.products ?? [];
        setData(
          products.filter((p) => p.product_name?.trim() && p.image_front_url),
        );
      } catch (err) {
        setError("Erreur lors du chargement des exfoliants.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="exfoliants-page">
      <div className="exfoliants-page__hero">
        <h1 className="exfoliants-page__title">Exfoliants</h1>
      </div>

      {isLoading && (
        <div className="exfoliants-page__status">
          <p>Chargement des produits...</p>
        </div>
      )}

      {error && !isLoading && (
        <div className="exfoliants-page__status">
          <p>{error}</p>
        </div>
      )}

      {!isLoading && !error && (
        <>
          <p className="exfoliants-page__count">{data.length} produits</p>
          <div className="exfoliants-grid">
            {data.map((product) => (
              <Link to={`/exfoliants/${product.code}`} className="exfoliant-card" key={product.code}>
                <img
                  className="exfoliant-card__img"
                  src={product.image_front_url}
                  alt={product.product_name}
                />
                <div className="exfoliant-card__body">
                  {product.brands && (
                    <span className="exfoliant-card__brand">
                      {product.brands}
                    </span>
                  )}
                  <span className="exfoliant-card__name">
                    {product.product_name || "—"}
                  </span>
                  {product.quantity && (
                    <span className="exfoliant-card__qty">
                      {product.quantity}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default Exfoliants;
