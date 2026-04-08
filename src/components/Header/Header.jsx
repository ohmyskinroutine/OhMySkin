import "./Header.css";
import axios from "axios";
import Cookies from "js-cookie";
import Modal from "../Modal/Modal";
import { useRef, useState } from "react";
import logoO from "../../assets/Logo.png";
import { Link, useNavigate } from "react-router-dom";

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
    } catch {}
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
                <img src={logoO} alt="logo oh my skin" />
              </Link>
            </div>
            <input
              className="search-input"
              placeholder="Search"
              onChange={handleSearch}
            />
            <div className="header-actions">
              <Link to="/formulaire">
                <button className="routine-btn">Créer ma routine</button>
              </Link>
              {user ? (
                <div className="auth-buttons">
                  <Link to="/profile" className="header-profile-link">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt="avatar"
                        className="header-avatar-img"
                      />
                    ) : (
                      <div className="header-avatar-placeholder">
                        {user.username?.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <span className="username-display">
                      Bonjour, {user.username}
                    </span>
                  </Link>
                  <button
                    className="logout-btn"
                    onClick={() => setShowLogoutModal(true)}
                  >
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
        <Modal
          isOpen={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          onConfirm={handleLogout}
          text="Êtes-vous sûr.e de vouloir vous déconnecter ?"
          confirmText="Déconnexion"
          cancelText="Annuler"
        />
      )}
    </>
  );
};

export default Header;
