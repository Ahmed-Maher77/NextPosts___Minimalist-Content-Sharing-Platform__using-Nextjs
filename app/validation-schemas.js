import { z } from "zod";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024;

export const createPostSchema = z.object({
    title: z
        .string()
        .min(3, "Post title must be at least 3 characters")
        .max(300),
    image: z
        .any()
        .refine((val) => val != null && val !== "", "Image is required")
        .refine((val) => ALLOWED_TYPES.includes(val.type), "Image must be JPEG, PNG, or WebP")
        .refine((val) => val.size <= MAX_SIZE, "Image must be under 5MB"),
    content: z
        .string()
        .min(10, "Post content must be at least 10 characters")
        .max(1000, "Post content must be at most 1000 characters"),
});
