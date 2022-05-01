const { DataTypes } = require("sequelize");
const sequelize = require("./Config");

const Requirement = sequelize.define("Requirement", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  total: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  breakdown: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
});

module.exports = Requirement;
