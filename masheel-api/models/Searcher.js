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
  profilePicture: {
    type: DataTypes.STRING,
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

/**
 * Utility Methods for @class Searcher
 */
Searcher.findByEmail = async function (searcherEmail) {
  const searcher = await Searcher.findOne({
    where: { email: searcherEmail },
    include: [Experience, Requirement],
  });
  return searcher;
};

/**
 * Constructs Searcher without associations.
 * @param {Object} searcher
 * @return {Object}
 */
Searcher.createSearcherBasic = async function (searcher) {
  try {
    const result = await Searcher.create({
      name: searcher.name,
      password: searcher.password,
      email: searcher.email,
      profilePicture: searcher.profilePicture,
      about: searcher.about,
      searchTime: searcher.searchTime,
      sectorPreference: searcher.sectorPreference,
    });
    console.log(result.toJSON());
    return result;
  } catch (err) {
    console.error(err);
  }
};

/**
 * Constructs Searcher with associations,
 * @param {Object} Searcher
 * @return {Object}
 */
Searcher.createSearcherDetailed = async function (searcher) {
  try {
    const result = await Searcher.createSearcherBasic(searcher);
    const experiences = searcher.experiences;
    for (let i = 0; i < experiences.length; i++) {
      var experience = await Experience.create({
        typeOf: searcher.experiences[i].typeOf,
        name: searcher.experiences[i].name,
        description: searcher.experiences[i].description,
        time: searcher.experiences[i].time,
      });
      await result.addExperience(experience);
    }
    const requirement = await Requirement.create({
      total: searcher.requirement.total,
      breakdown: searcher.requirement.breakdown,
    });
    await result.setRequirement(requirement);
    return result;
  } catch (err) {
    console.error(err);
  }
};

/**
 * Checks if searcher with @param Email exists.
 * @return {boolean}
 */
Searcher.ifExists = async function (searcherEmail) {
  const result = await Searcher.findOne({ where: { email: searcherEmail } });
  return result != null;
};

/**
 * Returns searcher password from @param Email iff @method ifExists returns true.
 * @return {string} password
 */
Searcher.findPassword = async function (searcherEmail) {
  if (!(await Searcher.ifExists(searcherEmail))) {
    throw new Error("Searcher does not exist");
  } else {
    const result = await Searcher.findByEmail(searcherEmail);
    return result.password;
  }
};

/**
 * Updates searcher iff @method ifExists returns true. All params in @param searcher are optional.
 * @param {string} searcherEmail
 * @param {object} updates
 * @return {object}
 */
Searcher.updateSearcher() = async function (searcherEmail, updates) {
  if (!(await Searcher.ifExists(searcherEmail))) {
    throw new Error("Searcher does not exist");
  } else {
    
  }
}

module.exports = Searcher;
