const express = require("express");
const app = express();
const { authenticateToken } = require("./utils/Middleware");

/**
 * Import routes.
 */
const userRoute = require("./routes/UserRoute");
const messageRoute = require("./routes/MessageRoute");
const resetRoute = require("./routes/ResetRoute");
app.use("/user", userRoute);
app.use("/message", authenticateToken, messageRoute);
app.use("/reset", resetRoute);
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
