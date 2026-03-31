export function generateRoutine(answers, products) {
  let filtered = [...products];

  if (answers.concern === "Acné") {
    filtered = filtered.filter((p) => p.tags.includes("acne"));
  }

  if (answers.sensitivity === "Oui") {
    filtered = filtered.filter((p) => !p.tags.includes("irritant"));
  }

  if (answers.sunexposure === "Oui") {
    filtered = filtered.filter((p) => p.tags.includes("screen"));
  }

  if (answers.makeup === "Oui") {
    filtered = filtered.filter((p) => p.tags.includes("cleanser"));
  }

  if (answers.skinType === "Sèche") {
    filtered = filtered.filter((p) => p.tags.includes("cleanser"));
  }

  const selected = filtered.slice(0, 5);

  return {
    morning: selected.slice(0, 3),
    evening: selected.slice(3, 5),
  };
}
