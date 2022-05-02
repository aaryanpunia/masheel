/**
 * A Schema representing a message.
 * @relation Many to One with Searcher/Investor.
 * @author Aaryan Punia
 */

const { DataTypes } = require("sequelize");
const sequelize = require("./Config");

const Message = sequelize.define("Message", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  body: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Message;
