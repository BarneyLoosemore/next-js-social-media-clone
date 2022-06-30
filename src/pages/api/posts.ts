import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../db/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const posts = await prisma.post.findMany();
  res.json(posts);
}
