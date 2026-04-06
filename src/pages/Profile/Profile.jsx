import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import { Link } from "react-router-dom";

const BASE_URL = "https://site--oh-my-skin--cvtt47qfxcv8.code.run";

const Profile = ({ user, setUser }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/profile`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setUsername(data.user.username);
        setEmail(data.user.email);
        setAvatarPreview(data.user.avatar || null);
      } catch {
        setUsername(user.username);
        setEmail(user.email);
        setAvatarPreview(user.avatar || null);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const formData = new FormData();
    if (username !== user.username) formData.append("username", username);
    if (email !== user.email) formData.append("email", email);
    if (password) formData.append("password", password);
    if (avatarFile) formData.append("avatar", avatarFile);

    if ([...formData.keys()].length === 0) {
      setError("Aucune modification détectée.");
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.put(`${BASE_URL}/user/update`, formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedUser = { ...user, ...data.user };
      Cookies.set("user", JSON.stringify(updatedUser), { expires: 7 });
      setUser(updatedUser);
      setAvatarFile(null);
      setPassword("");
      setSuccess("Profil mis à jour avec succès !");
    } catch (err) {
      setError(
        err.response?.data?.message || "Impossible de mettre à jour le profil.",
      );
    } finally {
      setLoading(false);
    }
  };

  const initials = username ? username.slice(0, 2).toUpperCase() : "?";

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-avatar-section">
          <div
            className="profile-avatar-wrapper"
            onClick={() => fileInputRef.current.click()}
          >
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="avatar"
                className="profile-avatar-img"
              />
            ) : (
              <div className="profile-avatar-placeholder">{initials}</div>
            )}
            <div className="profile-avatar-overlay">Changer</div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <h2 className="profile-name">{user?.username}</h2>
          <p className="profile-email-display">{user?.email}</p>
        </div>
        <div className="fav-link">
          <Link to="/favorites">
            <button className="favorites-btn"> Voir mes favoris</button>
          </Link>
        </div>
        <div className="fav-link">
          <Link to="/historique">
            <button className="favorites-btn">
              Voir mes anciennes routines
            </button>
          </Link>
        </div>
        <form onSubmit={handleSubmit} className="profile-form">
          <h3 className="profile-section-title">Modifier le profil</h3>

          <div className="auth-field">
            <label>Nom d'utilisateur</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nom d'utilisateur"
            />
          </div>

          <div className="auth-field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
            />
          </div>

          <div className="auth-field">
            <label>Nouveau mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Laisser vide pour conserver votre mot de passe actuel"
            />
          </div>

          {error && <p className="auth-error">{error}</p>}
          {success && <p className="profile-success">{success}</p>}

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? "Mise à jour..." : "Enregistrer"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
