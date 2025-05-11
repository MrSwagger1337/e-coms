import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  nameAr: z.string().min(1, "Arabic name is required").optional(),
  description: z.string().min(1, "Description is required"),
  descriptionAr: z.string().min(1, "Arabic description is required").optional(),
  status: z.enum(["draft", "published", "archived"]),
  price: z.coerce.number().min(1, "Price must be greater than 0"),
  images: z.array(z.string()).min(1, "At least one image is required"),
  category: z.enum(["cosmetics", "perfume", "beauty"]),
  isFeatured: z.boolean().optional(),
});

export const bannerSchema = z.object({
  title: z.string().min(1, "Title is required"),
  titleAr: z.string().min(1, "Arabic title is required").optional(),
  imageString: z.string().min(1, "Image is required"),
});
