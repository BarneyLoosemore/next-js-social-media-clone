import { z } from "zod";

export const userValidator = z.object({
  email: z.string().min(3).max(30).email(),
  password: z.string().min(3).max(30),
});
