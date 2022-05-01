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

describe("Basic sequalize Test", function () {
  it("Should work", async () => {
    try {
      await sequelize.authenticate();
    } catch (err) {
      console.error(err);
    }
  });
});

describe("Basic searcher", function () {
  it("Make a Searcher", async () => {
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

describe("Send a message from a searcher", () => {
  it("Make a Searcher", async () => {
    await Searcher.sync({ force: true });
    await Message.sync({ force: true });
    const user = await Searcher.create({
      name: "John",
      password: "password",
      email: "email@example.com",
      about: "example",
      searchTime: 2000,
    });
    const message = await Message.create({
      body: "Hello Aaryan!",
    });
    await user.addMessage(message);
    await message.addSearcher(user);
    const result = await Searcher.findOne({
      where: { id: user.id },
      include: Message,
    });
    const result1 = await Message.findOne({
      where: { id: result.Messages[0].id },
      include: Searcher,
    });
    assert.isObject(result1, "Eerror in Message:User relationship");
  });

  describe("Making a full fledged Searcher", () => {
    it("Making New Searcher...", async () => {
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
});
