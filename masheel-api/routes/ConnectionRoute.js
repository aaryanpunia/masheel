/**
 * A Router for all Connection related endpoints.
 * @author Aaryan Punia
 * @module MessageRoute
 */

const express = require("express");
const router = express.Router();
const User = require("../models/User");

/**
 * Returns all the connections of the current user.
 * @return {object} All the connections of the current user.
 */
router.get("/", express.json({ type: "*/*" }), async (req, res) => {
  try {
    const connections = await User.findConnections(req.token.user.email);
    res.json(connections);
  } catch (err) {
    res.status(404).send("Failed to find connections: " + err.message);
  }
});

/**
 * A POST endpoint to send connection requests to other users.
 * @param {object} req.body has to be of the form {receiver: {string} email}
 */
router.post("/", express.json({ type: "*/*" }), async (req, res) => {
  try {
    await User.sendConnectionRequest(req.token.user.email, req.body.receiver);
    res.status(200).send("Successfully sent connection request!");
  } catch (err) {
    res.status(404).send("Failed to send connection request: " + err.message);
  }
});

module.exports = router;
