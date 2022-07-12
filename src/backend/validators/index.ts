import { z } from "zod";

export const userValidator = z.object({
  email: z.string().min(3).max(30).email(),
  password: z.string().min(3).max(30),
});

export const postValidator = z.object({
  createdAt: z.string(),
  title: z.string(),
  published: z.boolean(),
  authorId: z.string(),
});
