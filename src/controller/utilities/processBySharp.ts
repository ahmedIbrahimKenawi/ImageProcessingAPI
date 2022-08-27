import sharp from "sharp";
import { createReadStream, ReadStream } from "fs";
import { Duplex } from "stream";

function processBySharp(
  fileName: string,
  width: number,
  height: number
): Duplex {
  const fullImageReadStream: ReadStream = createReadStream(
    `./assets/full/${fileName}`
  );
  const modifier: Duplex = sharp().resize(Number(width), Number(height));
  return fullImageReadStream.pipe(modifier);
}

export default processBySharp;
