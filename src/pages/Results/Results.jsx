import "./Results.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchProducts } from "../../services/api";
import emailContent from "../../utils/emailContent";
import { mapProducts } from "../../utils/mapProducts";
import { useLocation, useNavigate } from "react-router-dom";
import RoutineBlock from "../../components/RoutineBlock/RoutineBlock";
import SkinBackground from "../../components/SkinBackground/SkinBackground";

function Results({ user }) {
  // token optionnel
  const location = useLocation();
  const navigate = useNavigate();
  const answers = location.state;
  let token;
  if (user) {
    token = user.token;
  }

  // console.log("token", token);

  const [products, setProducts] = useState([]);
  const [routine, setRoutine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");

  const handleSendEmail = async () => {
    try {
      if (!email) {
        alert("Entre ton email");
        return;
      }
      if (!email.includes("@")) {
        alert("Email invalide");
        return;
      }

      const response = await axios.post(
        "https://site--oh-my-skin--cvtt47qfxcv8.code.run/send-email",
        {
          email,
          subject: "Ta routine skincare est prête ✨",
          html: emailContent(routine),
          routine,
        },
      );
      console.log(response.data);
      alert("Email envoyé !");
    } catch (error) {
      console.log(error.response?.data || error.message);

      alert("Erreur lors de l'envoi");
    }
  };

  useEffect(() => {
    if (!answers) {
      navigate("/");
      return;
    }

    async function load() {
      try {
        const apiProducts = await fetchProducts();
        const mapped = mapProducts(apiProducts);
        setProducts(mapped);

        const res = await axios.post(
          "https://site--oh-my-skin--cvtt47qfxcv8.code.run/routine",
          { answers, products: mapped },
          { headers: token ? { Authorization: `Bearer ${token}` } : {} },
        );

        setRoutine(res.data);
      } catch (error) {
        console.error(error);
        alert("Erreur lors du chargement de la routine");
      }

      setLoading(false);
    }

    load();
  }, [answers, navigate]);

  const handleResetRoutine = async () => {
    try {
      if (!token) {
        alert("Seuls les utilisateurs connectés peuvent reset");
        return;
      }

      await axios.post(
        "https://site--oh-my-skin--cvtt47qfxcv8.code.run/routine/reset",
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la réinitialisation de la routine");
    }
  };

  if (!answers) return null;
  if (loading) return <div>Chargement...</div>;

  return (
    <main className="routine">
      <SkinBackground />
      <div className="container">
        <div className="header-section">
          <h2>Ta routine personnalisée</h2>
          <Link
            to="/payment"
            className="buy-link"
            state={{ price: routine.totalPrice, title: "Routine complète" }}
          >
            <button className="buy-btn">Obtiens ta routine</button>
          </Link>
          {token && (
            <button onClick={handleResetRoutine} className="reset-btn">
              Re-générer ma routine
            </button>
          )}
        </div>

        <RoutineBlock title="Routine du Matin" products={routine.morning} />
        <RoutineBlock title="Routine du Soir" products={routine.evening} />

        <div className="email-block">
          <input
            type="email"
            placeholder="Entre ton email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <button onClick={handleSendEmail}>
            Recevoir ma routine par email
          </button>
        </div>
      </div>
    </main>
  );
}

export default Results;
