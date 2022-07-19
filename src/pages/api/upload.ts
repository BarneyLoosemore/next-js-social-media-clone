import { NextApiRequest, NextApiResponse } from "next";
import { uploadImage } from "utils/cloudinary";
import { getImage } from "utils/formidable";
import prisma from "../../db/client";

export const config = {
  api: {
    bodyParser: false,
  },
};

// This API route handles the upload of 4 types of post:
// 1. Text and an image, associated with a user
// 2. Text and no image, associated with a user
// 3. Text and an image, but not associated with a user / anonymous
// 4. Text and no image, but not associated with a user / anonymous
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { image, text, authorId } = await getImage(req);

    if (image) {
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
      return res.json(result);
    }

    const result = await prisma.post.create({
      data: {
        authorId,
        text,
      },
    });
    return res.json(result);
  } catch (e: any) {
    console.warn(e);
    return res
      .status(500)
      .json({ error: e.message || "Something went wrong :(" });
  }
};

export default handler;
