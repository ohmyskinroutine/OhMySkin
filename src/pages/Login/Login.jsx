import { useState } from "react";
import { Link } from "react-router-dom";
import AuthField from "../../components/AuthField/AuthField";
import useAuth from "../../hooks/useAuth";
import { loginUser } from "../../services/authService";
import "./Login.css";

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { error, loading, handleSubmit } = useAuth(setUser);

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Connexion</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(() => loginUser(email, password));
          }}
          className="auth-form"
        >
          <AuthField
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="votre@email.com"
          />
          <AuthField
            label="Mot de passe"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
          />
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
        <p className="auth-redirect">
          Pas encore de compte ? <Link to="/signup">Créer un compte</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
