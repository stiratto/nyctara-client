import { Category } from "./Category.Interface";

export enum ProductQuality {
  ORIGINAL = "ORIGINAL",
  REACONDICIONADO = "REACONDICIONADO"
}

export interface Product {
  id?: string;
  note?: string;
  tag?: string;
  product_name: string;
  product_price: number;
  product_quantity?: number;
  isAvailable: boolean;
  product_tags: string[];
  product_description?: string;
  product_notes: string[];
  product_quality: string;
  categories?: Category[];
  product_category: {
    id: string;
    category_name: string;
  };
  product_images?: (File | string)[];
  productUrl?: string;
  categoryWasSelected?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
