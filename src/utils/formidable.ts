import { File, IncomingForm } from "formidable";
import { NextApiRequest } from "next";

export async function getImage(formData: NextApiRequest) {
  const data = (await new Promise(function (resolve, reject) {
    const form = new IncomingForm({ keepExtensions: true });
    form.parse(formData, function (err, fields, files) {
      if (err) return reject(err);
      resolve({ fields, files });
    });
    // formidable, Promises and TS not playing nicely :(
  })) as { fields: any; files: any };

  return {
    image: data.files.image as File & { path: string },
    text: data.fields.text as string,
    authorId: data.fields.authorId as string,
  };
}
