require('dotenv').config()
const express = require('express')
var cors = require('cors')
const { Client } = require('discord.js')
const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
var updateLocale = require('dayjs/plugin/updateLocale')
dayjs.extend(updateLocale)
dayjs.extend(relativeTime)

const app = express()
const bot = new Client()
bot.login(process.env.BOT_TOKEN)

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

dayjs.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s elapsed',
    s: 'a few seconds',
    m: 'a minute',
    mm: '%d minutes',
    h: 'an hour',
    hh: '%d hours',
    d: 'a day',
    dd: '%d days',
    M: 'a month',
    MM: '%d months',
    y: 'a year',
    yy: '%d years',
  },
})

function makePresence(data) {
  return data.map((d) => {
    const type =
      d.name === 'Visual Studio Code'
        ? 'CODING IN'
        : d.type === 'LISTENING'
        ? `${d.type} TO`
        : d.type
    const currently = `${type} ${d.name.toUpperCase()}`
    const assetImage =
      d.name === 'Visual Studio Code'
        ? `https://cdn.discordapp.com/app-assets/383226320970055681/${d.assets.largeImage}.png`
        : d.name === 'Spotify'
        ? `https://i.scdn.co/image/${d.assets.largeImage.split(':')[1]}`
        : d.assets.largeImage

    const state =
      d.type === 'LISTENING' ? `by ${d.state.replace(';', ',')}` : d.state

    return {
      currently,
      details: d.details,
      state,
      time: dayjs().to(dayjs(d.timestamps.start)),
      imgUrl: assetImage,
    }
  })
}

app.get('/presence', cors(corsOptions), async (req, res) => {
  const activity = bot.users.cache.get('302595184271687681')

  if (activity === undefined) return new Error('Error')
  const presence = activity.presence

  if (presence) {
    if (presence.status === 'offline') return res.send({ info: 'Offline' })
    else {
      if (presence.activities.length > 0)
        return res.send({ presence: makePresence(presence.activities) })
      else return res.send({ info: 'NO ACTIVITY' })
    }
  } else return new Error('Error')
})

app.listen(process.env.PORT, () => {
  console.log(`Server started at ${process.env.PORT}!`)
})
