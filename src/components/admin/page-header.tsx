import type { ReactNode } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  backTo?: string;
  backLabel?: string;
  className?: string;
};

export function PageHeader({
  title,
  description,
  actions,
  backTo,
  backLabel = "Back",
  className,
}: PageHeaderProps) {
  const router = useRouter();

  const handleBackClick = (e: React.MouseEvent) => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      e.preventDefault();
      // If user came from another page in history, go back to restore exact filters/scroll
      if (document.referrer && document.referrer.includes(window.location.origin)) {
        window.history.back();
        return;
      }
      try {
        router.history.back();
        return;
      } catch {
        // fall through to default navigation
      }
    }
  };

  return (
    <div className={cn("mb-6 flex flex-wrap items-start justify-between gap-4", className)}>
      <div>
        {backTo && (
          <Link
            to={backTo}
            onClick={handleBackClick}
            className="group mb-1.5 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-accent transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>{backLabel}</span>
          </Link>
        )}
        <h1 className="text-2xl font-black tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
