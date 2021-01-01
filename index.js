require('dotenv').config()
const express = require('express')
const { Client } = require('discord.js')

const app = express()

app.get('/presence', async (req, res) => {
  const bot = new Client()
  const token = process.env.BOT_TOKEN
  await bot.login(token)
  const presence = bot.users.cache.get('302595184271687681').presence

  if (presence) {
    if (presence.status === 'offline') return res.send({ info: 'Offline' })
    else {
      if (presence.activities.length > 0) return res.send(presence.activities)
      else return res.send({ info: 'NO ACTIVITY' })
    }
  } else return res.send({ info: 'Error' })
})

app.listen(process.env.PORT, () => {
  console.log(`Server started at ${process.env.PORT}!`)
})
