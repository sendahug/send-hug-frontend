const fs = require("fs");

fs.rmSync("./dist/", { recursive: true });
fs.mkdir("./dist", {}, (error) => console.log(error));
