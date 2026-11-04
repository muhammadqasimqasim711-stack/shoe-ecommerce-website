export type ProductCardDto = {
  id: string;
  name: string;
  brand: string;
  price: number;
  oldPrice?: number;
  img: string;
  tag?: string;
  colors: string[];
  rating: number;
  reviewCount: number;
  defaultVariantId?: string;
  gender?: string;
};
