import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  name_ar: z.string().min(1, "Arabic name is required").optional(),
  description: z.string().min(1, "Description is required"),
  description_ar: z
    .string()
    .min(1, "Arabic description is required")
    .optional(),
  status: z.enum(["draft", "published", "archived"]),
  price: z.coerce.number().min(1, "Price must be greater than 0"),
  images: z.array(z.string()).min(1, "At least one image is required"),
  category: z.string().min(1, "Category is required"),
  isFeatured: z.boolean().optional(),
});

export const bannerSchema = z.object({
  title: z.string().min(1, "Title is required"),
  title_ar: z.string().min(1, "Arabic title is required").optional(),
  imageString: z.string().min(1, "Image is required"),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Category name (slug) is required"),
  title: z.string().min(1, "Display title is required"),
  title_ar: z.string().optional(),
  imageString: z.string().optional(),
});
