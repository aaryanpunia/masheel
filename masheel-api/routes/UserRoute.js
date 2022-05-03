/**
 * A Router for Post routes related to the User.
 * @module PostUser
 * @author Aaryan Punia
 */

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { invalidUser } = require("../utils/Validate");
const { verify, sign } = require("../utils/Transformations");
const { authenticateToken } = require("../utils/Middleware");
/**
 * An endpoint that takes a post request and responds with successful/unsuccessful req.
 * @return {String}
 */
router.post("/", express.json({ type: "*/*" }), async (req, res) => {
  await User.sync();
  const inputUser = req.body;
  if (await invalidUser(inputUser)) {
    res.status(400).send("Invalid User!");
  } else if (await User.ifExists(inputUser.email)) {
    res.status(400).send("User already exists!");
  } else {
    try {
      const user = await User.createUserBasic(inputUser);
      res.status(200).send("User created successfully!");
    } catch (err) {
      res.status(400).send("User creation failed");
    }
  }
});

/**
 * An endpoint that is used to login a user. Sends a jsonwebtoken with the user's email and name as the payload.
 * @return {object} JWT
 */
router.get("/", express.json({ type: "*/*" }), async (req, res) => {
  await User.sync();
  const inputUser = req.body;
  if (!(await User.ifExists(inputUser.email))) {
    res.status(404).send("User not found!");
  } else {
    const password = await User.findPassword(inputUser.email);
    if (await verify(inputUser.password, password)) {
      const user = await User.findUserSecure(inputUser.email);
      return res.send(sign({ user }));
    } else {
      return res.status(403).send("Wrong email or password!");
    }
  }
});

/**
 * An endpoint that is used to update a user's details. Requires authentication.
 */
router.put(
  "/",
  express.json({ type: "*/*" }),
  authenticateToken,
  async (req, res) => {
    try {
      await User.updateUser(req.token.user.email, req.body);
      res.send("Successfully updated user");
    } catch (err) {
      res.status(400).send("Update failed: " + err.message);
    }
  }
);

module.exports = router;
