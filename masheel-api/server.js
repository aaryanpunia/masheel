const express = require("express");
const app = express();

/**
 * Import routes.
 */
const PostUser = require("./routes/PostUser");

app.use("/user", PostUser);

/**
 * 404 Route Handling.
 */
app.use((req, res, next) => {
  res
    .status(404)
    .send(
      "Ohh you are lost, read the API documentation to find your way back home :)"
    );
});

const PORT = 3000;
app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Started up a server at Port: ${PORT}.`);
  }
});
