const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

dotenv.config();

mongoose
  .connect("mongodb://localhost:27019/Social-media", {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("DB connection established");
  });

app.listen(3005, () => {
  console.log("Server listening on port 3005");
});
