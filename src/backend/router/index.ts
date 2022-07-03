import * as trpc from "@trpc/server";

import { postsRouter } from "./posts";
import { usersRouter } from "./users";

export const appRouter = trpc.router().merge(postsRouter).merge(usersRouter);

export type AppRouter = typeof appRouter;
