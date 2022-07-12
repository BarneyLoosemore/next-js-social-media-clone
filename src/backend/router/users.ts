import * as trpc from "@trpc/server";
import { z } from "zod";
import { userValidator } from "backend/validators";
import prisma from "../../db/client";
import { hash } from "bcryptjs";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

export const usersRouter = trpc
  .router()
  .query("getAllUsers", {
    async resolve() {
      return await prisma.user.findMany({
        include: {
          posts: true,
        },
      });
    },
  })
  .query("getUser", {
    input: z.string(),
    async resolve(req) {
      return await prisma.user.findUnique({ where: { id: req.input } });
    },
  })
  .mutation("createUser", {
    input: userValidator,
    async resolve(req) {
      const hashedPassword = await hash(req.input.password, 12);
      const data = { ...req.input, password: hashedPassword };

      try {
        const user = await prisma.user.create({ data });
        return { user, userAlreadyExistsError: false };
      } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
          if (e.code === "P2002") {
            return { user: null, userAlreadyExistsError: true };
          }
        } else throw e;
      }
    },
  });
