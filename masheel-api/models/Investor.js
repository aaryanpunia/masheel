const { DataTypes } = require("sequelize");
const sequelize = require("./Config");
const { validateEmail } = require("../utils/Validate");

const Investor = sequelize.define("Investor", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail(value) {
        if (!validateEmail(value)) {
          throw new Error("Invalid Email Address");
        }
      },
    },
  },
  about: {
    type: DataTypes.STRING(2600),
  },
  sectorPreference: {
    type: DataTypes.STRING,
  },
});

module.exports = Investor;
