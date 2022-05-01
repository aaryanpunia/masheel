const express = require("express");
const app = express();
const sequelize = require("./models/Config");

const PORT = 3000;
app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Started up a server at Port: ${PORT}.`);
  }
});
