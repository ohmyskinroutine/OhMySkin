import "./Sunscreen.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

const Sunscreen = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { code } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://world.openbeautyfacts.org/api/v2/search?categories_tags=en:sunscreens&fields=code,product_name,categories_tags,ingredients_text,quantity,image_url,brands&json=1&page_size=50",
          //   "https://world.openbeautyfacts.org/api/v2/product/$%7Bcode%7D?fields=code,product_name,categories_tags,ingredients_text,quantity,image_url,brands",
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
      <section className="sunscreen-page sunscreen-page--status">
        <p>Loading...</p>
      </section>
    );
  }

  // Si on a un code, afficher le détail
  if (code) {
    const singleSunscreen = data?.products?.find((s) => s.code === code);

    if (!singleSunscreen) {
      return (
        <section className="sunscreen-page">
          <p>Crème solaire non trouvée</p>
        </section>
      );
    }

    return (
      <section className="sunscreen-page">
        <div className="sunscreen-detail">
          <Link to="/sunscreen" className="sunscreen-detail__back-link">
            ← Retour aux crèmes solaires
          </Link>

          <div className="sunscreen-detail__container">
            <div className="sunscreen-detail__image-wrap">
              <img
                className="sunscreen-detail__image"
                src={singleSunscreen.image_url}
                alt={
                  singleSunscreen.product_name || "Une crème solaire sans nom"
                }
              />
            </div>

            <div className="sunscreen-detail__content">
              <p className="sunscreen-detail__brand">
                {singleSunscreen.brands || "Marque inconnue"}
              </p>
              <h1 className="sunscreen-detail__title">
                {singleSunscreen.product_name || "Produit sans nom"}
              </h1>

              <div className="sunscreen-detail__field">
                <h3 className="sunscreen-detail__field-label">Quantité</h3>
                <p className="sunscreen-detail__field-value">
                  {singleSunscreen.quantity || "Non spécifiée"}
                </p>
              </div>

              {singleSunscreen.categories_tags &&
                singleSunscreen.categories_tags.length > 0 && (
                  <div className="sunscreen-detail__field">
                    <h3 className="sunscreen-detail__field-label">
                      Catégories
                    </h3>
                    <div className="sunscreen-detail__tags">
                      {singleSunscreen.categories_tags.map((tag, index) => (
                        <span key={index} className="sunscreen-detail__tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {singleSunscreen.ingredients_text && (
                <div className="sunscreen-detail__field">
                  <h3 className="sunscreen-detail__field-label">Ingrédients</h3>
                  <p className="sunscreen-detail__field-value sunscreen-detail__field-value--long">
                    {singleSunscreen.ingredients_text}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Afficher la liste de tous les sunscreen
  return (
    <section className="sunscreen-page">
      <div className="sunscreen-page__hero">
        <h1 className="sunscreen-page__title">Crèmes Solaires</h1>
      </div>

      <div className="sunscreen-grid">
        {data?.products
          ?.filter((sunscreen) => sunscreen.image_url)
          ?.map((sunscreen) => (
            <Link
              to={`/sunscreen/${sunscreen.code}`}
              key={sunscreen.code}
              className="sunscreen-card-link"
            >
              <article className="sunscreen-card">
                <div className="sunscreen-card__image-wrap">
                  <img
                    className="sunscreen-card__image"
                    src={sunscreen.image_url}
                    alt={sunscreen.product_name || "Une crème solaire sans nom"}
                  />
                </div>

                <div className="sunscreen-card__content">
                  <p className="sunscreen-card__brand">
                    {sunscreen.brands || "Marque inconnue"}
                  </p>
                  <h2 className="sunscreen-card__name">
                    {sunscreen.product_name || "Produit sans nom"}
                  </h2>
                  <p className="sunscreen-card__meta">
                    {sunscreen.quantity || (
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

export default Sunscreen;
