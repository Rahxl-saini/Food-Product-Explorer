import { Link } from "@tanstack/react-router";
import type { Product } from "@/lib/openfoodfacts";
import { NutritionBadge } from "./NutritionBadge";

export function ProductCard({ product }: { product: Product }) {
  const img = product.image_front_small_url || product.image_front_url || product.image_url;
  const name = product.product_name || "Unnamed product";
  const category = product.categories?.split(",")[0]?.trim();

  return (
    <Link
      to="/product/$barcode"
      params={{ barcode: product.code }}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-card)]"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-muted">
        {img ? (
          <img
            src={img}
            alt={name}
            loading="lazy"
            className="h-full w-full object-contain p-4 transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
            No image
          </div>
        )}
        <div className="absolute right-2 top-2">
          <NutritionBadge grade={product.nutrition_grades} size="md" />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="line-clamp-2 font-semibold text-foreground">{name}</h3>
        {product.brands && (
          <p className="text-xs text-muted-foreground line-clamp-1">{product.brands}</p>
        )}
        {category && (
          <p className="mt-auto pt-2 text-xs text-primary line-clamp-1">{category}</p>
        )}
      </div>
    </Link>
  );
}
