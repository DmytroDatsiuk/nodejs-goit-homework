const mongoose = require("mongoose");

const app = require("./app");
//* g9X$J5M5C.Ry6Bx

const DB_HOST =
  "mongodb+srv://Dmytro:g9X$J5M5C.Ry6Bx@dimbedb.azhtf6n.mongodb.net/my_contacts?retryWrites=true&w=majority";

mongoose
  .connect(DB_HOST)
  .then(app.listen(3000))
  .catch((e) => {
    console.log(e.message);
    process.exit(1);
  });
