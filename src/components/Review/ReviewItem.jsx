import "./ReviewItem.css";
import axios from "axios";
import { useState } from "react";
import useButtonLock from "../../hooks/useButtonLock";

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

const ReviewItem = ({
  review,
  user,
  userVotes,
  setUserVotes,
  reviews,
  setReviews,
  token,
}) => {
  const [editingReview, setEditingReview] = useState(null);
  const [editComment, setEditComment] = useState(review.comment);
  const [editRating, setEditRating] = useState(review.rating);

  const reviewLock = useButtonLock(3000); // bloque le bouton d'envoi pendant 3 secondes

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
    if (!user) return alert("Vous devez être connecté pour voter");

    const currentVote = userVotes[reviewId];

    // Toggle vote
    if (currentVote === voteType) {
      const updatedVotes = { ...userVotes };
      delete updatedVotes[reviewId];
      setUserVotes(updatedVotes);

      setReviews(
        reviews.map((review) =>
          review._id === reviewId
            ? {
                ...review,
                likes:
                  voteType === "like" ? (review.likes || 0) - 1 : review.likes,
                dislikes:
                  voteType === "dislike"
                    ? (review.dislikes || 0) - 1
                    : review.dislikes,
              }
            : review,
        ),
      );

      await axios.delete(
        `https://site--oh-my-skin--cvtt47qfxcv8.code.run/reviews/${reviewId}/vote`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return;
    }

    // Update our local "notebook" with the new vote
    setUserVotes({ ...userVotes, [reviewId]: voteType });

    //    /*    🧮 CALCULATE NEW COUNTS

    //        This is like updating a scoreboard:
    //        - Add 1 to the chosen vote
    //        - If switching, subtract 1 from the old vote
    //     */

    setReviews(
      reviews.map((review) =>
        review._id === reviewId
          ? {
              ...review,
              likes:
                voteType === "like"
                  ? (review.likes || 0) + 1
                  : currentVote === "like"
                    ? (review.likes || 0) - 1
                    : review.likes || 0,
              dislikes:
                voteType === "dislike"
                  ? (review.dislikes || 0) + 1
                  : currentVote === "dislike"
                    ? (review.dislikes || 0) - 1
                    : review.dislikes || 0,
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
      { voteType },
      { headers: { Authorization: `Bearer ${token}` } },
    );
  };

  const handleUpdate = async (reviewId) => {
    try {
      await axios.put(
        `https://site--oh-my-skin--cvtt47qfxcv8.code.run/reviews/${reviewId}`,
        { comment: editComment, rating: editRating },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setReviews(
        reviews.map((r) =>
          r._id === reviewId
            ? { ...r, comment: editComment, rating: editRating }
            : r,
        ),
      );
      setEditingReview(null);
    } catch (err) {
      console.error(err);
      alert("Erreur modification");
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      await axios.delete(
        `https://site--oh-my-skin--cvtt47qfxcv8.code.run/reviews/${reviewId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setReviews(reviews.filter((r) => r._id !== reviewId));
    } catch (err) {
      console.error(err);
      alert("Erreur suppression");
    }
  };

  return (
    <div className="review">
      <section>
        <strong>
          {review.name} - {"⭐".repeat(review.rating)}
        </strong>
        {user && review.userId === user._id && editingReview !== review._id && (
          <div className="review-author-actions">
            <button onClick={() => setEditingReview(review._id)}>
              Modifier
            </button>
            <button onClick={() => handleDelete(review._id)}>Supprimer</button>
          </div>
        )}
      </section>

      <p>{review.comment}</p>
      <small>{new Date(review.createdAt).toLocaleDateString()}</small>

      {editingReview === review._id && (
        <form className="update-review">
          <input
            value={editComment}
            onChange={(e) => setEditComment(e.target.value)}
          />
          <select
            value={editRating}
            onChange={(e) => setEditRating(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <button type="button" onClick={() => handleUpdate(review._id)}>
            Valider
          </button>
          <button type="button" onClick={() => setEditingReview(null)}>
            Annuler
          </button>
        </form>
      )}
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
      {user && (
        <div className="review-actions">
          {/*
                 👍 Icon and Count
                      {review.likes || 0}
                     - If review.likes exists, show it
                  - If not (undefined/null), show 0

                    Like checking your wallet:
                    "How much money do I have? If empty, say $0"
                  */}
          <button
            className={`vote-btn like-btn ${
              userVotes[review._id] === "like" ? "active" : ""
            }`}
            onClick={() => handleVote(review._id, "like")}
          >
            👍 <span>{review.likes || 0}</span>
          </button>
          <button
            className={`vote-btn dislike-btn ${
              userVotes[review._id] === "dislike" ? "active" : ""
            }`}
            onClick={() => handleVote(review._id, "dislike")}
          >
            👎 <span>{review.dislikes || 0}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewItem;
