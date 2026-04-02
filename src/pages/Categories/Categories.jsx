import "./Categories.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { useState, useEffect } from "react";

const Categories = ({ title, url }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const getFavorites = () => {
    const favs = localStorage.getItem("favorites");
    return favs ? JSON.parse(favs) : [];
  };

  const [favorites, setFavorites] = useState(getFavorites());

  const toggleFavorite = (product) => {
    const exists = favorites.find((prdt) => prdt.code === product.code);

    let updated;

    if (exists) {
      updated = favorites.filter((prdt) => prdt.code !== product.code);
    } else {
      updated = [
        ...favorites,
        {
          code: product.code,
          product_name: product.product_name,
          image: product.image_front_url || product.image_url,
          brands: product.brands,
        },
      ];
    }

    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const isFavorite = (code) => {
    return favorites.some((prdt) => prdt.code === code);
  };

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
      } catch (error) {
        setError(`Erreur lors du chargement de ${title.toLowerCase()}.`);
        console.error(error);
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
                <div className="categories-card__image-wrapper">
                  <img
                    className="categories-card__img"
                    src={product.image_front_url || product.image_url}
                    alt={product.product_name}
                  />
                  <span
                    className="favorite-icon"
                    onClick={(event) => {
                      event.preventDefault();
                      toggleFavorite(product);
                    }}
                  >
                    {isFavorite(product.code) ? (
                      <FaHeart className="heart active" />
                    ) : (
                      <FaRegHeart className="heart" />
                    )}
                  </span>
                </div>

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
