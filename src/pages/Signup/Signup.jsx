import { useState } from "react";
import { Link } from "react-router-dom";
import AuthField from "../../components/AuthField/AuthField";
import useAuth from "../../hooks/useAuth";
import { signupUser } from "../../services/authService";
import "./Signup.css";

const Signup = ({ setUser }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { error, loading, handleSubmit } = useAuth(setUser);

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Créer un compte</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(() => signupUser(username, email, password));
          }}
          className="auth-form"
        >
          <AuthField
            label="Nom d'utilisateur"
            type="text"
            value={username}
            onChange={setUsername}
            placeholder="monpseudo"
          />
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
            {loading ? "Inscription..." : "S'inscrire"}
          </button>
        </form>
        <p className="auth-redirect">
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
