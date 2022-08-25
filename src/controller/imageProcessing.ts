import { Request, Response } from "express";
import sharp from "sharp";
import {
  createReadStream,
  createWriteStream,
  ReadStream,
  WriteStream,
} from "fs";
import { readdir } from "fs/promises";
import { Duplex } from "stream";

function validateQueryParameters(req: Request, res: Response, next: Function) {
  const { fileName, width, height } = req.query;

  if (fileName && Number(width) && Number(height)) {
    next();
  } else {
    throw new Error("NON valid QueryParameters");
  }
}

async function doesImageExist(req: Request, res: Response, next: Function) {
  let { fileName } = req.query;
  fileName = String(fileName);

  const fullDir = await readdir("./assets/full");

  if (fullDir.includes(fileName)) {
    next();
  } else {
    next(new Error("the image does not exist"));
  }
}

async function doesthumbnailExist(req: Request, res: Response, next: Function) {
  const { fileName, width, height } = req.query;

  const thumbnail = `${width}-${height}-${fileName}`;

  const thumbnailDir = await readdir("./assets/thumbnail");

  if (thumbnailDir.includes(thumbnail)) {
    createReadStream(`./assets/thumbnail/${thumbnail}`).pipe(res);
  } else {
    next();
  }
}

async function imageProcessing(req: Request, res: Response) {
  const { fileName, width, height } = req.query;

  const thumbnail = `${width}-${height}-${fileName}`;

  const fullImageReadStream: ReadStream = createReadStream(
    `./assets/full/${fileName}`
  );

  const thumbnailWriteStream: WriteStream = createWriteStream(
    `./assets/thumbnail/${thumbnail}`
  );

  const modifier: Duplex = sharp().resize(Number(width), Number(height));

  // process the image
  fullImageReadStream.pipe(modifier);

  // save thumbnail to file system
  modifier.pipe(thumbnailWriteStream);

  // send thumbnail to file system
  modifier.pipe(res);
}

export {
  validateQueryParameters,
  doesImageExist,
  doesthumbnailExist,
  imageProcessing,
};
