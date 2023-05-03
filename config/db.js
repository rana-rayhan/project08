require("dotenv").config();
const { default: mongoose } = require("mongoose");

mongoose
  .connect(process.env.USER_MONGODB)
  .then(() => {
    console.log("DB is connected");
  })
  .catch((error) => {
    console.log("Errorn in mongo connection");
    console.log(error);
  });
