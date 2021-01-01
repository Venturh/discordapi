const express = require("express")
require("dotenv").config();
const { Client,  } = require("discord.js");
const bot = new Client();

const { log } = require("console");

const token = process.env.BOT_TOKEN;
const PREFIX = "!";

bot.on("ready", () => {
  console.log("ready");
  bot.user.setPresence({
    activity: { name: `${bot.users.cache.size} Pepegas`, type: "WATCHING" },
    status: "online",
  });
  // log(bot.users.cache.get('302595184271687681').presence)
});




const app = express();

app.get('/presence', (req, res) => {
  return res.send((bot.users.cache.get('302595184271687681').presence));
});

app.listen(process.env.PORT, () =>
{
bot.login(token);
console.log(`Server started at ${process.env.PORT}!`);
});
