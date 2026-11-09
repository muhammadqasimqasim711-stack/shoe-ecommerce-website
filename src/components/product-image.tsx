import { useEffect, useState } from "react";

const FALLBACK_SHOE =
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80";

type ProductImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: "lazy" | "eager";
};

export function ProductImage({
  src,
  alt,
  className,
  width = 800,
  height = 800,
  loading = "lazy",
}: ProductImageProps) {
  const resolved = src || FALLBACK_SHOE;
  const [current, setCurrent] = useState(resolved);

  useEffect(() => {
    setCurrent(resolved);
  }, [resolved]);

  return (
    <img
      src={current}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      className={className}
      onError={() => {
        if (current !== FALLBACK_SHOE) setCurrent(FALLBACK_SHOE);
      }}
    />
  );
}
