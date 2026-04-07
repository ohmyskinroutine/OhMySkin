import "./History.css";
import axios from "axios";
import { useState, useEffect } from "react";

const History = ({ user }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!user) {
      setError("Vous devez être connecté pour voir vos favoris");
      setIsLoading(false);
      return;
    }
    const fetchHistory = async () => {
      try {
        const response = await axios.get(
          "https://site--oh-my-skin--cvtt47qfxcv8.code.run/routine/history",
          {
            headers: { Authorization: `Bearer ${user.token}` },
          },
        );
        setIsLoading(false);
        setHistory(response.data.history);
        // console.log("data", response.data.history);
      } catch (error) {
        setError(error);
      }
    };
    fetchHistory();
  }, [user]);

  return (
    <main className="history-page">
      {isLoading && <h2>Chargement...</h2>}
      {history.length === 0 ? (
        <div className="container">
          <h2>Historique de mes routines</h2>
          <h3>Pas d'historique pour le moment</h3>
        </div>
      ) : (
        <div className="container">
          <h2>Historique de mes routines</h2>
          {history.map((elem) => {
            return (
              <section>
                <article>
                  <h3>Matin</h3>
                  {elem.morning.map((prodcut, index) => {
                    return (
                      <div key={index}>
                        <p>{prodcut.name}</p>
                        <h4>{prodcut.brand}</h4>
                      </div>
                    );
                  })}
                </article>
                <article>
                  <h3>Soir</h3>
                  {elem.evening.map((prodcut, index) => {
                    return (
                      <div key={index}>
                        <p>{prodcut.name}</p>
                        <h4>{prodcut.brand}</h4>
                      </div>
                    );
                  })}
                </article>
              </section>
            );
          })}
        </div>
      )}
    </main>
  );
};
export default History;
