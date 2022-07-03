import * as trpc from "@trpc/server";
import { z } from "zod";

import { userValidator } from "backend/validators";

import { prisma } from "../../db/client";

export const usersRouter = trpc
  .router()
  .query("getAllUsers", {
    async resolve() {
      const users = await prisma.user.findMany({
        include: {
          posts: true,
        },
      });
      return {
        users,
      };
    },
  })
  .query("getUser", {
    input: z.number(),
    async resolve(req) {
      const user = await prisma.user.findUnique({ where: { id: req.input } });
      return { user };
    },
  })
  .mutation("createUser", {
    input: userValidator,
    async resolve(req) {
      return await prisma.user.create({ data: req.input });
    },
  });
