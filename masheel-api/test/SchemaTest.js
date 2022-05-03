/**
 * A full suite of tests for all Schemas in Masheel.
 * @author Aaryan Punia
 */
const assert = require("chai").assert;
const sequelize = require("../models/Config");
const Experience = require("../models/Experience");
const Message = require("../models/Message");
const Recommendation = require("../models/Recommendation");
const Requirement = require("../models/Requirement");
const User = require("../models/User");
const { userNotNull } = require("../utils/Validate");

describe("Basic sequalize Test", function () {
  it("Should work", async function () {
    try {
      await sequelize.authenticate();
    } catch (err) {
      console.error(err);
    }
  });
});

describe("Basic User", function () {
  it("Make a User", async function () {
    await User.sync({ force: true });
    const user = await User.create({
      name: "aaryan",
      password: "aaryanpunia",
      email: "aaryanpunia@gmail.com",
      about: "I like coca cola and Value Investing",
      searchTime: 2000,
    });
    const found = await User.findOne({ where: { name: "aaryan" } });
    assert.typeOf(found, "object", "User.create does not return an object");
    assert.equal(
      found.name,
      "aaryan",
      "User.create does not return correct name upon query."
    );
    assert.equal(found.name, user.name, "Find returns incorrect user!");
  });
});

describe("Making a full fledged User", function () {
  it("Making New User...", async function () {
    await User.sync({ force: true });
    await Requirement.sync({ force: true });
    await Experience.sync({ force: true });
    const user = await User.create({
      name: "Shreyaansh Chhabra",
      email: "idontdocoffee@gmail.com",
      password: "valueinvestor4lyf",
      about:
        "Hi, I'm a rising sophomore at UC Berkeley studying economics. My interests include public markets investing, standup comedy, and rap music.\n I have interned at Berkshire Hathaway as an Investment Analyst focusing on fundamentals-driven public equities \n I am working towards a B.A. in Economics at UC Berkeley \n For recommendations, don't hesitate to get in touch with Mr. Warren Buffet (CEO of Berkshire Hathaway) or Mr. Charlie Munger (Vice President of Berkshire Hathaway)\n",
      searchTime: 36,
      sectorPreference: "Physical Security and Video Surveillance",
    });
    const requirement = await Requirement.create({
      total: 500000,
      breakdown: {
        salary: 150000,
        expenses: 100000,
      },
    });
    const berkeley = await Experience.create({
      name: "University of California, Berkeley",
      typeOf: "Education",
      description: "I studied for x years blah blah",
      time: Date.now(),
    });
    await user.addExperience(berkeley);
    await user.setRequirement(requirement);

    const result = await User.findByEmail("idontdocoffee@gmail.com");
  });
});

describe("Test 6: User.createUserBasic", function () {
  it("create User and validate", async function () {
    await User.sync({ force: true });
    await Requirement.sync({ force: true });
    await Experience.sync({ force: true });
    const user = await User.createUserBasic({
      name: "Aaryan Punia",
      email: "aaryanpunia@gmail.com",
      password: "password",
      profilePicture: "profile picture",
      about: "about",
      searchTime: 2000,
      sectorPreference: "sector preference",
    });
    userNotNull(user);
  });
});

describe("Test 7: User.createUserDetailed", function () {
  it("create User and validate", async function () {
    await User.sync({ force: true });
    await Requirement.sync({ force: true });
    await Experience.sync({ force: true });
    const user = await User.createUserDetailed({
      name: "Aaryan Punia",
      email: "aaryanpunia@gmail.com",
      password: "password",
      profilePicture: "profile picture",
      about: "about",
      searchTime: 2000,
      sectorPreference: "sector preference",
      experiences: [
        {
          typeOf: "experience",
          name: "experience",
          description: "experience description",
          time: Date.now(),
        },
        {
          typeOf: "education",
          name: "berkeley",
          description: "experience description",
          time: Date.now(),
        },
      ],
      requirement: {
        total: 500000,
        breakdown: {
          salary: 150000,
          expenses: 100000,
        },
      },
    });
    const result = await User.findByEmail(user.email);
    userNotNull(result);
  });
});

describe("Test 8: Same User created again", function () {
  it("Make User 1", async function () {
    await User.sync({ force: true });
    const user = await User.createUserBasic({
      name: "Aaryan Punia",
      email: "aaryanpunia@gmail.com",
      password: "password",
      profilePicture: "profile picture",
      about: "about",
      searchTime: 2000,
      sectorPreference: "sector preference",
    });
    const check = await User.ifExists("lund");
    const check1 = await User.ifExists(user.email);
    assert.isFalse(check, "Returned true on fake email");
    assert.isNotFalse(check1, "Returned false on real email");
  });
});

describe("Test 9: get User password", function () {
  it("Make User", async function () {
    await User.sync({ force: true });
    const user = await User.createUserBasic({
      name: "Aaryan Punia",
      email: "aaryanpunia@gmail.com",
      password: "password",
      profilePicture: "profile picture",
      about: "about",
      searchTime: 2000,
      sectorPreference: "sector preference",
    });
    const pass = await User.findPassword(user.email);
    assert.equal(pass, user.password, "passwords are not equal");
  });
});

describe("Test 10: update User", function () {
  it("Make User", async function () {
    await User.sync({ force: true });
    const user = await User.createUserBasic({
      name: "Aaryan Punia",
      email: "aaryanpunia@gmail.com",
      password: "password",
      profilePicture: "profile picture",
      about: "about",
      searchTime: 2000,
      sectorPreference: "sector preference",
    });
    const updates = [
      {
        set: "password",
        as: "new password",
      },
    ];
    await User.updateUser(user.email, updates);
    const result = await User.findByEmail(user.email);
    assert.equal(result.password, "new password", "Password was not updated!");
  });
});

describe("Test 11: send message between two Users", function () {
  it("Make two Users and send message", async function () {
    await User.sync({ force: true });
    await Message.sync({ force: true });
    const sender = await User.createUserBasic({
      name: "Aaryan Punia",
      email: "aaryanpunia@gmail.com",
      password: "password",
      profilePicture: "profile picture",
      about: "about",
      searchTime: 2000,
      sectorPreference: "sector preference",
    });
    const receiver = await User.create({
      name: "Shreyaansh Chhabra",
      email: "idontdocoffee@gmail.com",
      password: "password2",
      profilePicture: "profile picture",
      about: "about",
      searchTime: 2000,
      sectorPreference: "sector preference",
    });
    const message = {
      body: "Hello Shreyaansh",
    };
    await User.sendMessage(sender.email, message, receiver.email);
    const result = await User.findByEmail(sender.email);
    const result1 = await User.findByEmail(receiver.email);
  });
});

describe("Find conversation", function () {
  it("Make and find", async function () {
    await User.sync({ force: true });
    await Message.sync({ force: true });
    const sender = await User.createUserBasic({
      name: "Warren Buffet",
      email: "aaryanpunia@gmail.com",
      password: "password",
      profilePicture: "profile picture",
      about: "about",
      searchTime: 2000,
      sectorPreference: "sector preference",
    });
    const receiver = await User.create({
      name: "Shreyaansh Chhabra",
      email: "idontdocoffee@gmail.com",
      password: "password2",
      profilePicture: "profile picture",
      about: "about",
      searchTime: 2000,
      sectorPreference: "sector preference",
    });
    const messages = [
      { body: "Dear Mr. Chhabra, it's an honor to meet you in person" },
      { body: "The pleasure is mine, Mr. Buffett" },
      {
        body: "So when are you free to talk about BRK? I'd really like to see you run my business",
      },
      { body: "No problem Nigga. Just wire me sum money" },
      { body: "Okay Mr. Chhabra" },
    ];
    for (i = 0; i < messages.length; i++) {
      if (i % 2 == 0) {
        await User.sendMessage(sender.email, messages[i], receiver.email);
      } else {
        await User.sendMessage(receiver.email, messages[i], sender.email);
      }
    }
    const conversation = await User.findConversation(
      sender.email,
      receiver.email
    );
    for (i = 0; i < messages.length; i++) {
      assert.equal(
        conversation[i].body,
        messages[i].body,
        "Wrong order of messages"
      );
    }
  });
});

describe("Test password functions", function () {
  it("Make and compare password", async function () {
    await User.sync({ force: true });
    const sender = await User.createUserBasic({
      name: "Warren Buffet",
      email: "aaryanpunia@gmail.com",
      password: "password",
      profilePicture: "profile picture",
      about: "about",
      searchTime: 2000,
      sectorPreference: "sector preference",
    });
    assert.isTrue(
      await User.verifyPassword(sender.email, "password"),
      "Returns false for correct password"
    );
    assert.isFalse(
      await User.verifyPassword(sender.email, sender.email),
      "Returns true for incorrect password"
    );
  });
});

describe("Test secure find users", function () {
  it("Make and find users", async function () {
    await User.sync({ force: true });
    const sender = await User.createUserBasic({
      name: "Warren Buffet",
      email: "aaryanpunia@gmail.com",
      password: "password",
      profilePicture: "profile picture",
      about: "about",
      searchTime: 2000,
      sectorPreference: "sector preference",
    });
    const result = await User.findUserSecure(sender.email);
    console.log(result);
  });
});
