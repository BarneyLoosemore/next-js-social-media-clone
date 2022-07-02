import * as trpc from "@trpc/server";
import { z } from "zod";

import { prisma } from "../../db/client";

export const postsRouter = trpc
  .router()
  .query("getAllPosts", {
    async resolve() {
      const posts = await prisma.post.findMany();
      return {
        posts,
      };
    },
  })
  .query("getPost", {
    input: z.number(),
    async resolve(req) {
      const post = await prisma.post.findUnique({ where: { id: req.input } });
      const author = await prisma.user.findUnique({
        where: { id: post?.authorId },
      });
      return { post };
    },
  })
  .mutation("createPost", {
    input: z.object({
      id: z.number(),
      createdAt: z.string(),
      title: z.string(),
      published: z.boolean(),
      authorId: z.number(),
    }),
    async resolve(req) {
      // const author =
      return await prisma.post.create({ data: req.input });
    },
  });
