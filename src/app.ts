import express, { Application } from "express";
import router from "./routes/router";
import { Request, Response } from "express";

const app: Application = express();
const port = "3030";

app.use(router);

app.use((err: Error, req: Request, res: Response, next: Function) => {
  console.error(err.stack);
  res.status(500).send(err.message);
  next();
});

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});

export default app;
