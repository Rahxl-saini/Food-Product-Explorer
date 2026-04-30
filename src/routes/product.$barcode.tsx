import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import { getProductByBarcode } from "@/lib/openfoodfacts";
import { Header } from "@/components/Header";
import { NutritionBadge } from "@/components/NutritionBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/product/$barcode")({
  head: ({ params }) => ({
    meta: [
      { title: `Product ${params.barcode} — Food Explorer` },
      { name: "description", content: "Detailed food product information." },
    ],
  }),
  component: ProductPage,
  errorComponent: ({ error, reset }) => {
    const router = useRouter();
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p className="mt-2 text-muted-foreground">{error.message}</p>
          <Button
            className="mt-4"
            onClick={() => {
              router.invalidate();
              reset();
            }}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  },
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Link to="/" className="mt-4 inline-block text-primary underline">
          Go home
        </Link>
      </div>
    </div>
  ),
});

const NUTRIMENT_KEYS = [
  { key: "energy-kcal_100g", label: "Energy", unit: "kcal" },
  { key: "fat_100g", label: "Fat", unit: "g" },
  { key: "saturated-fat_100g", label: "Saturated fat", unit: "g" },
  { key: "carbohydrates_100g", label: "Carbohydrates", unit: "g" },
  { key: "sugars_100g", label: "Sugars", unit: "g" },
  { key: "fiber_100g", label: "Fiber", unit: "g" },
  { key: "proteins_100g", label: "Proteins", unit: "g" },
  { key: "salt_100g", label: "Salt", unit: "g" },
];

function ProductPage() {
  const { barcode } = Route.useParams();
  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", barcode],
    queryFn: () => getProductByBarcode(barcode),
    staleTime: 5 * 60_000,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex justify-center py-32">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold">Product not found</h1>
          <p className="mt-2 text-muted-foreground">
            No product found for barcode {barcode}.
          </p>
          <Link to="/" className="mt-6 inline-block">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const img = product.image_front_url || product.image_url;
  const labels = product.labels_tags?.map((l) => l.replace(/^en:/, "")) ?? [];
  const nutriments = product.nutriments || {};

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to products
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_1.5fr]">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            {img ? (
              <img src={img} alt={product.product_name || "Product"} className="mx-auto max-h-[420px] object-contain" />
            ) : (
              <div className="flex h-[420px] items-center justify-center text-muted-foreground">
                No image available
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground">{product.brands}</p>
              <h1 className="mt-1 text-3xl md:text-4xl font-bold">
                {product.product_name || "Unnamed product"}
              </h1>
              {product.quantity && (
                <p className="mt-1 text-muted-foreground">{product.quantity}</p>
              )}
              <div className="mt-4 flex items-center gap-3">
                <NutritionBadge grade={product.nutrition_grades} size="lg" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Nutrition Grade</p>
                  <p className="font-semibold">
                    {product.nutrition_grades
                      ? product.nutrition_grades.toUpperCase()
                      : "Unknown"}
                  </p>
                </div>
              </div>
            </div>

            {labels.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold uppercase text-muted-foreground mb-2">
                  Labels
                </h2>
                <div className="flex flex-wrap gap-2">
                  {labels.slice(0, 12).map((l) => (
                    <Badge key={l} variant="secondary" className="capitalize">
                      {l.replace(/-/g, " ")}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {product.categories && (
              <div>
                <h2 className="text-sm font-semibold uppercase text-muted-foreground mb-2">
                  Categories
                </h2>
                <p className="text-sm">{product.categories}</p>
              </div>
            )}

            {product.ingredients_text && (
              <div>
                <h2 className="text-sm font-semibold uppercase text-muted-foreground mb-2">
                  Ingredients
                </h2>
                <p className="text-sm leading-relaxed">{product.ingredients_text}</p>
              </div>
            )}

            <div>
              <h2 className="text-sm font-semibold uppercase text-muted-foreground mb-2">
                Nutrition facts (per 100g)
              </h2>
              <div className="overflow-hidden rounded-lg border border-border">
                <table className="w-full text-sm">
                  <tbody>
                    {NUTRIMENT_KEYS.map(({ key, label, unit }) => {
                      const v = nutriments[key];
                      if (v === undefined || v === null || v === "") return null;
                      return (
                        <tr key={key} className="border-b border-border last:border-0">
                          <td className="px-4 py-2 text-muted-foreground">{label}</td>
                          <td className="px-4 py-2 text-right font-medium">
                            {typeof v === "number" ? v.toFixed(1) : v} {unit}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">Barcode: {product.code}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
