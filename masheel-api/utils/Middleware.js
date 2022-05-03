/**
 * Module containing all the Middleware functions used by Masheel.
 * @module Middleware
 * @author Aaryan Punia
 */
const jwt = require("jsonwebtoken");

/**
 * A middleware authnetications function that verifies JWTs.
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {null} adds user's email to the current request.
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN_SECRET, (err, token) => {
    if (err) {
      return res.sendStatus(403);
    }

    req.token = token;

    next();
  });
}

module.exports = { authenticateToken };
