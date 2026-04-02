import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchProducts } from "../../services/api";
import { mapProducts } from "../../utils/mapProducts";
import { generateRoutine } from "../../utils/generateRoutine";
import RoutineBlock from "../../components/RoutineBlock";
import SkinBackground from "../../components/SkinBackground/SkinBackground";

function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const answers = location.state;

  const [products, setProducts] = useState([]);
  const [routine, setRoutine] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!answers) {
      navigate("/");
      return;
    }

    async function load() {
      const apiProducts = await fetchProducts();
      const mapped = mapProducts(apiProducts);

      setProducts(mapped);

      const generated = generateRoutine(answers, mapped);
      setRoutine(generated);

      setLoading(false);
    }

    load();
  }, [answers, navigate]);

  if (!answers) return null;
  if (loading) return <div>Chargement...</div>;

  return (
    <div>
      <SkinBackground />
      <h2>Ta routine personnalisée</h2>

      <RoutineBlock title="Matin 🌞" products={routine.morning} />
      <RoutineBlock title="Soir 🌙" products={routine.evening} />
    </div>
  );
}

export default Results;
