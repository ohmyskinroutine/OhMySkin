import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const useAuth = (setUser) => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (apiFn) => {
    setError("");
    setLoading(true);
    try {
      const { data } = await apiFn();
      Cookies.set("user", JSON.stringify(data.user), { expires: 7 });
      setUser(data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Impossible de joindre le serveur");
    } finally {
      setLoading(false);
    }
  };

  return { error, loading, handleSubmit };
};

export default useAuth;
