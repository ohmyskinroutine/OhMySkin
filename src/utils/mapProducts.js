export function mapProducts(products) {
  // Définition des règles : chaque règle associe un mot-clé à un ou plusieurs tags
  const rules = [
    { keywords: ["salicylic", "niacinamide"], tags: ["acne"] },
    { keywords: ["hyaluronic", "glycerin"], tags: ["hydration"] },
    { keywords: ["octocrylene", "ethylhexyl triazone"], tags: ["screen"] },
    { keywords: ["spf", "uv"], tags: ["screen"], searchIn: "name" },
    { keywords: ["clean"], tags: ["cleanser"], searchIn: "name" },
    { keywords: ["alcohol", "parfum"], tags: ["irritant"] },
    { keywords: ["retinol", "peptide"], tags: ["anti-aging"] },
    { keywords: ["centella", "allantoin"], tags: ["redness"] },
    { keywords: ["vitamin c", "niacinamide"], tags: ["dark-spots"] },
    { keywords: ["caffeine", "eye"], tags: ["eye-care"] },
    { keywords: ["clay", "kaolin", "niacinamide"], tags: ["pores"] },
    { keywords: ["shea", "butter"], tags: ["rich"] },
    { keywords: ["oil"], tags: ["nourishing"], exclude: ["mineral oil"] },
  ];

  // Images génériques par catégorie
  const genericImages = {
    cleanser: [
      "https://images.unsplash.com/photo-1629198726018-604230bdb091?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2xlYW5zZXJ8ZW58MHx8MHx8fDI%3D",
      "https://images.unsplash.com/photo-1748639320154-6ba118bccc74?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1614159102369-effd79eadadd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y2xlYW5zZXJ8ZW58MHx8MHx8fDI%3D",
    ],
    hydration: [
      "https://images.unsplash.com/photo-1609097164673-7cfafb51b926?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8c29pbiUyMGh5ZHJhdGFudHxlbnwwfHwwfHx8Mg%3D%3D",
      "https://images.unsplash.com/photo-1591134608223-67005960e763?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c29pbiUyMGh5ZHJhdGFudHxlbnwwfHwwfHx8Mg%3D%3D",
    ],
    screen: [
      "https://images.unsplash.com/photo-1686831451322-8d8e234a51e1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGNyJUMzJUE4bWUlMjBzb2xhaXJlfGVufDB8fDB8fHwy",
      "https://images.unsplash.com/photo-1657023828553-18c23601c4d7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3Vuc2NyZWVufGVufDB8fDB8fHwy",
    ],
    acne: [
      "https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHNvaW5zJTIwZGUlMjBsYSUyMHBlYXV8ZW58MHx8MHx8fDI%3D",
      "https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHNvaW5zJTIwZGUlMjBsYSUyMHBlYXV8ZW58MHx8MHx8fDI%3D",
    ],
    "anti-aging": [
      "https://images.unsplash.com/photo-1773567844398-debd18f215b4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YW50aS0lQzMlQTJnZXxlbnwwfHwwfHx8Mg%3D%3D",
      "https://images.unsplash.com/photo-1743557310031-e4e7df1593e6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGFudGktYWNuJUMzJUE5fGVufDB8fDB8fHwy",
    ],
    "eye-care": [
      "https://images.unsplash.com/photo-1629732048574-94040bf85287?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8c2FudCVDMyVBOSUyMGRlJTIwbGElMjBwZWF1fGVufDB8fDB8fHwy",
      "https://images.unsplash.com/photo-1612225004397-f7d573fb1630?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzN8fHNhbnQlQzMlQTklMjBkZSUyMGxhJTIwcGVhdXxlbnwwfHwwfHx8Mg%3D%3D",
    ],
    pores: [
      "https://images.unsplash.com/photo-1600428853876-fb5a850b444f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8c29pbiUyMGRlJTIwbGElMjBwZWF1fGVufDB8fDB8fHwy",
      "https://images.unsplash.com/photo-1552046122-03184de85e08?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHNvaW4lMjBkZSUyMGxhJTIwcGVhdXxlbnwwfHwwfHx8Mg%3D%3D",
    ],
  };

  // Fonction pour obtenir une image générique aléatoire en fonction des tags
  const getGenericImage = (tags) => {
    // On parcourt les tags pour trouver une catégorie d'image correspondante
    for (let tag of tags) {
      if (genericImages[tag]) {
        // Si on trouve la catégorie, on retourne une image aléatoire de cette catégorie
        const images = genericImages[tag];
        const randomIndex = Math.floor(Math.random() * images.length);
        return images[randomIndex];
      }
    }
    return null; // Retourne null si aucune correspondance n'est trouvée
  };

  return products.map((product) => {
    const ingredients = (product.ingredients_text || "").toLowerCase();
    const name = (product.product_name || "").toLowerCase();

    const tags = [];

    // Applique les règles pour déterminer les tags
    rules.forEach((rule) => {
      const source = rule.searchIn === "name" ? name : ingredients;

      rule.keywords.forEach((keyword) => {
        if (source.includes(keyword)) {
          if (
            rule.exclude &&
            rule.exclude.some((elem) => source.includes(elem))
          ) {
            return;
          }
          rule.tags.forEach((tag) => {
            if (!tags.includes(tag)) tags.push(tag);
          });
        }
      });
    });

    // Vérifie si le produit a une image
    let productImage = product.image_url;
    if (!productImage || productImage === "") {
      // Si pas d'image, ou image vide, on prend une image générique en fonction des tags
      productImage = getGenericImage(tags);
    }

    return {
      id: product.code,
      name: product.product_name || "Oh My Skin Exclusive Care",
      brand: product.brands || "Oh My Skin",
      image: productImage, // Image du produit ou générique
      tags,
    };
  });
}
