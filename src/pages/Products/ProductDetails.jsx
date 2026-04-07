import axios from "axios";
import "./ProductDetails.css";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { defaultIngredients } from "../../utils/defaultsIngredients";

const ProductDetails = ({ backPath, user }) => {
  const { code } = useParams();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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

  /* ============================================
     💡 LIKE/DISLIKE STATE MANAGEMENT
     ============================================
     Think of this like a notebook 📓 where we track:
     - Which reviews the current user has liked
     - Which reviews the current user has disliked
     
     We use a JavaScript Object {} as a "lookup table"
     Example: { "review123": "like", "review456": "dislike" }
     
     Why? So we can quickly check: "Did I already like this review?"
  */
  const [userVotes, setUserVotes] = useState({});

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

        setProduct(productRes.data.product);

        // récupère les avis
        const reviewsResponse = await axios.get(
          `https://site--oh-my-skin--cvtt47qfxcv8.code.run/reviews?productCode=${code}`,
        );

        setReviews(reviewsResponse.data);
      } catch (error) {
        setError("Erreur lors du chargement.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [code]);

  // Fonction pour le remplissage du formulaire
  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  // Fonction pour poster un avis
  const handleSubmit = async (event) => {
    event.preventDefault();

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

      setReviews([response.data, ...reviews]);
      setForm({ name: "", rating: "", comment: "" });
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'envoi de l'avis");
    }
  };

  /* ============================================
     👍 LIKE/DISLIKE HANDLER FUNCTIONS
     ============================================
     
     ANALOGY: Think of voting like pressing a light switch 💡
     
     - First press (OFF → ON): Turn on the light (add your vote)
     - Second press (ON → OFF): Turn off the light (remove your vote)
     - Switch to opposite (ON → OPPOSITE): Change to the other light
     
     This function handles THREE scenarios:
     1. User hasn't voted → Add their vote
     2. User clicks same vote again → Remove their vote (toggle off)
     3. User switches vote → Change to opposite vote
  */

  const handleVote = async (reviewId, voteType) => {
    /* ------------------------------------------
       🔐 SECURITY CHECK: Must be logged in
       ------------------------------------------
       Like a bouncer at a club - if you don't have 
       an ID (user account), you can't enter!
    */
    if (!user) {
      alert("Vous devez être connecté pour voter");
      return; // Stop the function here ⛔
    }

    /* ------------------------------------------
       📊 CHECK CURRENT VOTE STATUS
       ------------------------------------------
       Look in our "notebook" (userVotes) to see:
       - What did this user vote before?
       - Did they like it? Dislike it? Nothing?
    */
    const currentVote = userVotes[reviewId]; // Could be: "like", "dislike", or undefined

    /* ------------------------------------------
       🎯 DETERMINE THE ACTION
       ------------------------------------------
       
       SCENARIO 1: Click on SAME button twice
       Example: User already liked it, clicks like again
       → Result: REMOVE the vote (undo/toggle off)
    */
    if (currentVote === voteType) {
      // Remove vote from our local tracking
      const updatedVotes = { ...userVotes }; // Make a copy of the notebook
      delete updatedVotes[reviewId]; // Erase this entry ✏️
      setUserVotes(updatedVotes); // Update the notebook

      /* 
         Update the review counts locally (optimistic update)
         This makes the UI feel fast! Like instant gratification 🎁
         
         We subtract 1 from whichever count they removed
      */
      setReviews(
        reviews.map(
          (review) =>
            review._id === reviewId
              ? {
                  ...review, // Copy all existing review data
                  // Ternary operator: condition ? ifTrue : ifFalse
                  likes:
                    voteType === "like"
                      ? (review.likes || 0) - 1 // Remove from likes
                      : review.likes || 0, // Keep likes the same
                  dislikes:
                    voteType === "dislike"
                      ? (review.dislikes || 0) - 1 // Remove from dislikes
                      : review.dislikes || 0, // Keep dislikes the same
                }
              : review, // Don't modify other reviews
        ),
      );

      await axios.delete(
        `https://site--oh-my-skin--cvtt47qfxcv8.code.run/reviews/${reviewId}/vote`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      return; // Stop here, we're done!
    }

    /* ------------------------------------------
       SCENARIO 2 & 3: Add new vote OR switch vote
       ------------------------------------------
    */

    // Update our local "notebook" with the new vote
    setUserVotes({ ...userVotes, [reviewId]: voteType });

    /* 
       🧮 CALCULATE NEW COUNTS
       
       This is like updating a scoreboard:
       - Add 1 to the chosen vote
       - If switching, subtract 1 from the old vote
    */
    setReviews(
      reviews.map((review) =>
        review._id === reviewId
          ? {
              ...review,
              likes:
                voteType === "like"
                  ? (review.likes || 0) + 1 // Add to likes
                  : currentVote === "like"
                    ? (review.likes || 0) - 1 // Switch: remove from likes
                    : review.likes || 0, // No change
              dislikes:
                voteType === "dislike"
                  ? (review.dislikes || 0) + 1 // Add to dislikes
                  : currentVote === "dislike"
                    ? (review.dislikes || 0) - 1 // Switch: remove from dislikes
                    : review.dislikes || 0, // No change
            }
          : review,
      ),
    );

    /* 
       📡 SEND TO BACKEND
       Tell the server: "Hey, this user just voted!"
    */
    await axios.post(
      `https://site--oh-my-skin--cvtt47qfxcv8.code.run/reviews/${reviewId}/vote`,
      { voteType }, // Send "like" or "dislike"
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
  };

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

        {/* 
          🔄 MAP THROUGH REVIEWS
          
          ANALOGY: Like going through a photo album 📸
          - Each review is a photo
          - We look at each one and display it on the page
          
          .map() is like a photocopier that:
          1. Takes each review
          2. Creates HTML for it  
          3. Returns all the HTMLs as a list
        */}
        {reviews.map((review) => (
          <div key={review._id} className="review">
            <strong>{review.name}</strong> - {"⭐".repeat(review.rating)}
            <p>{review.comment}</p>
            <small>{new Date(review.createdAt).toLocaleDateString()}</small>
            {/* ============================================
                👍👎 LIKE/DISLIKE BUTTONS
                ============================================
                
                CONDITIONAL RENDERING (&&):
                Think of && as "IF this is true, THEN show that"
                
                Like a VIP section at a club:
                - user && reviews.length > 0 means:
                  "Show buttons ONLY IF user is logged in AND there are reviews"
                
                Why?
                - No user = no buttons (guests can't vote)
                - No reviews = nothing to vote on
            */}
            {user && reviews.length > 0 && (
              <div className="review-actions">
                {/* 
                  👍 LIKE BUTTON 
                  
                  onClick={() => handleVote(...)}
                  - onClick: "When someone clicks this button..."
                  - () => : "...run this function"
                  - handleVote(review._id, "like"): The function we call
                  
                  Why arrow function? (() =>)
                  Without it: onClick={handleVote()} would run IMMEDIATELY!
                  With it: onClick={() => handleVote()} runs ONLY when clicked!
                  
                  Like the difference between:
                  - Eating food now vs
                  - Putting food in the fridge to eat later
                */}
                <button
                  className={`vote-btn like-btn ${
                    userVotes[review._id] === "like" ? "active" : ""
                  }`}
                  onClick={() => handleVote(review._id, "like")}
                  title="J'aime cet avis"
                >
                  {/* 
                    👍 Icon and Count
                    
                    {review.likes || 0}
                    - If review.likes exists, show it
                    - If not (undefined/null), show 0
                    
                    Like checking your wallet:
                    "How much money do I have? If empty, say $0"
                  */}
                  👍 <span>{review.likes || 0}</span>
                </button>

                {/* 
                  👎 DISLIKE BUTTON
                  Same logic as like button, but for dislikes!
                */}
                <button
                  className={`vote-btn dislike-btn ${
                    userVotes[review._id] === "dislike" ? "active" : ""
                  }`}
                  onClick={() => handleVote(review._id, "dislike")}
                  title="Je n'aime pas cet avis"
                >
                  👎 <span>{review.dislikes || 0}</span>
                </button>
              </div>
            )}
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

            <button type="submit">Envoyer</button>
          </form>
        )}
      </div>
    </section>
  );
};

export default ProductDetails;
