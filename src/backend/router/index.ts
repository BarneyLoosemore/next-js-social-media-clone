import * as trpc from "@trpc/server";

import { postsRouter } from "./posts";

export const appRouter = trpc.router().merge(postsRouter);

export type AppRouter = typeof appRouter;
