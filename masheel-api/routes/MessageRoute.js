/**
 * A Router for all Message related endpoints.
 * @author Aaryan Punia
 * @module MessageRoute
 */

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { route } = require("./UserRoute");

/**
 * A get endpoint for a collection of messages between two users.
 * @param {object} req.body must be a JSON of {"other":userEmail}
 */
router.get("/", express.json({ type: "*/*" }), async (req, res) => {
  try {
    const conversation = await User.findConversation(
      req.token.user.email,
      req.body.other
    );
    res.json(conversation);
  } catch (err) {
    res.status(400).send("Message search unsuccessful: " + err.message);
  }
});

/**
 * A post endpoint for messages.
 * @param {object} req.body must be a JSON of the format MESSAGE and @param receiver must be a connection of this user with status "accepted".
 * MESSAGE = {
 *  "body": body,
 *  "receiver": receiver's email address
 * }
 */
router.post("/", express.json({ type: "*/*" }), async (req, res) => {
  if (!(await User.ifConnection(req.token.user.email, req.body.receiver))) {
    return res
      .status(400)
      .send("Connect with user before sending them a message!");
  }
  try {
    await User.sendMessage(
      req.token.user.email,
      req.body.body,
      req.body.receiver
    );
    res.status(200).send("Message successfully sent");
  } catch (err) {
    res.status(400).send("Messaging unsuccessful: " + err.message);
  }
});

module.exports = router;
