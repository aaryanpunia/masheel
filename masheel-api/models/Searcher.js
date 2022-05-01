/**
 * A Schema to represent a Searcher.
 * @author Aaryan Punia
 */
const Experience = require("./Experience");
const Recommendation = require("./Recommendation");
const Requirement = require("./Requirement");
const Message = require("./Message");
const { DataTypes } = require("sequelize");
const sequelize = require("./Config");
const { validateEmail } = require("../utils/Validate");

const Searcher = sequelize.define("Searcher", {
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
  searchTime: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  sectorPreference: {
    type: DataTypes.STRING,
  },
});

Searcher.findByEmail = async function (searcherEmail) {
  const searcher = await Searcher.findOne({
    where: { email: searcherEmail },
    include: [Experience, Requirement],
  });
  return searcher;
};

/**
 * Defines foreign keys for @class Searcher.
 */
Searcher.hasMany(Experience);
Experience.belongsTo(Searcher);
Searcher.hasMany(Recommendation);
Recommendation.belongsTo(Searcher);
Searcher.hasOne(Requirement);
Requirement.belongsTo(Searcher);
Searcher.belongsToMany(Message, { through: "SearcherMessage" });
Message.belongsToMany(Searcher, { through: "SearcherMessage" });
//FIXME:

module.exports = Searcher;
