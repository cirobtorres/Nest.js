import { createReadStream } from "fs";
import { ReadStream } from "typeorm/platform/PlatformTools";

export const getFileToBuffer = (filename: string) => {
  const readStream = createReadStream(filename);
  const chunks = [];
  return new Promise<{ buffer: Buffer; stream: ReadStream }>(
    (resolve, reject) => {
      readStream.on("data", (chunk) => chunks.push(chunk));
      readStream.on("error", (error) => reject(error));
      readStream.on("close", () => {
        resolve({
          buffer: Buffer.concat(chunks) as Buffer,
          stream: readStream,
        });
      });
    }
  );
};
