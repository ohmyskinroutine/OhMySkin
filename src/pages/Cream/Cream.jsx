import "./Cream";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const Cream = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { code } = useParams();

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await axios.get(
          `https://world.openbeautyfacts.org/api/v2/product/${code}?fields=code,product_name,categories_tags,ingredients_text,quantity,image_url,brands`,
        );

        console.log("ici =>", response.data.product);
        setData(response.data.product);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchdata();
  }, [code]);

  return (
    <main className="cream-page">
      <div className="container">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <section>
            <div className="product-image">
              <img src={data.image_url} alt={data.product_name} />
            </div>
            <aside>
              <div>{data.brands} </div>
              <div>{data.product_name}</div>
              <div>{data.quantity} </div>
              {data.ingredients_text && (
                <div>Ingrédients : {data.ingredients_text} </div>
              )}
            </aside>
          </section>
        )}
      </div>
    </main>
  );
};

export default Cream;
