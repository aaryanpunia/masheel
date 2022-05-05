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
 * @param {object} req.body must be a JSON of the format [{"body":body}, {"receiver":receiverEmail}].
 */
router.post("/", express.json({ type: "*/*" }), async (req, res) => {
  try {
    await User.sendMessage(
      req.token.user.email,
      req.body[0],
      req.body[1].receiver
    );
    res.status(200).send("Message successfully sent");
  } catch (err) {
    res.status(400).send("Messaging unsuccessful: " + err.message);
  }
});

module.exports = router;
