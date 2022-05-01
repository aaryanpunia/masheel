const dotenv = require("dotenv");
const Sequelize = require("sequelize");

dotenv.config();

const sequelize = new Sequelize(
  `postgres://${process.env.USERNAME}:${process.env.PASSWORD}@${process.env.HOST}:${process.env.PORT}/${process.env.DBNAME}`
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to Database successfully!");
  } catch (err) {
    console.error(err);
  }
})();

module.exports = sequelize;
