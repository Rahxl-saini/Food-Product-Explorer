interface Props {
  grade?: string;
  size?: "sm" | "md" | "lg";
}

const COLORS: Record<string, string> = {
  a: "bg-grade-a",
  b: "bg-grade-b",
  c: "bg-grade-c",
  d: "bg-grade-d",
  e: "bg-grade-e",
};

export function NutritionBadge({ grade, size = "md" }: Props) {
  const g = (grade || "").toLowerCase();
  const valid = ["a", "b", "c", "d", "e"].includes(g);
  const sizes = {
    sm: "h-6 w-6 text-xs",
    md: "h-9 w-9 text-base",
    lg: "h-14 w-14 text-2xl",
  };
  if (!valid) {
    return (
      <div
        className={`${sizes[size]} inline-flex items-center justify-center rounded-full bg-muted text-muted-foreground font-bold`}
        title="No nutrition grade"
      >
        ?
      </div>
    );
  }
  return (
    <div
      className={`${sizes[size]} ${COLORS[g]} inline-flex items-center justify-center rounded-full text-white font-bold uppercase shadow-md`}
      title={`Nutrition grade ${g.toUpperCase()}`}
    >
      {g}
    </div>
  );
}
