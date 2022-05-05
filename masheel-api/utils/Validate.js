/***
 * A module of Validation utility methods.
 * @author: Aaryan Punia
 */
const assert = require("chai").assert;

/**
 * Email Regex, RFC 5322 Official Standard.
 */
const emailRegex =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

const validateEmail = (email) => {
  return email.match(emailRegex);
};

const userNotNull = (user) => {
  assert.isNotNull(user.name, "user name is null");
  assert.isNotNull(user.email, "user email is null");
  assert.isNotNull(user.password, "user password is null");
  assert.isNotNull(user.profilePicture, "user profilePicture is null");
  assert.isNotNull(user.about, "user about is null");
  assert.isNotNull(user.searchTime, "user searchTime is null");
  assert.isNotNull(user.sectorPreference, "user sectorPreference is null");
};
/**
 * Returns true iff @param user is invalid.
 * @param {object} user JSON object representing a user.
 */
const invalidUser = (user) => {
  return (
    Object.entries(user).length == 0 ||
    user.name == null ||
    user.email == null ||
    user.password == null ||
    user.searchTime == null
  );
};

const invalidUserLogin = (user) => {
  return (
    Object.entries(user).length == 0 ||
    user.password == null ||
    user.email == null
  );
};

module.exports = { validateEmail, userNotNull, invalidUser, invalidUserLogin };
