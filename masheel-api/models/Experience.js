const { DataTypes } = require("sequelize");
const sequelize = require("./Config");

const Experience = sequelize.define("Experience", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  typeOf: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
  time: {
    type: DataTypes.DATE,
  },
});

module.exports = Experience;
