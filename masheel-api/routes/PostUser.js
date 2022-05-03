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

/**
 * An endpoint that takes a post request and responds with successful/unsuccessful req.
 * @return {String}
 */
router.post("/signup", express.json({ type: "*/*" }), async (req, res) => {
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
router.post("/login", express.json({ type: "*/*" }), async (req, res) => {
  await User.sync();
  const inputUser = req.body;
  if (!(await User.ifExists(inputUser.email))) {
    res.status(404).send("User not found!");
  } else {
    const password = await User.findPassword(inputUser.email);
    if (await verify(inputUser.password, password)) {
      return res.send(sign({ email: inputUser.email }));
    } else {
      return res.status(403).send("Wrong email or password!");
    }
  }
});

module.exports = router;
