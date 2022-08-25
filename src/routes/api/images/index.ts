import { Router } from "express";

import cors from "cors";

import {
  validateQueryParameters,
  doesImageExist,
  doesthumbnailExist,
  imageProcessing,
} from "../../../controller/imageProcessing";

const images: Router = Router();

images.use(cors());

images.get(
  "/",
  validateQueryParameters,
  doesImageExist,
  doesthumbnailExist,
  imageProcessing
);

export default images;
