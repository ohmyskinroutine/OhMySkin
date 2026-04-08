import "./ReviewForm.css";
import { useState } from "react";
import useButtonLock from "../../hooks/useButtonLock";

const ReviewForm = ({ code, reviews, setReviews, token }) => {
  const [form, setForm] = useState({ rating: "", comment: "" });
  const reviewLock = useButtonLock(3000); // bloque le bouton d'envoi pendant 3 secondes

  // Fonction pour le remplissage du formulaire
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Fonction pour poster un avis
  const handleSubmit = async (e) => {
    e.preventDefault();
    // on encapsule toute l'action dans le lock
    await reviewLock.runWithLock(async () => {
      try {
        const res = await fetch(
          "https://site--oh-my-skin--cvtt47qfxcv8.code.run/reviews",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              productCode: code,
              rating: Number(form.rating),
              comment: form.comment,
            }),
          },
        );
        const data = await res.json();
        setReviews([data, ...reviews]);
        setForm({ rating: "", comment: "" });
      } catch (err) {
        alert("Erreur lors de l'envoi de l'avis");
        console.error(err);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <select
        name="rating"
        value={form.rating}
        onChange={handleChange}
        required
      >
        <option value="">Note</option>
        {[5, 4, 3, 2, 1].map((n) => (
          <option key={n} value={n}>
            {n} étoiles
          </option>
        ))}
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
  );
};

export default ReviewForm;
