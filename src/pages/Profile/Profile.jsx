import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const BASE_URL = "https://site--oh-my-skin--cvtt47qfxcv8.code.run";

const Profile = ({ user, setUser }) => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [password, setPassword] = useState("");
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
        setAvatar(data.user.avatar || "");
      } catch {
        setUsername(user.username);
        setEmail(user.email);
        setAvatar(user.avatar || "");
      }
    };

    fetchProfile();
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const payload = {};
    if (username !== user.username) payload.username = username;
    if (email !== user.email) payload.email = email;
    if (password) payload.password = password;
    if (avatar !== (user.avatar || "")) payload.avatar = avatar;

    if (Object.keys(payload).length === 0) {
      setError("Aucune modification détectée.");
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.put(`${BASE_URL}/user/update`, payload, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      const updatedUser = { ...user, ...data.user };
      Cookies.set("user", JSON.stringify(updatedUser), { expires: 7 });
      setUser(updatedUser);
      setPassword("");
      setSuccess("Profil mis à jour avec succès !");
    } catch (err) {
      setError(err.response?.data?.message || "Impossible de mettre à jour le profil.");
    } finally {
      setLoading(false);
    }
  };

  const initials = username
    ? username.slice(0, 2).toUpperCase()
    : "?";

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-avatar-section">
          {avatar ? (
            <img src={avatar} alt="avatar" className="profile-avatar-img" />
          ) : (
            <div className="profile-avatar-placeholder">{initials}</div>
          )}
          <h2 className="profile-name">{user?.username}</h2>
          <p className="profile-email-display">{user?.email}</p>
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
            <label>URL de l'avatar</label>
            <input
              type="url"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://exemple.com/photo.jpg"
            />
          </div>

          <div className="auth-field">
            <label>Nouveau mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Laisser vide pour ne pas changer"
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
