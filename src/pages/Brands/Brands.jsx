import "./Brands.css";
import { useEffect, useMemo, useState } from "react";
import { CATEGORIES } from "../../constants/categories";

const normalizeBrands = (brandsValue) => {
  if (!brandsValue) {
    return [];
  }

  if (Array.isArray(brandsValue)) {
    return brandsValue
      .map((brand) => String(brand).trim())
      .filter((brand) => brand.length > 0);
  }

  return String(brandsValue)
    .split(",")
    .map((brand) => brand.trim())
    .filter((brand) => brand.length > 0);
};

const Brands = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [allBrands, setAllBrands] = useState([]);

  const groupedBrands = useMemo(() => {
    return allBrands.reduce((accumulator, brand) => {
      const firstLetter = brand.charAt(0).toUpperCase();
      const groupKey = /[A-Z]/.test(firstLetter) ? firstLetter : "#";

      if (!accumulator[groupKey]) {
        accumulator[groupKey] = [];
      }

      accumulator[groupKey].push(brand);
      return accumulator;
    }, {});
  }, [allBrands]);

  const sortedLetters = Object.keys(groupedBrands).sort((a, b) =>
    a.localeCompare(b, "fr", { sensitivity: "base" }),
  );

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        setError("");

        const responses = await Promise.all(
          CATEGORIES.map(async (category) => {
            const response = await fetch(category.url);

            if (!response.ok) {
              throw new Error(
                `Erreur API pour ${category.label} (status ${response.status})`,
              );
            }

            const data = await response.json();
            const products = data.products ?? [];

            const uniqueBrands = Array.from(
              new Set(
                products.flatMap((product) => normalizeBrands(product.brands)),
              ),
            ).sort((a, b) => a.localeCompare(b, "fr", { sensitivity: "base" }));

            return {
              brands: uniqueBrands,
            };
          }),
        );

        const allUniqueBrands = Array.from(
          new Set(responses.flatMap((item) => item.brands)),
        ).sort((a, b) => a.localeCompare(b, "fr", { sensitivity: "base" }));

        setAllBrands(allUniqueBrands);
      } catch (requestError) {
        setError(
          requestError.message || "Erreur lors du chargement des marques.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  return (
    <section className="brands-page">
      <div className="brands-page__hero">
        <h1 className="brands-page__title">Brands</h1>
      </div>

      {loading && (
        <div className="brands-page__status">
          <p>Chargement des marques...</p>
        </div>
      )}

      {error && !loading && (
        <div className="brands-page__status">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          <p className="brands-page__count">
            {allBrands.length} marques uniques
          </p>

          <div className="brands-groups">
            {sortedLetters.map((letter) => (
              <article key={letter} className="brands-group">
                <div className="brands-group__letter">{letter}</div>
                <ul className="brands-group__list">
                  {groupedBrands[letter].map((brand) => (
                    <li key={brand} className="brands-group__item">
                      {brand}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default Brands;
