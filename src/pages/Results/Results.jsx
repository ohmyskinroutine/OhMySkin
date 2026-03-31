import { useLocation, Navigate } from "react-router-dom";

const Results = () => {
  const location = useLocation();
  const answers = location.state;
  if (!answers) {
    <Navigate to="/" />;
  }
  return (
    <main>
      <div>
        <h2>Ma routine personnalisée</h2>
      </div>
    </main>
  );
};

export default Results;
