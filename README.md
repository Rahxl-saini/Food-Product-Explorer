# Food Product Explorer

A web application to search, filter and explore food products using the [OpenFoodFacts API](https://world.openfoodfacts.org/).

## Features

- 🔍 **Search** products by name
- 📷 **Barcode lookup** — jump directly to a product page
- 🗂️ **Category filter** (beverages, dairy, snacks, etc.)
- ↕️ **Sort** by name (A-Z / Z-A) and nutrition grade (A→E / E→A)
- ♾️ **Pagination** via "Load more"
- 📄 **Product detail page** — image, ingredients, nutrition table, labels
- 📱 **Fully responsive** (mobile → desktop)

## Tech Stack

- **React 19** + **TanStack Start** (file-based routing, SSR)
- **TanStack Query** for data fetching, caching and infinite queries
- **Tailwind CSS v4** with semantic design tokens (oklch)
- **shadcn/ui** components
- **TypeScript**

## Method

- `src/lib/openfoodfacts.ts` wraps the OpenFoodFacts endpoints (search, barcode lookup) with typed responses.
- The home route uses `useInfiniteQuery` for paginated search and recomputes the sorted list with `useMemo` so sorting is instant and doesn't require refetching.
- The product detail page is a dynamic route `/product/$barcode` that fetches the product via `useQuery`.
- The design system lives entirely in `src/styles.css` — colors (including nutrition-grade tokens A–E), gradients and shadows are defined as CSS custom properties consumed via Tailwind utility classes.
- Components are small and focused: `SearchBar`, `ProductCard`, `NutritionBadge`, `Header`.

## Run locally

```bash
bun install
bun run dev
```

## Time taken

~2 hours.
