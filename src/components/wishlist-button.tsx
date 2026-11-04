import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useWishlist } from "@/hooks/use-catalog";
import type { ProductCard } from "@/lib/types";
import { cn } from "@/lib/utils";

type WishlistButtonProps = {
  product: ProductCard;
  className?: string;
};

export function WishlistButton({ product, className }: WishlistButtonProps) {
  const { isSaved, toggleItem } = useWishlist();
  const saved =
    isSaved(product.id) || (product.defaultVariantId ? isSaved(product.defaultVariantId) : false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product.defaultVariantId) {
      toast.error("This product is not available yet.");
      return;
    }

    try {
      await toggleItem.mutateAsync(product.defaultVariantId);
      toast.success(
        saved ? `${product.name} removed from wishlist` : `${product.name} saved to wishlist`,
      );
    } catch {
      toast.error("Could not update wishlist. Is the backend running?");
    }
  };

  return (
    <button
      type="button"
      aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
      aria-pressed={saved}
      disabled={toggleItem.isPending}
      onClick={handleClick}
      className={cn(
        "h-9 w-9 rounded-full bg-background/90 backdrop-blur grid place-items-center transition hover:bg-accent hover:text-accent-foreground disabled:opacity-50",
        saved && "bg-accent text-accent-foreground",
        className,
      )}
    >
      <Heart className={cn("h-4 w-4", saved && "fill-current")} />
    </button>
  );
}
