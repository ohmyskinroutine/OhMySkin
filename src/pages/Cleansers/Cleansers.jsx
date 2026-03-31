import "./Cleansers.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

const Cleansers = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { code } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://world.openbeautyfacts.org/api/v2/search?categories_tags=en:cleansers&fields=code,product_name,categories_tags,ingredients_text,quantity,image_url,brands&json=1&page_size=50",
        );
        setData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <section className="cleanser-page cleanser-page--status">
        <p>Loading...</p>
      </section>
    );
  }

  // Si on a un code, afficher le détail
  if (code) {
    const singleCleanser = data?.products?.find((s) => s.code === code);

    if (!singleCleanser) {
      return (
        <section className="cleanser-page">
          <p>Cleanser non trouvé</p>
        </section>
      );
    }

    return (
      <section className="cleanser-page">
        <div className="cleanser-detail">
          <Link to="/cleansers" className="cleanser-detail__back-link">
            ← Retour aux cleansers
          </Link>

          <div className="cleanser-detail__container">
            <div className="cleanser-detail__image-wrap">
              <img
                className="cleanser-detail__image"
                src={singleCleanser.image_url}
                alt={singleCleanser.product_name || "Un nettoyant sans nom"}
              />
            </div>

            <div className="cleanser-detail__content">
              <p className="cleanser-detail__brand">
                {singleCleanser.brands || "Marque inconnue"}
              </p>
              <h1 className="cleanser-detail__title">
                {singleCleanser.product_name || "Produit sans nom"}
              </h1>

              <div className="cleanser-detail__field">
                <h3 className="cleanser-detail__field-label">Quantité</h3>
                <p className="cleanser-detail__field-value">
                  {singleCleanser.quantity || "Non spécifiée"}
                </p>
              </div>

              {singleCleanser.categories_tags &&
                singleCleanser.categories_tags.length > 0 && (
                  <div className="cleanser-detail__field">
                    <h3 className="cleanser-detail__field-label">Catégories</h3>
                    <div className="cleanser-detail__tags">
                      {singleCleanser.categories_tags.map((tag, index) => (
                        <span key={index} className="cleanser-detail__tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {singleCleanser.ingredients_text && (
                <div className="cleanser-detail__field">
                  <h3 className="cleanser-detail__field-label">Ingrédients</h3>
                  <p className="cleanser-detail__field-value cleanser-detail__field-value--long">
                    {singleCleanser.ingredients_text}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Afficher la liste de tous les nettoyants
  return (
    <section className="cleanser-page">
      <div className="cleanser-page__hero">
        <h1 className="cleanser-page__title">Cleansers</h1>
      </div>

      <div className="cleanser-grid">
        {data?.products
          ?.filter((cleanser) => cleanser.image_url)
          ?.map((cleanser) => (
            <Link
              to={`/cleansers/${cleanser.code}`}
              key={cleanser.code}
              className="cleanser-card-link"
            >
              <article className="cleanser-card">
                <div className="cleanser-card__image-wrap">
                  <img
                    className="cleanser-card__image"
                    src={cleanser.image_url}
                    alt={cleanser.product_name || "Un nettoyant sans nom"}
                  />
                </div>

                <div className="cleanser-card__content">
                  <p className="cleanser-card__brand">
                    {cleanser.brands || "Marque inconnue"}
                  </p>
                  <h2 className="cleanser-card__name">
                    {cleanser.product_name || "Produit sans nom"}
                  </h2>
                  <p className="cleanser-card__meta">
                    {cleanser.quantity || (
                      <span style={{ textTransform: "none" }}>30 ml</span>
                    )}
                  </p>
                </div>
              </article>
            </Link>
          ))}
      </div>
    </section>
  );
};

export default Cleansers;
