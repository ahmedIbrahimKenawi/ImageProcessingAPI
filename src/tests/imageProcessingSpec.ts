import processBysharp from "../controller/utilities/processBySharp";
import save from "../controller/utilities/save";
import { readdirSync, unlinkSync } from "fs";

describe("is image processed and saved successfully?", () => {
  it("is image processed and saved successfully?", async () => {
    function isExist() {
      return readdirSync("./assets/thumbnail").includes("100-100-test.jpg");
    }

    // delete thumbnail from file system
    if (isExist()) {
      unlinkSync("assets/thumbnail/100-100-test.jpg");
    }

    // process image and save to file system
    await new Promise((resolve, reject) => {
      save(processBysharp("test.jpg", 100, 100), "100-100-test.jpg")
        .on("finish", () => {
          resolve("DONE");
        })
        .on("error", (err) => {
          reject(err);
        });
    });

    expect(isExist()).toBeTrue();
  });
});
