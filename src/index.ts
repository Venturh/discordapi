import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'

import { Client } from 'discord.js'
import { discordRequest, setImageUrl } from './discord'

dotenv.config()
const app = express()
const bot = new Client()

app.use(
  cors({
    origin: 'https://maxwerpers.me',
    optionsSuccessStatus: 200,
  })
)

app.use('/assets', express.static('public'))

app.get('/presence', async (req, res) => {
  setImageUrl(req.protocol + '://' + req.get('host'))
  return res.send(await discordRequest(bot))
})

app.listen(process.env.PORT, async () => {
  await bot.login(process.env.BOT_TOKEN)
  console.log(`Server started at ${process.env.PORT}!`)
})
