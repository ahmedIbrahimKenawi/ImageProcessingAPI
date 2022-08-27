import { createWriteStream, WriteStream } from "fs";
import { Duplex } from "stream";

function save(newImageStream: Duplex, thumbnail: string): WriteStream {
  const thumbnailWriteStream: WriteStream = createWriteStream(
    `./assets/thumbnail/${thumbnail}`
  );

  newImageStream.pipe(thumbnailWriteStream);

  return thumbnailWriteStream;
}

export default save;
