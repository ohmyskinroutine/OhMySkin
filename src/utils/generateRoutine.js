export function generateRoutine(answers, products) {
  const routine = { morning: [], evening: [] };

  const pickRandom = (tab) =>
    tab.length ? tab[Math.floor(Math.random() * tab.length)] : null;

  // Filtre produits par tags et sensibilité
  const filterProducts = (tag) =>
    products
      .filter((product) => product.tags.includes(tag))
      .filter((product) =>
        answers.sensitivity === "Oui"
          ? !product.tags.includes("irritant")
          : true,
      );

  // Ajoute produit aléatoire à la routine
  const addRandom = (tag, period) => {
    const prod = pickRandom(filterProducts(tag));
    if (prod) routine[period].push(prod);
  };

  addRandom("cleanser", "morning");
  addRandom("cleanser", "evening");

  const concernMap = {
    Acné: "acne",
    Imperfections: "acne",
    "Points noirs": "acne",
    Rides: "anti-aging",
    Rougeurs: "redness",
    "Taches brunes": "dark-spots",
    Brillance: "pores",
    Cernes: "eye-care",
    "Pores dilatés": "pores",
  };

  const concernTag = concernMap[answers.concern];
  if (concernTag) addRandom(concernTag, "evening");

  const hydratants = filterProducts("hydration").filter(
    (product) =>
      answers.skinType === "Grasse"
        ? !product.tags.includes("rich")
        : answers.skinType === "Sèche"
          ? product.tags.includes("rich") || product.tags.includes("nourishing")
          : true, // Pour tout autre type de peau
  );

  const morningMoisturizer = pickRandom(hydratants);
  const eveningMoisturizer = pickRandom(hydratants);
  if (morningMoisturizer) routine.morning.push(morningMoisturizer);
  if (eveningMoisturizer) routine.evening.push(eveningMoisturizer);

  if (answers.sunexposure !== "Non") addRandom("screen", "morning");

  return routine;
}
