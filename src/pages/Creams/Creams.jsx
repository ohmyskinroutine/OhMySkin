import "./Creams";
import { useState, useEffect } from "react";
import axios from "axios";

const Creams = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await axios.get(
          "https://world.openbeautyfacts.org/api/v2/search?categories_tags=en:face-creams&fields=code,product_name,categories_tags,ingredients_text,quantity,image_url,brands&json=1&page_size=50",
        );

        console.log("ici =>", response.data.products);
        setData(response.data.products);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchdata();
  }, []);

  return (
    <section className="cream-page">
      <div className="container">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div>
            {data.map((element) => {
              return (
                <article key={element.code}>
                  <img src={element.image_url} alt={element.product_name} />
                  <div>
                    <span>{element.brands} </span>
                    <span>{element.product_name}</span>
                    <span>{element.quantity} </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Creams;
