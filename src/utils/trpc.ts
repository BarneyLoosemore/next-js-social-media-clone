import { createReactQueryHooks } from "@trpc/react";
import { inferProcedureOutput } from "@trpc/server";
import type { AppRouter } from "backend/router";

export const trpc = createReactQueryHooks<AppRouter>();

// Helper types utils
type TQuery = keyof AppRouter["_def"]["queries"];
export type InferQueryOutput<TRouteKey extends TQuery> = inferProcedureOutput<
  AppRouter["_def"]["queries"][TRouteKey]
>;
