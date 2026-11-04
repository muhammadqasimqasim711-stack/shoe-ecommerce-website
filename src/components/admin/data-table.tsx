import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type DataTableProps = {
  columns: (string | ReactNode)[];
  loading?: boolean;
  empty?: string;
  isEmpty?: boolean;
  children?: ReactNode;
  className?: string;
};

export function DataTable({
  columns,
  loading,
  empty = "No results found.",
  isEmpty,
  children,
  className,
}: DataTableProps) {
  if (loading) {
    return <Skeleton className={cn("h-64 rounded-xl", className)} />;
  }

  return (
    <div className={cn("overflow-x-auto rounded-xl border border-border bg-background", className)}>
      <table className="w-full text-sm">
        <thead className="border-b border-border text-left text-muted-foreground">
          <tr>
            {columns.map((col, idx) => {
              const key = typeof col === "string" && col.trim() ? `th-${col}` : `th-idx-${idx}`;
              return (
                <th key={key} className="p-3 font-medium whitespace-nowrap">
                  {col}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>{!isEmpty ? children : null}</tbody>
      </table>
      {isEmpty && <p className="p-6 text-sm text-muted-foreground">{empty}</p>}
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-background p-10 text-center">
      <p className="font-medium">{title}</p>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
    </div>
  );
}
