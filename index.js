require('dotenv').config()
const express = require('express')
var cors = require('cors')
const { Client } = require('discord.js')

const app = express()

var whitelist = ['http://localhost:3000', 'https://maxwerpers.me']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
}

app.get('/presence', cors(corsOptions), async (req, res) => {
  const bot = new Client()
  const token = process.env.BOT_TOKEN
  await bot.login(token)
  const activity = bot.users.cache.get('302595184271687681')
  console.log('🚀 ~ file: index.js ~ line 25 ~ app.get ~ activity', activity)
  if (activity === undefined) return res.send({ info: 'Error' })
  const presence = activity.presence

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
