export type Cart = {
  userId: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageString: string;
  }>;
};

export interface Product {
  id: string;
  name: string;
  name_ar: string | null;
  description: string;
  description_ar: string | null;
  price: number;
  images: string[];
  category: string;
  isFeatured?: boolean;
  status?: "draft" | "published" | "archived";
}
