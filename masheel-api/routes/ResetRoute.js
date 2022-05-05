/**
 * A Router for all Reser related endpoints ONLY FOR DEBUGGING AND TESTING PURPOSES.
 * @author Aaryan Punia
 * @module MessageRoute
 */
const express = require("express");
const router = express.Router();
const sequelize = require("../models/Config");

router.get("/", async function (req, res) {
  try {
    await sequelize.sync({ force: true });
    res.send("Succesfully restet DB");
  } catch (err) {
    res.send(err.message);
  }
});

module.exports = router;
