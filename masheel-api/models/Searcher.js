/**
 * A Schema to represent a Searcher.
 * @module Searcher
 * @author Aaryan Punia
 */
const Experience = require("./Experience");
const Recommendation = require("./Recommendation");
const Requirement = require("./Requirement");
const Message = require("./Message");
const { DataTypes } = require("sequelize");
const sequelize = require("./Config");
const { validateEmail } = require("../utils/Validate");
const _ = require("lodash");
const { encrypt, verify } = require("../utils/Transformations");

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

Searcher.beforeCreate(async (searcher, options) => {
  const hashedPassword = await encrypt(searcher.password);
  searcher.password = hashedPassword;
});

/**
 * Defines foreign keys for @module Searcher.
 */
Searcher.hasMany(Experience);
Experience.belongsTo(Searcher);
Searcher.hasMany(Recommendation);
Recommendation.belongsTo(Searcher);
Searcher.hasOne(Requirement);
Requirement.belongsTo(Searcher);
Searcher.hasMany(Message, {
  foreignKey: "senderId",
  as: "OutgoingMessages",
});

Searcher.hasMany(Message, {
  foreignKey: "receiverId",
  as: "IncomingMessages",
});
Message.belongsTo(Searcher, {
  foreignKey: "senderId",
  as: "Sender",
});
Message.belongsTo(Searcher, {
  foreignKey: "receiverId",
  as: "Receiver",
});

/**
 * @method findByEmail
 * @param {string} searcherEmail Email of searcher to be found.
 * @return {Object} Searcher if found else returns null.
 */
Searcher.findByEmail = async function (searcherEmail) {
  const searcher = await Searcher.findOne({
    where: { email: searcherEmail },
    include: [Experience, Requirement, "OutgoingMessages", "IncomingMessages"],
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
 * @param {object} updates has to be of the format [{set: param, as: value}]
 * @return {null}
 */
Searcher.updateSearcher = async function (searcherEmail, updates) {
  if (!(await Searcher.ifExists(searcherEmail))) {
    throw new Error("Searcher does not exist");
  } else if (
    updates.length == 0 ||
    updates[0].set == null ||
    updates[0].as == null
  ) {
    throw new Error("Incorrect updates format");
  } else {
    for (i = 0; i < updates.length; i++) {
      await Searcher.update(
        { [updates[i].set]: updates[i].as },
        {
          where: {
            email: searcherEmail,
          },
        }
      );
    }
  }
};

/**
 * Creates a message and sends it to Searcher with email @param searcherEmail iff @method ifExists returns true.
 * @param {string} searcherEmail
 * @param {Object} sendThisMessage See schema in Message.js for details.
 * @param {string} receiverEmail
 * @alias Searcher.sendMessage
 */
Searcher.sendMessage = async function (
  searcherEmail,
  sendThisMessage,
  receiverEmail
) {
  if (
    !(await Searcher.ifExists(searcherEmail)) ||
    !(await Searcher.ifExists(receiverEmail))
  ) {
    throw new Error("Sender or receiver does not exist");
  } else {
    const message = await Message.create(sendThisMessage);
    const sender = await Searcher.findByEmail(searcherEmail);
    const receiver = await Searcher.findByEmail(receiverEmail);
    await message.setSender(sender);
    await message.setReceiver(receiver);
  }
};

/**
 * @param {String} receiverEmail
 * @param {String} senderEmail
 * @return {conversationSorted}, an array of format [{message}...] sorted by Time of creation.
 */
Searcher.findConversation = async function (senderEmail, receiverEmail) {
  const sender = await Searcher.findByEmail(senderEmail);
  const receiver = await Searcher.findByEmail(receiverEmail);
  const messages = _.union(
    sender.toJSON().OutgoingMessages,
    sender.toJSON().IncomingMessages
  );
  const conversation = _.filter(messages, function (message) {
    return message.receiverId == receiver.id || message.senderId == receiver.id;
  });
  const conversationSorted = _.sortBy(conversation, [
    function (o) {
      return o.timestamp;
    },
  ]);
  return conversationSorted;
};

/**
 * Verifies if password is correct.
 * @param {String} searcherEmail Email of Searcher.
 * @param {String} password Input password.
 * @returns {boolean}
 */
Searcher.verifyPassword = async function (searcherEmail, password) {
  const searcher = await Searcher.findByEmail(searcherEmail);
  const originalPass = searcher.password;
  return await verify(password, originalPass);
};

module.exports = Searcher;
