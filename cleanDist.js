import fs from "fs";

fs.rmSync("./dist/", { recursive: true });
fs.mkdir("./dist", {}, (error) => console.log(error));
