/**
 * @module Transformations
 * @author Aaryan Punia
 */
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
dotenv.config();

/**
 * Encrypts password using Bcrypt.
 * @param {String} password
 * @return {String}
 */
async function encrypt(password) {
  try {
    const salt = await bcrypt.genSalt();
    const result = await bcrypt.hash(password, salt);
    return result;
  } catch (err) {
    console.error(err);
  }
}

/**
 * Verifies if input password is correct.
 * @param {String} input Input password (To be verified).
 * @param {String} password Password @param {String} input is compared against.
 * @returns {boolean}
 */
async function verify(input, password) {
  return await bcrypt.compare(input, password);
}

/**
 * Signs the payload with the TOKEN_SECRET and returns a JSONWEBTOKEN.
 * @param {object} payload
 * @returns {string}
 */
function sign(payload) {
  return jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: "1500s" });
}

module.exports = { encrypt, verify, sign };
