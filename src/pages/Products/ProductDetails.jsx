import axios from "axios";
import "./ProductDetails.css";
import { useState, useEffect } from "react";

import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { defaultIngredients } from "../../utils/defaultsIngredients";
import useButtonLock from "../../hooks/useButtonLock";

const ProductDetails = ({ backPath, user }) => {
  const { code } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // priorité au state si présent, sinon aux props, sinon fallback
  const safeBackPath = location.state?.backPath || backPath || "/marques";

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const reviewLock = useButtonLock(3000); // bloque le bouton d'envoi pendant 3 secondes

  let token;
  if (user) {
    token = user.token;
  }

  // console.log(token);
  // console.log(user);

  // REVIEWS STATE
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({
    name: "",
    rating: "",
    comment: "",
  });

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((total, review) => total + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : null;

  // FETCH PRODUIT + AVIS
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productRes = await axios.get(
          `https://world.openbeautyfacts.org/api/v2/product/${code}?fields=code,product_name,quantity,image_front_url,image_url,brands,ingredients_text,labels`,
        );

        // si pas de produit → redirection
        if (!productRes.data.product) {
          navigate("/categories"); // ou "/categories" selon ton flow
          return;
        }

        setProduct(productRes.data.product);

        // récupère les avis
        const reviewsResponse = await axios.get(
          `https://site--oh-my-skin--cvtt47qfxcv8.code.run/reviews?productCode=${code}`,
        );

        setReviews(reviewsResponse.data);
      } catch (error) {
        setError("Erreur lors du chargement.");
        console.error(error);
        // en cas d'erreur redirection aussi
        navigate("/categories");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [code, navigate]);

  // Fonction pour le remplissage du formulaire
  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  // Fonction pour poster un avis
  const handleSubmit = async (event) => {
    event.preventDefault();

    // on encapsule toute l'action dans le lock
    await reviewLock.runWithLock(async () => {
      try {
        const response = await axios.post(
          "https://site--oh-my-skin--cvtt47qfxcv8.code.run/reviews",
          {
            rating: Number(form.rating),
            comment: form.comment,
            productCode: code,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        // on ajoute le nouvel avis en haut de la liste
        setReviews([response.data, ...reviews]);

        // on vide le formulaire après succès
        setForm({ name: "", rating: "", comment: "" });
      } catch (error) {
        console.error(error);
        alert("Erreur lors de l'envoi de l'avis");
      }
    });
  };

  if (isLoading) {
    return (
      <div className="product-detail__status">
        <p>Chargement...</p>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <section className="product-detail">
      <Link className="product-detail__back" to={safeBackPath}>
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
              {product.ingredients_text?.trim() || defaultIngredients}
            </p>
          </div>
        </div>
      </div>

      {/* SECTION AVIS */}
      <div className="reviews">
        <h2>Avis clients</h2>

        <h3 className="reviews__average">
          {averageRating
            ? `⭐ ${averageRating} / 5 (${reviews.length} avis)`
            : "Pas encore d'avis"}
        </h3>

        {reviews.map((review) => (
          <div key={review._id} className="review">
            <strong>{review.name}</strong> - {"⭐".repeat(review.rating)}
            <p>{review.comment}</p>
            <small>{new Date(review.createdAt).toLocaleDateString()}</small>
          </div>
        ))}

        {/* FORMULAIRE */}
        {user && (
          <form onSubmit={handleSubmit} className="review-form">
            <select
              name="rating"
              value={form.rating}
              onChange={handleChange}
              required
            >
              <option value="">Note</option>
              <option value="5">5 étoiles</option>
              <option value="4">4 étoiles</option>
              <option value="3">3 étoiles</option>
              <option value="2">2 étoiles</option>
              <option value="1">1 étoile</option>
            </select>

            <textarea
              name="comment"
              placeholder="Votre avis..."
              value={form.comment}
              onChange={handleChange}
              required
            />

            <button type="submit" disabled={reviewLock.isLocked}>
              Envoyer
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default ProductDetails;
