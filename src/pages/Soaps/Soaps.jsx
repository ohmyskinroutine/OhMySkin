import "./Soaps.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

const Soap = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { code } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://world.openbeautyfacts.org/api/v2/search?categories_tags=en:soaps&fields=code,product_name,categories_tags,ingredients_text,quantity,image_url,brands&json=1&page_size=50",
        );
        setData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <section className="soap-page soap-page--status">
        <p>Loading...</p>
      </section>
    );
  }
  // Si un code (id du produit) existe dans l'URL -> Afficher la page détail
  if (code) {
    const singleSoap = data?.products?.find((soap) => soap.code === code);

    return (
      <section className="soap-page">
        <div className="soap-detail">
          <Link to="/savons" className="soap-detail__back-link">
            ← Retour aux savons
          </Link>

          <div className="soap-detail__container">
            <div className="soap-detail__image-wrap">
              <img
                className="soap-detail__image"
                src={singleSoap.image_url}
                alt={singleSoap.product_name || "Un savon sans nom"}
              />
            </div>

            <div className="soap-detail__content">
              <p className="soap-detail__brand">
                {singleSoap.brands || "Marque inconnue"}
              </p>
              <h1 className="soap-detail__title">
                {singleSoap.product_name || "Produit sans nom"}
              </h1>

              <div className="soap-detail__field">
                <h3 className="soap-detail__field-label">Quantité</h3>
                <p className="soap-detail__field-value">
                  {singleSoap.quantity || "Non spécifiée"}
                </p>
              </div>

              {singleSoap.categories_tags &&
                singleSoap.categories_tags.length > 0 && (
                  <div className="soap-detail__field">
                    <h3 className="soap-detail__field-label">Catégories</h3>
                    <div className="soap-detail__tags">
                      {singleSoap.categories_tags.map((tag, index) => (
                        <span key={index} className="soap-detail__tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {singleSoap.ingredients_text && (
                <div className="soap-detail__field">
                  <h3 className="soap-detail__field-label">Ingrédients</h3>
                  <p className="soap-detail__field-value soap-detail__field-value--long">
                    {singleSoap.ingredients_text}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="soap-page">
      <div className="soap-page__hero">
        <h1 className="soap-page__title">Savons</h1>
      </div>

      {/* Afficher la liste de tous les savons avec image */}
      <div className="soap-grid">
        {/* 
          Étapes:
          1. Récupérer tous les produits
          2. Filtrer: garder seulement ceux qui ont une image
          3. Boucler sur chaque savon et créer une carte produit
          4. Chaque lien utilise le code du savon comme ID dans l'URL (/savons/[code])
        */}
        {data?.products
          ?.filter((soap) => soap.image_url)
          ?.map((soap) => (
            <Link
              to={`/savons/${soap.code}`}
              key={soap.code}
              className="soap-card-link"
            >
              <article className="soap-card">
                <div className="soap-card__image-wrap">
                  <img
                    className="soap-card__image"
                    src={soap.image_url}
                    alt={soap.product_name || "Un savon sans nom"}
                  />
                </div>

                <div className="soap-card__content">
                  <p className="soap-card__brand">
                    {soap.brands || "Marque inconnue"}
                  </p>
                  <h2 className="soap-card__name">
                    {soap.product_name || "Produit sans nom"}
                  </h2>
                  <p className="soap-card__meta">
                    {soap.quantity || (
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

export default Soap;
