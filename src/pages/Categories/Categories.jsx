import "./Categories.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Categories = ({ title, url }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await axios.get(url);

        const products = response.data.products ?? [];

        setData(
          //si pas d'image, de marque ou de nom on n'affiche pas le produit
          products.filter((product) => {
            const hasName = product.product_name?.trim();
            const hasImage = product.image_front_url || product.image_url;
            const hasBrand = product.brands?.trim();

            return hasName && hasImage && hasBrand;
          }),
        );
      } catch (err) {
        setError(`Erreur lors du chargement de ${title.toLowerCase()}.`);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [url, title]);

  return (
    <section className="categories-page">
      <div className="categories-page__hero">
        <h1 className="categories-page__title">{title}</h1>
      </div>

      {isLoading && (
        <div className="categories-page__status">
          <p>Chargement des produits...</p>
        </div>
      )}

      {error && !isLoading && (
        <div className="categories-page__status">
          <p>{error}</p>
        </div>
      )}

      {!isLoading && !error && (
        <>
          <p className="categories-page__count">{data.length} Produits</p>

          <div className="categories-grid">
            {data.map((product) => (
              <Link
                //route correspondante et code correspondant
                to={`${location.pathname}/${product.code}`}
                className="categories-card"
                key={product.code}
              >
                <img
                  className="categories-card__img"
                  src={product.image_front_url || product.image_url}
                  alt={product.product_name}
                />

                <div className="categories-card__body">
                  <span className="category-card__brand">{product.brands}</span>

                  <span className="categories-card__name">
                    {product.product_name}
                  </span>

                  {product.quantity ? (
                    <span className="categories-card__qty">
                      {product.quantity}
                    </span>
                  ) : (
                    "30 ml"
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

export default Categories;
