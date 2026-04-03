import "./Results.css";
import { useEffect, useState } from "react";
import { fetchProducts } from "../../services/api";
import { mapProducts } from "../../utils/mapProducts";
import { useLocation, useNavigate } from "react-router-dom";
import { generateRoutine } from "../../utils/generateRoutine";
import RoutineBlock from "../../components/RoutineBlock/RoutineBlock";
import emailContent from "../../utils/emailContent";
import axios from "axios";
import { Link } from "react-router-dom";
// I've imported the Link in this page - Keanu
import SkinBackground from "../../components/SkinBackground/SkinBackground";

function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const answers = location.state;

  const [products, setProducts] = useState([]);
  const [routine, setRoutine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");

  // Emailing

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
      // console.log("routine envoyée =", routine);

      await axios.post(
        "https://site--oh-my-skin--cvtt47qfxcv8.code.run/send-email",
        {
          email: email, // defini le destinataire du mail
          //l'objet et corpss de lmail
          subject: "Ta routine skincare est prête ✨",
          html: emailContent(routine),
          routine: routine,
        },
      );

      alert("Email envoyé !");
      console.log("Email envoyé !");
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
      const apiProducts = await fetchProducts();
      const mapped = mapProducts(apiProducts);

      setProducts(mapped);

      const generated = generateRoutine(answers, mapped);
      setRoutine(generated);

      setLoading(false);
    }

    load();
  }, [answers, navigate]);

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
            <button className="buy-btn">Achètes ta routine</button>
          </Link>
          {/* J'ai jouter un lien pour acheter les produits - Keanu */}
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
