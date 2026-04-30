import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { searchProducts, CATEGORIES, type Product } from "@/lib/openfoodfacts";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Food Explorer — Discover food products" },
      {
        name: "description",
        content:
          "Search, filter and explore thousands of food products with nutrition info via OpenFoodFacts.",
      },
    ],
  }),
  component: HomePage,
});

const GRADE_ORDER: Record<string, number> = { a: 1, b: 2, c: 3, d: 4, e: 5 };

function HomePage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("default");

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, isLoading, error } =
    useInfiniteQuery({
      queryKey: ["products", query, category],
      queryFn: ({ pageParam }) =>
        searchProducts({ query, category, page: pageParam, pageSize: 24 }),
      initialPageParam: 1,
      getNextPageParam: (last) => {
        const totalPages = Math.ceil(last.count / last.page_size);
        return last.page < totalPages ? last.page + 1 : undefined;
      },
      staleTime: 60_000,
    });

  const products: Product[] = useMemo(
    () => (data?.pages.flatMap((p) => p.products) ?? []).filter((p) => p && p.code),
    [data],
  );

  const sorted = useMemo(() => {
    const arr = [...products];
    switch (sort) {
      case "name-asc":
        arr.sort((a, b) =>
          (a.product_name || "").localeCompare(b.product_name || ""),
        );
        break;
      case "name-desc":
        arr.sort((a, b) =>
          (b.product_name || "").localeCompare(a.product_name || ""),
        );
        break;
      case "grade-asc":
        arr.sort(
          (a, b) =>
            (GRADE_ORDER[(a.nutrition_grades || "").toLowerCase()] ?? 99) -
            (GRADE_ORDER[(b.nutrition_grades || "").toLowerCase()] ?? 99),
        );
        break;
      case "grade-desc":
        arr.sort(
          (a, b) =>
            (GRADE_ORDER[(b.nutrition_grades || "").toLowerCase()] ?? 0) -
            (GRADE_ORDER[(a.nutrition_grades || "").toLowerCase()] ?? 0),
        );
        break;
    }
    return arr;
  }, [products, sort]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section
        className="border-b border-border"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="container mx-auto px-4 py-12 md:py-16 text-primary-foreground">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
            Discover what's in your food
          </h1>
          <p className="mt-3 max-w-2xl text-primary-foreground/90">
            Search thousands of products, view ingredients, nutrition grades and labels.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-6">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)] -mt-10 relative">
          <SearchBar
            initialQuery={query}
            onSearch={setQuery}
            onBarcode={(b) => navigate({ to: "/product/$barcode", params: { barcode: b } })}
          />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Select value={category || "all"} onValueChange={(v) => setCategory(v === "all" ? "" : v)}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.value || "all"} value={c.value || "all"}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                <SelectItem value="grade-asc">Nutrition grade (A→E)</SelectItem>
                <SelectItem value="grade-desc">Nutrition grade (E→A)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-8">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <p className="text-center text-destructive py-10">
              Failed to load products. The OpenFoodFacts API may be busy — please try again.
            </p>
          ) : sorted.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">No products found.</p>
          ) : (
            <>
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {sorted.map((p) => (
                  <ProductCard key={p.code} product={p} />
                ))}
              </div>
              <div className="flex justify-center py-10">
                {hasNextPage ? (
                  <Button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    size="lg"
                  >
                    {isFetchingNextPage ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...
                      </>
                    ) : (
                      "Load more"
                    )}
                  </Button>
                ) : (
                  !isFetching && (
                    <p className="text-sm text-muted-foreground">No more products.</p>
                  )
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
