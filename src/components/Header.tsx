import { Link } from "@tanstack/react-router";
import { Apple } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-lg text-primary-foreground"
            style={{ background: "var(--gradient-hero)" }}
          >
            <Apple className="h-5 w-5" />
          </span>
          <span>Food Explorer</span>
        </Link>
        <nav className="text-sm text-muted-foreground">
          Powered by OpenFoodFacts
        </nav>
      </div>
    </header>
  );
}
