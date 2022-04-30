import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'

import { Client } from 'discord.js'
import { presenceRequest, setImageUrl } from './presence'
import { emoteBotRequest } from './emotebot'

dotenv.config()
const app = express()
const bot = new Client()



var whitelist = [
  'http://localhost:3000',
  'http://portfolio.localhost',
  'https://werpers.dev',
]
var corsOptions = {
  origin: function (origin: any, callback: any) {
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
  return res.send(await presenceRequest(bot))
})

app.listen(process.env.PORT, async () => {
  console.log(`Server started at ${process.env.PORT}!`)
  await bot.login(process.env.BOT_TOKEN)
  bot.on('message', async (msg) => {
    await emoteBotRequest(msg, bot)
  })
})
