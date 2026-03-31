export function mapProducts(products) {
  return products.map((product) => {
    const ingredients = (product.ingredients_text || "").toLowerCase();
    const name = (product.product_name || "").toLowerCase();

    const tags = [];

    if (ingredients.includes("salicylic")) tags.push("acne");
    if (ingredients.includes("niacinamide")) tags.push("acne");
    if (ingredients.includes("hyaluronic")) tags.push("hydration");
    if (ingredients.includes("alcohol")) tags.push("irritant");
    if (ingredients.includes("parfum")) tags.push("irritant");
    if (ingredients.includes("octocrylène")) tags.push("screen");
    if (ingredients.includes("ethylhexyl triazone")) tags.push("screen");
    if (name.includes("spf")) tags.push("screen");
    if (name.includes("uv")) tags.push("screen");
    if (name.includes("clean")) tags.push("cleanser");

    return {
      id: product.code,
      name: product.product_name || "Produit inconnu",
      brand: product.brands || "Marque inconnue",
      image: product.image_url,
      tags,
    };
  });
}
