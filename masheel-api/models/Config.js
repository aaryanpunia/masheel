const dotenv = require("dotenv");
const Sequelize = require("sequelize");

dotenv.config();

const sequelize = new Sequelize(process.env.POSTGRESURL, {
  logging: false,
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to Database successfully!");
  } catch (err) {
    console.error(err);
  }
})();

module.exports = sequelize;
