import { z } from "zod";

export const userValidator = z.object({
  name: z.string().min(3).max(15),
  password: z.string().min(3).max(15),
});

export const postValidator = z.object({
  createdAt: z.string(),
  title: z.string(),
  published: z.boolean(),
  authorId: z.string(),
});
