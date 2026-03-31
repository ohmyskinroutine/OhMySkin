import "./Exfoliant.css";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const Exfoliant = () => {
  const { code } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `https://world.openbeautyfacts.org/api/v2/product/${code}?fields=code,product_name,quantity,image_front_url,brands,ingredients_text,labels`,
        );
        setProduct(response.data.product);
      } catch (err) {
        setError("Erreur lors du chargement du produit.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [code]);

  if (isLoading) {
    return (
      <div className="exfoliant-detail__status">
        <p>Chargement...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="exfoliant-detail__status">
        <p>{error || "Produit introuvable."}</p>
        <Link className="exfoliant-detail__back" to="/exfoliants">
          ← Retour
        </Link>
      </div>
    );
  }

  return (
    <section className="exfoliant-detail">
      <Link className="exfoliant-detail__back" to="/exfoliants">
        ← Retour
      </Link>

      <div className="exfoliant-detail__layout">
        <div className="exfoliant-detail__img-wrap">
          <img
            className="exfoliant-detail__img"
            src={product.image_front_url}
            alt={product.product_name}
          />
        </div>

        <div className="exfoliant-detail__info">
          {product.brands && (
            <span className="exfoliant-detail__brand">{product.brands}</span>
          )}
          <h1 className="exfoliant-detail__name">{product.product_name}</h1>
          {product.quantity && (
            <p className="exfoliant-detail__qty">{product.quantity}</p>
          )}

          {product.labels && (
            <div className="exfoliant-detail__block">
              <h2 className="exfoliant-detail__block-title">Labels</h2>
              <p className="exfoliant-detail__block-text">{product.labels}</p>
            </div>
          )}

          {product.ingredients_text && (
            <div className="exfoliant-detail__block">
              <h2 className="exfoliant-detail__block-title">Ingrédients</h2>
              <p className="exfoliant-detail__block-text">
                {product.ingredients_text}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Exfoliant;
