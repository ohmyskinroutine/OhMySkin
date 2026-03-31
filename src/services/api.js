async function fetchFromAPI(url) {
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data.products || [];
  } catch (error) {
    console.error("Erreur fetch API:", error);
    return [];
  }
}

export async function fetchFaceCreams() {
  const url =
    "https://world.openbeautyfacts.org/api/v2/search?categories_tags=en:face-creams&fields=code,product_name,ingredients_text,image_url,brands&page_size=50";
  return await fetchFromAPI(url);
}

export async function fetchFaceScrubs() {
  const url =
    "https://world.openbeautyfacts.org/api/v2/search?categories_tags_en=face-scrubs&fields=cod[…],ingredients_text,image_front_url,quantity,brands,labels";
  return await fetchFromAPI(url);
}

export async function fetchFaceMasks() {
  const url =
    "https://world.openbeautyfacts.org/api/v2/search?categories_tags=en:face-masks&fields=code[…]ients_text,quantity,image_url,brands&json=1&page_size=50";
  return await fetchFromAPI(url);
}

export async function fetchCleansers() {
  const url =
    "https://world.openbeautyfacts.org/api/v2/search?categories_tags=en:cleansers&fields=code,product_name,ingredients_text,image_url,brands&page_size=50";
  return await fetchFromAPI(url);
}

export async function fetchSunScreen() {
  const url =
    "https://world.openbeautyfacts.org/api/v2/search?categories_tags=en:sunscreens&fields=code[…]duct_name,ingredients_text,image_url,brands&page_size=50";
  return await fetchFromAPI(url);
}

export async function fetchProducts() {
  const [creams, masks, scrubs, cleansers, sunScreen] = await Promise.all([
    fetchFaceCreams(),
    fetchFaceMasks(),
    fetchFaceScrubs(),
    fetchCleansers(),
    fetchSunScreen(),
  ]);

  return [...creams, ...masks, ...scrubs, ...cleansers, ...sunScreen];
}
