import * as trpc from "@trpc/server";
import { z } from "zod";
import { postValidator } from "backend/validators";
import { prisma } from "../../db/client";

export const postsRouter = trpc
  .router()
  .query("getAllPosts", {
    async resolve() {
      const posts = await prisma.post.findMany({
        include: {
          author: true,
        },
      });
      return {
        posts,
      };
    },
  })
  .query("getPost", {
    input: z.string(),
    async resolve(req) {
      const post = await prisma.post.findUnique({ where: { id: req.input } });
      return { post };
    },
  })
  .mutation("createPost", {
    input: postValidator,
    async resolve(req) {
      return await prisma.post.create({ data: req.input });
    },
  });
