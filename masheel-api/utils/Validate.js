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

const userNotNull = (searcher) => {
  assert.isNotNull(searcher.name, "Searcher name is null");
  assert.isNotNull(searcher.email, "Searcher email is null");
  assert.isNotNull(searcher.password, "Searcher password is null");
  assert.isNotNull(searcher.profilePicture, "Searcher profilePicture is null");
  assert.isNotNull(searcher.about, "Searcher about is null");
  assert.isNotNull(searcher.searchTime, "Searcher searchTime is null");
  assert.isNotNull(
    searcher.sectorPreference,
    "Searcher sectorPreference is null"
  );
};

module.exports = { validateEmail, userNotNull };
