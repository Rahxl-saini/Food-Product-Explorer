const BASE = "https://world.openfoodfacts.org";

async function fetchWithRetry(url: string, retries = 3): Promise<Response> {
  let lastErr: unknown;
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, {
        headers: { Accept: "application/json" },
      });
      if (res.ok) return res;
      lastErr = new Error(`HTTP ${res.status}`);
    } catch (e) {
      lastErr = e;
    }
    // try CORS proxy fallback on last retry
    if (i === retries - 1) {
      try {
        const proxied = `https://corsproxy.io/?${encodeURIComponent(url)}`;
        const res = await fetch(proxied, { headers: { Accept: "application/json" } });
        if (res.ok) return res;
      } catch (e) {
        lastErr = e;
      }
    }
    await new Promise((r) => setTimeout(r, 400 * (i + 1)));
  }
  throw lastErr instanceof Error ? lastErr : new Error("Network error");
}

export interface Product {
  code: string;
  product_name?: string;
  brands?: string;
  image_url?: string;
  image_front_url?: string;
  image_front_small_url?: string;
  categories?: string;
  categories_tags?: string[];
  ingredients_text?: string;
  nutrition_grades?: string;
  nutriments?: Record<string, number | string>;
  labels?: string;
  labels_tags?: string[];
  quantity?: string;
}

export interface SearchResponse {
  products: Product[];
  count: number;
  page: number;
  page_count: number;
  page_size: number;
}

export async function searchProducts(opts: {
  query?: string;
  category?: string;
  page?: number;
  pageSize?: number;
}): Promise<SearchResponse> {
  const { query = "", category = "", page = 1, pageSize = 24 } = opts;
  const params = new URLSearchParams({
    search_terms: query,
    page: String(page),
    page_size: String(pageSize),
    json: "true",
    fields:
      "code,product_name,brands,image_url,image_front_url,image_front_small_url,categories,categories_tags,ingredients_text,nutrition_grades,labels_tags,quantity",
  });
  if (category) {
    params.set("tagtype_0", "categories");
    params.set("tag_contains_0", "contains");
    params.set("tag_0", category);
  }
  const res = await fetchWithRetry(`${BASE}/cgi/search.pl?${params.toString()}`);
  return res.json();
}

export async function getProductByBarcode(barcode: string): Promise<Product | null> {
  const res = await fetchWithRetry(`${BASE}/api/v0/product/${encodeURIComponent(barcode)}.json`);
  const data = await res.json();
  return data.status === 1 ? data.product : null;
}

export const CATEGORIES = [
  { value: "", label: "All categories" },
  { value: "beverages", label: "Beverages" },
  { value: "dairies", label: "Dairy" },
  { value: "snacks", label: "Snacks" },
  { value: "cereals-and-potatoes", label: "Cereals & Potatoes" },
  { value: "meats", label: "Meats" },
  { value: "fish", label: "Fish" },
  { value: "fruits-and-vegetables-based-foods", label: "Fruits & Vegetables" },
  { value: "breads", label: "Breads" },
  { value: "desserts", label: "Desserts" },
  { value: "chocolates", label: "Chocolates" },
  { value: "frozen-foods", label: "Frozen Foods" },
  { value: "sauces", label: "Sauces" },
  { value: "plant-based-foods", label: "Plant-based Foods" },
];
