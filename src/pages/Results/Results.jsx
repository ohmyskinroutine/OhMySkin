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
  const [emailStatus, setEmailStatus] = useState(null);

  const handleSendEmail = async () => {
    try {
      //si connecté n utilise le mail user sinon celui rentré dans
      const emailToSend = token ? user.email : email;
      console.log("ici user", user);

      if (!emailToSend) {
        setEmailStatus("error");
        return;
      }

      if (!emailToSend.includes("@")) {
        setEmailStatus("error");
        return;
      }

      const response = await axios.post(
        "https://site--oh-my-skin--cvtt47qfxcv8.code.run/send-email",
        {
          email: emailToSend,
          subject: "Ta routine skincare est prête ✨",
          html: emailContent(routine),
          routine,
        },
      );
      setEmailStatus("success");
      console.log(response.data);
    } catch (error) {
      console.log(error.response?.data || error.message);
      setEmailStatus("error");
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
      // console.log("ici msgggggg=>", err.message);
      alert("Erreur lors de la réinitialisation de la routine");
    }
  };

  if (!answers) return null;
  if (loading) return <div>Chargement...</div>;

  return (
    <main className="routine">
      <SkinBackground />
      <div className="container results-container">
        <div className="results-layout">
          <section className="results-content">
            <div className="header-section">
              <h2>Ta routine personnalisée</h2>
              {token && (
                <div className="reset-block">
                  <p>
                    Tu n'es pas satisfait.e ?{" "}
                    <button onClick={handleResetRoutine} className="reset-link">
                      Génère de nouveaux résultats
                    </button>
                  </p>
                </div>
              )}
            </div>

            <RoutineBlock title="MATIN" products={routine.morning} />
            <RoutineBlock title="SOIR" products={routine.evening} />
          </section>

          <aside className="results-sidebar">
            <div className="summary-card">
              <h3>Prescription</h3>
              <p>Élaborée selon les besoins déclarés dans le questionnaire.</p>

              <Link
                to="/payment"
                className="buy-link"
                state={{ price: routine.totalPrice, title: "Routine complète" }}
              >
                <button className="buy-btn">AJOUTER AU PANIER - 42 €</button>
              </Link>
            </div>
            {token ? (
              <div className="email-card">
                <p>Recevoir les résultats par email</p>

                <button onClick={handleSendEmail} className="email-btn">
                  M’envoyer ma routine
                </button>
                {emailStatus === "success" && (
                  <p className="email-success">Email envoyé avec succès !</p>
                )}

                {emailStatus === "error" && (
                  <p className="email-error">Erreur lors de l’envoi</p>
                )}
              </div>
            ) : (
              <div className="email-card">
                <p>Recevoir les résultats par email</p>

                <input
                  type="email"
                  placeholder="Entre ton email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="email-input"
                />

                <button onClick={handleSendEmail} className="email-btn">
                  M’envoyer ma routine
                </button>
                {emailStatus === "success" && (
                  <p className="email-success">Email envoyé avec succès !</p>
                )}

                {emailStatus === "error" && (
                  <p className="email-error">Erreur lors de l’envoi</p>
                )}
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}

export default Results;

//old

// <main className="routine">
//   <SkinBackground />
//   <div className="container">
//     <div className="header-section">
//       <h2>Ta routine personnalisée</h2>

//       <Link
//         to="/payment"
//         className="buy-link"
//         state={{ price: routine.totalPrice, title: "Routine complète" }}
//       >
//         <button className="buy-btn">Obtiens ta routine</button>
//       </Link>
//       {token && (
//         <button onClick={handleResetRoutine} className="reset-btn">
//           Re-générer ma routine
//         </button>
//       )}
//     </div>

//     <RoutineBlock title="MATIN" products={routine.morning} />
//     <RoutineBlock title="SOIR" products={routine.evening} />
//   </div>
// </main>
