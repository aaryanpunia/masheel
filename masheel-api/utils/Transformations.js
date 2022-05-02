/**
 * @module Transformations
 * @author Aaryan Punia
 */
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
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

module.exports = { encrypt, verify };
