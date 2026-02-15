import { z } from "zod";

export const listingSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().optional(),
  price: z.coerce.number().positive().optional(),
  area: z.coerce.number().positive().optional(),
  bedrooms: z.coerce.number().int().min(0).optional(),
  bathrooms: z.coerce.number().int().min(0).optional(),
  parking: z.coerce.number().int().min(0).optional(),
  type: z.string().optional(),
  forSale: z.boolean().default(true),
  content: z.string().optional(),
  image: z.string().url().optional().or(z.literal("")),
  photos: z.array(z.string()).optional(),
  agency: z.string().optional(),
  ref: z.string().optional(),
  link: z.url().optional().or(z.literal("")),
  published: z.boolean().default(false),
});

export type ListingFormValues = z.infer<typeof listingSchema>;

export const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type SignUpFormValues = z.infer<typeof signUpSchema>;
export type SignInFormValues = z.infer<typeof signInSchema>;
