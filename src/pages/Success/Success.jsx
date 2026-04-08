import "./Success.css";
import { Link } from "react-router-dom";

const Success = () => {
  return (
    <main className="success-page">
      <div className="success-page__hero">
        <h1 className="success-page__title">Merci pour votre achat</h1>
        <div className="success-page__buttons">
          <Link to="/">
            <button>Retourner à l'accueil</button>
          </Link>
          <Link>
            <button
              onClick={() =>
                window.open(
                  "https://youtu.be/jwEPCn6lRo4?si=kz7sg6mxh_YJvCV4",
                  "_blank",
                )
              }
            >
              Cliquez ici
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Success;
