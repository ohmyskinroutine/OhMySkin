import "./ProtectedRoute.css";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ user, children }) => {
  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;

// J'ai créer ce composant qui check que si l'utilisateur n'est pas connecter il est redirigé vers la page "/login"
