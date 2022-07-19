import { NextApiRequest, NextApiResponse } from "next";
import { uploadImage } from "utils/cloudinary";
import { getImage } from "utils/formidable";
import prisma from "../../db/client";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { image, text, authorId } = await getImage(req);
    const imageData = await uploadImage(image.path);

    const result = await prisma.post.create({
      data: {
        authorId,
        text,
        image: {
          create: {
            publicId: imageData.public_id,
            version: String(imageData.version),
            format: imageData.format,
          },
        },
      },
    });
    res.json(result);
  } catch (e: any) {
    console.warn(e);
    res.status(500).json({ error: e.message || "Something went wrong :(" });
  }
};

export default handler;
