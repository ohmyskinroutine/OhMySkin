import "./ProductDetails.css";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { defaultIngredients } from "../../utils/defaultsIngredients";

const ProductDetails = ({ backPath }) => {
  const { code } = useParams();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // fonction qui récupère le produit correspondant au code dans l'URL
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `https://world.openbeautyfacts.org/api/v2/product/${code}?fields=code,product_name,quantity,image_front_url,image_url,brands,ingredients_text,labels`,
        );

        setProduct(response.data.product);
      } catch (err) {
        setError("Erreur lors du chargement du produit.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [code]);

  if (isLoading) {
    return (
      <div className="product-detail__status">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <section className="product-detail">
      <Link className="product-detail__back" to={backPath}>
        ← Retour
      </Link>

      <div className="product-detail__layout">
        <div className="product-detail__img-wrap">
          <img
            className="product-detail__img"
            src={product.image_front_url || product.image_url}
            alt={product.product_name || "Produit"}
          />
        </div>

        <div className="product-detail__info">
          <span className="product-detail__brand">{product.brands}</span>

          <h1 className="product-detail__name">{product.product_name}</h1>

          {product.quantity ? (
            <p className="product-detail__qty">{product.quantity}</p>
          ) : (
            "30 ml"
          )}

          <div className="product-detail__block">
            <h2 className="product-detail__block-title">Ingrédients</h2>
            <p className="product-detail__block-text">
              {/* //limiter les espaces */}
              {product.ingredients_text?.trim() || defaultIngredients}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
