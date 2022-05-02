/**
 * A full suite of tests for all Schemas in Masheel.
 * @author Aaryan Punia
 */
const assert = require("chai").assert;
const sequelize = require("../models/Config");
const Experience = require("../models/Experience");
const Investor = require("../models/Investor");
const Message = require("../models/Message");
const Recommendation = require("../models/Recommendation");
const Requirement = require("../models/Requirement");
const Searcher = require("../models/Searcher");
const { searcherNotNull } = require("../utils/Validate");

describe("Basic sequalize Test", function () {
  it("Should work", async function () {
    try {
      await sequelize.authenticate();
    } catch (err) {
      console.error(err);
    }
  });
});

describe("Basic searcher", function () {
  it("Make a Searcher", async function () {
    await Searcher.sync({ force: true });
    const user = await Searcher.create({
      name: "aaryan",
      password: "aaryanpunia",
      email: "aaryanpunia@gmail.com",
      about: "I like coca cola and Value Investing",
      searchTime: 2000,
    });
    const found = await Searcher.findOne({ where: { name: "aaryan" } });
    assert.typeOf(found, "object", "Searcher.create does not return an object");
    assert.equal(
      found.name,
      "aaryan",
      "Searcher.create does not return correct name upon query."
    );
    console.log(found.toJSON());
  });
});

describe("Basic investor", function () {
  it("Make an Investor", async function () {
    await Investor.sync({ force: true });
    const user = await Investor.create({
      name: "John",
      password: "password",
      email: "email@example.com",
      about: "about",
    });
    const found = await Investor.findOne({
      where: { name: "John", password: "password" },
    });
    assert.typeOf(found, "object", "Investor.create does not make an object");
    assert.equal(found.name, "John", "Investor has wrong name");
  });
});

describe("Making a full fledged Searcher", function () {
  it("Making New Searcher...", async function () {
    await Searcher.sync({ force: true });
    await Requirement.sync({ force: true });
    await Experience.sync({ force: true });
    const user = await Searcher.create({
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

    const result = await Searcher.findByEmail("idontdocoffee@gmail.com");
    console.log(result.toJSON());
  });
});

describe("Test 6: Searcher.createSearcherBasic", function () {
  it("create searcher and validate", async function () {
    await Searcher.sync({ force: true });
    await Requirement.sync({ force: true });
    await Experience.sync({ force: true });
    const searcher = await Searcher.createSearcherBasic({
      name: "Aaryan Punia",
      email: "aaryanpunia@gmail.com",
      password: "password",
      profilePicture: "profile picture",
      about: "about",
      searchTime: 2000,
      sectorPreference: "sector preference",
    });
    searcherNotNull(searcher);
  });
});

describe("Test 7: Searcher.createSearcherDetailed", function () {
  it("create searcher and validate", async function () {
    await Searcher.sync({ force: true });
    await Requirement.sync({ force: true });
    await Experience.sync({ force: true });
    const searcher = await Searcher.createSearcherDetailed({
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
    const result = await Searcher.findByEmail(searcher.email);
    searcherNotNull(result);
  });
});

describe("Test 8: Same searcher created again", function () {
  it("Make searcher 1", async function () {
    await Searcher.sync({ force: true });
    const searcher = await Searcher.createSearcherBasic({
      name: "Aaryan Punia",
      email: "aaryanpunia@gmail.com",
      password: "password",
      profilePicture: "profile picture",
      about: "about",
      searchTime: 2000,
      sectorPreference: "sector preference",
    });
    const check = await Searcher.ifExists("lund");
    const check1 = await Searcher.ifExists(searcher.email);
    assert.isFalse(check, "Returned true on fake email");
    assert.isNotFalse(check1, "Returned false on real email");
  });
});

describe("Test 9: get searcher password", function () {
  it("Make searcher", async function () {
    await Searcher.sync({ force: true });
    const searcher = await Searcher.createSearcherBasic({
      name: "Aaryan Punia",
      email: "aaryanpunia@gmail.com",
      password: "password",
      profilePicture: "profile picture",
      about: "about",
      searchTime: 2000,
      sectorPreference: "sector preference",
    });
    const pass = await Searcher.findPassword(searcher.email);
    assert.equal(pass, searcher.password, "passwords are not equal");
    console.log(pass);
  });
});

describe("Test 10: update Searcher", function () {
  it("Make searcher", async function () {
    await Searcher.sync({ force: true });
    const searcher = await Searcher.createSearcherBasic({
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
    await Searcher.updateSearcher(searcher.email, updates);
    const result = await Searcher.findByEmail(searcher.email);
    assert.equal(result.password, "new password", "Password was not updated!");
  });
});

describe("Test 11: send message between two searchers", function () {
  it("Make two searchers and send message", async function () {
    await Searcher.sync({ force: true });
    await Message.sync({ force: true });
    const sender = await Searcher.createSearcherBasic({
      name: "Aaryan Punia",
      email: "aaryanpunia@gmail.com",
      password: "password",
      profilePicture: "profile picture",
      about: "about",
      searchTime: 2000,
      sectorPreference: "sector preference",
    });
    const receiver = await Searcher.create({
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
    await Searcher.sendMessage(sender.email, message, receiver.email);
    const result = await Searcher.findByEmail(sender.email);
    const result1 = await Searcher.findByEmail(receiver.email);
    console.log(result.toJSON());
    console.log(result1.toJSON());
  });
});

describe("Find conversation", function () {
  it("Make and find", async function () {
    await Searcher.sync({ force: true });
    await Message.sync({ force: true });
    const sender = await Searcher.createSearcherBasic({
      name: "Warren Buffet",
      email: "aaryanpunia@gmail.com",
      password: "password",
      profilePicture: "profile picture",
      about: "about",
      searchTime: 2000,
      sectorPreference: "sector preference",
    });
    const receiver = await Searcher.create({
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
        await Searcher.sendMessage(sender.email, messages[i], receiver.email);
      } else {
        await Searcher.sendMessage(receiver.email, messages[i], sender.email);
      }
    }
    const conversation = await Searcher.findConversation(
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
    await Searcher.sync({ force: true });
    const sender = await Searcher.createSearcherBasic({
      name: "Warren Buffet",
      email: "aaryanpunia@gmail.com",
      password: "password",
      profilePicture: "profile picture",
      about: "about",
      searchTime: 2000,
      sectorPreference: "sector preference",
    });
    assert.isTrue(
      await Searcher.verifyPassword(sender.email, "password"),
      "Returns false for correct password"
    );
    assert.isFalse(
      await Searcher.verifyPassword(sender.email, sender.email),
      "Returns true for incorrect password"
    );
  });
});
