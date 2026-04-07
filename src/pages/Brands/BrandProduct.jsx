import "./BrandProduct.css";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CATEGORIES } from "../../constants/categories";

const BrandProducts = () => {
  const { brand } = useParams();
  const decodedBrand = decodeURIComponent(brand);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const uniformBrands = (value) =>
    (Array.isArray(value) ? value : String(value ?? "").split(","))
      .map((b) => b.trim())
      .filter(Boolean);

  useEffect(() => {
    Promise.all(
      CATEGORIES.map((category) =>
        fetch(category.url)
          .then((res) => res.json())
          .then(({ products = [] }) => products),
      ),
    ).then((responses) => {
      const allProducts = responses.flat();
      const filtered = allProducts.filter((product) =>
        uniformBrands(product.brands).some(
          (b) => b.toLowerCase() === decodedBrand.toLowerCase(),
        ),
      );
      setProducts(filtered);
    });
  }, [decodedBrand]);

  return (
    <section className="categories-page">
      <button className="product-detail__back" onClick={() => navigate(-1)}>
        ← Retour
      </button>
      <div className="categories-page__hero">
        <h1 className="categories-page__title">Produits de {decodedBrand}</h1>
      </div>
      <p className="categories-page__count">{products.length} produits</p>

      {products.length === 0 ? (
        <p className="categories-page__status">Aucun produit trouvé</p>
      ) : (
        <div className="categories-grid">
          {products.map((product) => (
            <div key={product.code} className="categories-card">
              <div className="categories-card__image-wrapper">
                <img
                  src={
                    product.image_url ||
                    "https://images.unsplash.com/photo-1600428853876-fb5a850b444f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8c29pbiUyMGRlJTIwbGElMjBwZWF1fGVufDB8fDB8fHwy"
                  }
                  alt={product.product_name}
                  className="categories-card__img"
                />
              </div>
              <div className="categories-card__body">
                <p className="categories-card__brand">
                  {product.brands || decodedBrand}
                </p>
                <p className="categories-card__name">
                  {product.product_name || "Oh My Skin Exclusive Care"}
                </p>
                <p className="categories-card__qty">{product.quantity || ""}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default BrandProducts;
