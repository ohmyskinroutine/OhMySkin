import "./Favorites.css";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useState, useEffect } from "react";

const BASE_URL = "https://site--oh-my-skin--cvtt47qfxcv8.code.run";

const Favorites = ({ user }) => {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();

  // Charger les favoris depuis MongoDB
  useEffect(() => {
    if (!user) {
      setError("Vous devez être connecté pour voir vos favoris");
      setIsLoading(false);
      return;
    }

    const fetchFavorites = async () => {
      try {
        setIsLoading(true);
        setError("");

        const { data } = await axios.get(`${BASE_URL}/favorites`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        setFavorites(data.favorites || []);
      } catch (error) {
        setError("Erreur lors du chargement de vos favoris.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  // Supprimer un favori
  const removeFavorite = async (product) => {
    if (!user) return;

    try {
      const { data } = await axios.delete(
        `${BASE_URL}/favorites/${product.code}`,
        { headers: { Authorization: `Bearer ${user.token}` } },
      );
      setFavorites(data.favorites);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  return (
    <section className="categories-page">
      <div className="categories-page__hero">
        <h1 className="categories-page__title">Mes Favoris</h1>
      </div>

      {isLoading && (
        <div className="categories-page__status">
          <p>Chargement de vos favoris...</p>
        </div>
      )}

      {error && !isLoading && (
        <div className="categories-page__status">
          <p>{error}</p>
        </div>
      )}

      {!isLoading && !error && (
        <>
          <p className="categories-page__count">
            {favorites.length} {favorites.length === 1 ? "Produit" : "Produits"}
          </p>

          {favorites.length === 0 ? (
            <div className="categories-page__status">
              <p>Aucun favori pour le moment</p>
            </div>
          ) : (
            <div className="categories-grid">
              {favorites.map((product) => (
                <Link
                  to={`/cremes/${product.code}`} // À adapter selon la catégorie
                  className="categories-card"
                  key={product.code}
                >
                  <div className="categories-card__image-wrapper">
                    <img
                      className="categories-card__img"
                      src={product.image}
                      alt={product.product_name}
                    />
                    <span
                      className="favorite-icon"
                      onClick={(event) => {
                        event.preventDefault();
                        removeFavorite(product);
                      }}
                    >
                      <FaHeart className="heart active" />
                    </span>
                  </div>

                  <div className="categories-card__body">
                    <span className="category-card__brand">
                      {product.brands}
                    </span>

                    <span className="categories-card__name">
                      {product.product_name}
                    </span>
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

export default Favorites;
