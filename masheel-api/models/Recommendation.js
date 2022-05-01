const { DataTypes } = require("sequelize");
const sequelize = require("./Config");

const Recommendation = sequelize.define("Recommendation", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  Recommender: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Recommendation;
