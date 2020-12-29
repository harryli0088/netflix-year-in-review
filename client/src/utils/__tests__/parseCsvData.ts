import parseCsvData from "../parseCsvData"

const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "./", "example.csv");
const data = fs.readFileSync(file, "utf8", function(err: any, data: any) {
  return data;
});
console.log(data)
it("ignores Movies", () => {

})
