//AJOUTER LIMPORT CSS !!!!!
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

import axios from "axios";

const Masks = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await axios.get(
          "https://world.openbeautyfacts.org/api/v2/search?categories_tags=en:face-masks&fields=code,product_name,categories_tags,ingredients_text,quantity,image_url,brands&json=1&page_size=50",
        );

        // console.log("ici =>", response.data.products);
        setData(response.data.products);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchdata();
  }, []);

  return (
    <main className="masks-page">
      <div className="container">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <section>
            <h1>Masks</h1>
            {data.map((element) => {
              return (
                // S'il n'y a pas d'image, la marque et le nom du produit on ne l'affiche pas
                element.image_url &&
                element.brands &&
                element.product_name && (
                  <Link to={"/masques/" + element.code} key={element.code}>
                    <article>
                      <div>
                        <img
                          src={element.image_url}
                          alt={element.product_name}
                        />
                      </div>
                      <div>
                        <div>{element.brands} </div>
                        <div>{element.product_name}</div>
                        {element.quantity ? (
                          <div>{element.quantity} </div>
                        ) : (
                          "10 ml"
                        )}
                      </div>
                    </article>
                  </Link>
                )
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
};

export default Masks;
