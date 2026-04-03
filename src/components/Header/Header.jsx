import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import "./Header.css";

const Header = ({ user, setUser }) => {
  const navigate = useNavigate();
  const debounceRef = useRef(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleSearch = (e) => {
    const value = e.target.value;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (value.trim()) {
        navigate(`/search?q=${encodeURIComponent(value.trim())}`);
      }
    }, 400);
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "https://site--oh-my-skin--cvtt47qfxcv8.code.run/logout",
        {},
        { headers: { Authorization: `Bearer ${user.token}` } },
      );
    } catch {
      // on déconnecte côté client même si le serveur ne répond pas
    }
    Cookies.remove("user");
    setUser(null);
    setShowLogoutModal(false);
    navigate("/");
  };

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="header-top">
            <div className="logo">
              <Link to="/">
                <h1>OH MY SKIN !</h1>
              </Link>
            </div>
            <input className="search-input" placeholder="Search" onChange={handleSearch} />
            <div className="header-actions">
              <Link to="/formulaire">
                <button className="routine-btn">Crée ta routine skincare</button>
              </Link>
              {user ? (
                <div className="auth-buttons">
                  <Link to="/profile" className="header-profile-link">
                    {user.avatar ? (
                      <img src={user.avatar} alt="avatar" className="header-avatar-img" />
                    ) : (
                      <div className="header-avatar-placeholder">
                        {user.username?.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <span className="username-display">Bonjour, {user.username}</span>
                  </Link>
                  <button className="logout-btn" onClick={() => setShowLogoutModal(true)}>
                    Déconnexion
                  </button>
                </div>
              ) : (
                <div className="auth-buttons">
                  <Link to="/login">
                    <button className="login-btn">Connexion</button>
                  </Link>
                  <Link to="/signup">
                    <button className="signup-btn">Inscription</button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="container">
          <nav className="nav">
            <Link to="/cremes">Crèmes</Link>
            <Link to="/cleansers">Cleansers</Link>
            <Link to="/masques">Masques</Link>
            <Link to="/savons">Savons</Link>
            <Link to="/exfoliants">Exfoliants</Link>
            <Link to="/solaires">Crèmes solaires</Link>
          </nav>
        </div>
      </header>

      {showLogoutModal && (
        <div className="modal-overlay" onClick={() => setShowLogoutModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <p className="modal__text">Êtes-vous sûr de vouloir vous déconnecter ?</p>
            <div className="modal__actions">
              <button className="modal__btn modal__btn--cancel" onClick={() => setShowLogoutModal(false)}>
                Annuler
              </button>
              <button className="modal__btn modal__btn--confirm" onClick={handleLogout}>
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
