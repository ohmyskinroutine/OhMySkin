import axios from "axios";
import "./ProductDetails.css";
import { useState, useEffect } from "react";
import ReviewForm from "../../components/Review/ReviewForm";
import ReviewItem from "../../components/Review/ReviewItem";
import { defaultIngredients } from "../../utils/defaultsIngredients";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";

const ProductDetails = ({ backPath, user }) => {
  const { code } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // priorité au state si présent, sinon aux props, sinon fallback
  const safeBackPath = location.state?.backPath || backPath || "/marques";

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [userVotes, setUserVotes] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productRes = await axios.get(
          `https://world.openbeautyfacts.org/api/v2/product/${code}?fields=code,product_name,quantity,image_front_url,image_url,brands,ingredients_text,labels`,
        );

        if (!productRes.data.product) {
          navigate("/categories");
          return;
        }
        setProduct(productRes.data.product);

        const reviewsRes = await axios.get(
          `https://site--oh-my-skin--cvtt47qfxcv8.code.run/reviews?productCode=${code}`,
        );
        setReviews(reviewsRes.data);
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement.");
        navigate("/categories");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [code, navigate]);

  if (isLoading)
    return (
      <div className="product-detail__status">
        <p>Chargement...</p>
      </div>
    );

  if (!product) return null;

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : null;

  return (
    <section className="product-detail">
      <Link className="product-detail__back" to={safeBackPath}>
        ← Retour
      </Link>

      <div className="product-detail__layout">
        <div className="product-detail__img-wrap">
          <img
            className="product-detail__img"
            src={
              product.image_front_url ||
              product.image_url ||
              "https://images.unsplash.com/photo-1600428853876-fb5a850b444f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8c29pbiUyMGRlJTIwbGElMjBwZWF1fGVufDB8fDB8fHwy"
            }
            alt={product.product_name || "Produit"}
          />
        </div>

        <div className="product-detail__info">
          <span className="product-detail__brand">{product.brands}</span>
          <h1 className="product-detail__name">{product.product_name}</h1>
          <p className="product-detail__qty">{product.quantity || "30 ml"}</p>

          <div className="product-detail__block">
            <h2 className="product-detail__block-title">Ingrédients</h2>
            <p className="product-detail__block-text">
              {product.ingredients_text?.trim() || defaultIngredients}
            </p>
          </div>
        </div>
      </div>

      <div className="reviews">
        <h2>Avis clients</h2>
        <h3 className="reviews__average">
          {averageRating
            ? `⭐ ${averageRating} / 5 (${reviews.length} avis)`
            : "Pas encore d'avis"}
        </h3>

        {reviews.map((review) => (
          <ReviewItem
            key={review._id}
            review={review}
            user={user}
            userVotes={userVotes}
            setUserVotes={setUserVotes}
            reviews={reviews}
            setReviews={setReviews}
            token={user?.token}
          />
        ))}

        {user && (
          <ReviewForm
            code={code}
            reviews={reviews}
            setReviews={setReviews}
            token={user.token}
          />
        )}
      </div>
    </section>
  );
};

export default ProductDetails;
