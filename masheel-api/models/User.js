/**
 * A Schema to represent a User.
 * @module User
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

const User = sequelize.define("User", {
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

User.beforeCreate(async (user, options) => {
  const hashedPassword = await encrypt(user.password);
  user.password = hashedPassword;
});

/**
 * Defines foreign keys for @module User.
 */
User.hasMany(Experience);
Experience.belongsTo(User);
User.hasMany(Recommendation);
Recommendation.belongsTo(User);
User.hasOne(Requirement);
Requirement.belongsTo(User);
User.hasMany(Message, {
  foreignKey: "senderId",
  as: "OutgoingMessages",
});

User.hasMany(Message, {
  foreignKey: "receiverId",
  as: "IncomingMessages",
});
Message.belongsTo(User, {
  foreignKey: "senderId",
  as: "Sender",
});
Message.belongsTo(User, {
  foreignKey: "receiverId",
  as: "Receiver",
});

/**
 * @method findByEmail
 * @param {string} userEmail Email of user to be found.
 * @return {Object} User if found else returns null.
 */
User.findByEmail = async function (userEmail) {
  const user = await User.findOne({
    where: { email: userEmail },
    include: [Experience, Requirement, "OutgoingMessages", "IncomingMessages"],
  });
  return user;
};

/**
 * Constructs User without associations.
 * @param {Object} user
 * @return {Object}
 */
User.createUserBasic = async function (user) {
  try {
    const result = await User.create({
      name: user.name,
      password: user.password,
      email: user.email,
      profilePicture: user.profilePicture,
      about: user.about,
      searchTime: user.searchTime,
      sectorPreference: user.sectorPreference,
    });
    return result;
  } catch (err) {
    console.error(err);
  }
};

/**
 * Constructs User with associations,
 * @param {Object} User
 * @return {Object}
 */
User.createUserDetailed = async function (user) {
  try {
    const result = await User.createUserBasic(user);
    const experiences = user.experiences;
    for (let i = 0; i < experiences.length; i++) {
      var experience = await Experience.create({
        typeOf: user.experiences[i].typeOf,
        name: user.experiences[i].name,
        description: user.experiences[i].description,
        time: user.experiences[i].time,
      });
      await result.addExperience(experience);
    }
    const requirement = await Requirement.create({
      total: user.requirement.total,
      breakdown: user.requirement.breakdown,
    });
    await result.setRequirement(requirement);
    return result;
  } catch (err) {
    console.error(err);
  }
};

/**
 * Checks if user with @param Email exists.
 * @return {boolean}
 */
User.ifExists = async function (userEmail) {
  const result = await User.findOne({ where: { email: userEmail } });
  return result != null;
};

/**
 * Returns user password from @param Email iff @method ifExists returns true.
 * @return {string} password
 */
User.findPassword = async function (userEmail) {
  if (!(await User.ifExists(userEmail))) {
    throw new Error("User does not exist");
  } else {
    const result = await User.findByEmail(userEmail);
    return result.password;
  }
};

/**
 * Updates user iff @method ifExists returns true. All params in @param user are optional.
 * @param {string} userEmail
 * @param {object} updates has to be of the format [{set: param, as: value}]
 * @return {null}
 */
User.updateUser = async function (userEmail, updates) {
  if (!(await User.ifExists(userEmail))) {
    throw new Error("User does not exist");
  } else if (
    updates.length == 0 ||
    updates[0].set == null ||
    updates[0].as == null
  ) {
    throw new Error("Incorrect updates format");
  } else {
    for (i = 0; i < updates.length; i++) {
      await User.update(
        { [updates[i].set]: updates[i].as },
        {
          where: {
            email: userEmail,
          },
        }
      );
    }
  }
};

/**
 * Creates a message and sends it to User with email @param userEmail iff @method ifExists returns true.
 * @param {string} userEmail
 * @param {Object} sendThisMessage See schema in Message.js for details.
 * @param {string} receiverEmail
 * @alias User.sendMessage
 */
User.sendMessage = async function (userEmail, sendThisMessage, receiverEmail) {
  if (
    !(await User.ifExists(userEmail)) ||
    !(await User.ifExists(receiverEmail))
  ) {
    throw new Error("Sender or receiver does not exist");
  } else {
    const message = await Message.create(sendThisMessage);
    const sender = await User.findByEmail(userEmail);
    const receiver = await User.findByEmail(receiverEmail);
    await message.setSender(sender);
    await message.setReceiver(receiver);
  }
};

/**
 * @param {String} receiverEmail
 * @param {String} senderEmail
 * @return {conversationSorted}, an array of format [{message}...] sorted by Time of creation.
 */
User.findConversation = async function (senderEmail, receiverEmail) {
  const sender = await User.findByEmail(senderEmail);
  const receiver = await User.findByEmail(receiverEmail);
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
 * @param {String} userEmail Email of User.
 * @param {String} password Input password.
 * @returns {boolean}
 */
User.verifyPassword = async function (userEmail, password) {
  const user = await User.findByEmail(userEmail);
  const originalPass = user.password;
  return await verify(password, originalPass);
};

/**
 * Securely returns a User's information for client side use.
 * @param {string} userEmail
 * @return {object} user iff @method ifExists returns true. else returns null.
 */
User.findUserSecure = async function (userEmail) {
  if (!(await User.ifExists)) {
    throw new Error("User not found");
  } else {
    var result = {};
    const user = (await User.findByEmail(userEmail)).toJSON();
    for (const [key, value] of Object.entries(user)) {
      if (key != ["password"]) {
        result[key] = value;
      }
    }
    return result;
  }
};

module.exports = User;
