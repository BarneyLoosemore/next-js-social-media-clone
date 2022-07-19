const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export function uploadImage(image: string): Promise<{
  public_id: string;
  version: number;
  format: string;
}> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      image,
      { width: 400, height: 300, crop: "fill" },
      (
        err: Error,
        res: {
          public_id: string;
          version: number;
          format: string;
        }
      ) => {
        if (err) reject(err);
        resolve(res);
      }
    );
  });
}
