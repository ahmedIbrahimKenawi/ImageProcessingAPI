import { Request, Response, NextFunction } from "express";
import { createReadStream } from "fs";
import { readdir } from "fs/promises";
import processBySharp from "./utilities/processBySharp";
import save from "./utilities/save";

function validateQueryParameters(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { fileName, width, height } = req.query;

  if (fileName && Number(width) && Number(height)) {
    next();
  } else {
    throw new Error("NON valid QueryParameters");
  }
}

async function doesImageExist(req: Request, res: Response, next: NextFunction) {
  const fileName = String(req.query.fileName);

  const fullDir = await readdir("./assets/full");

  if (fullDir.includes(fileName)) {
    next();
  } else {
    next(new Error("the image does not exist"));
  }
}

async function doesthumbnailExist(
  req: Request,
  res: Response,
  next: NextFunction
) {
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
  const fileName = String(req.query.fileName);
  const width = Number(req.query.width);
  const height = Number(req.query.height);

  const thumbnail = `${width}-${height}-${fileName}`;

  // process the image
  const newImageStream = processBySharp(fileName, width, height);

  // save thumbnail to file system
  save(newImageStream, thumbnail);

  // send thumbnail to client
  newImageStream.pipe(res);
}

export {
  validateQueryParameters,
  doesImageExist,
  doesthumbnailExist,
  imageProcessing,
};
