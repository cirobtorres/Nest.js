import { join } from "path";
import { getFileToBuffer } from "./file-get-file-to-buffer";

export const getFile = async () => {
  const { buffer, stream } = await getFileToBuffer(
    join(__dirname, "file-photo.png")
  );
  const file: Express.Multer.File = {
    fieldname: "file",
    originalname: "file-photo.png",
    encoding: "7bit",
    mimetype: "image/png",
    size: 1024 * 80,
    stream,
    destination: "",
    filename: "file-name",
    path: "file-path",
    buffer,
  };

  return file;
};
