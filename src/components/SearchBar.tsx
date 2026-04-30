import { Search, Barcode } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
  onSearch: (q: string) => void;
  onBarcode: (b: string) => void;
  initialQuery?: string;
}

export function SearchBar({ onSearch, onBarcode, initialQuery = "" }: Props) {
  const [q, setQ] = useState(initialQuery);
  const [b, setB] = useState("");

  return (
    <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr]">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSearch(q);
        }}
        className="relative flex gap-2"
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products by name..."
            className="pl-9"
          />
        </div>
        <Button type="submit">Search</Button>
      </form>
      <div className="hidden md:flex items-center text-xs uppercase tracking-wider text-muted-foreground">
        or
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (b.trim()) onBarcode(b.trim());
        }}
        className="relative flex gap-2"
      >
        <div className="relative flex-1">
          <Barcode className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={b}
            onChange={(e) => setB(e.target.value)}
            placeholder="Search by barcode..."
            inputMode="numeric"
            className="pl-9"
          />
        </div>
        <Button type="submit" variant="secondary">
          Lookup
        </Button>
      </form>
    </div>
  );
}
