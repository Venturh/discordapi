import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'

import discordRequest from './discord'
import { Client } from 'discord.js'
import { setImageUrl } from './discord/utils'

dotenv.config()
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

app.use(cors(corsOptions))

app.use('/assets', express.static('public'))

app.get('/presence', async (req, res) => {
  setImageUrl(req.protocol + '://' + req.get('host'))
  return res.send(await discordRequest(bot))
})

app.listen(process.env.PORT, () => {
  console.log(`Server started at ${process.env.PORT}!`)
})
