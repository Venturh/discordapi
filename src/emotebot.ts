import { Client, Message } from 'discord.js'
import redis from 'async-redis'

const PREFIX = '!'
const db = redis.createClient({
  url: process.env.REDIS_URL,
})
export async function emoteBotRequest(msg: Message, bot: Client) {
  if (msg.author.bot) return
  if (msg.content[0] === PREFIX) handlePrefixMsg(msg, bot)
  else emote(msg, bot)
}

async function handlePrefixMsg(msg: Message, bot: Client) {
  let content = msg.content.substring(PREFIX.length).split(' ')
  switch (content[0]) {
    case 'add':
      if (content[1] && content[2]) {
        try {
          await addImage(content[1], content[2])
          msg.reply('Wurde geadded')
        } catch (error) {
          msg.reply('Die Id gibt es schon')
        }
      }
      break
    case 'e':
      try {
        const img = await searchImage(content[1])
        await msg.delete().catch(console.error)
        msg.channel.send(img)
      } catch (error) {
        msg.channel.send('Nicht gefunden Brudi')
      }
      break

    case 'list':
      msg.channel.send('Bidde? \n' + (await listImages()))
      break

    case 'emotes':
      const emotes = bot.emojis.cache
        .map(({ name, id }) =>
          msg.guild.emojis.cache.get(id) === undefined ? name : null
        )
        .filter((item) => item != null)
      msg.channel.send('Alle Emotes? \n' + emotes)
      break
    default:
      break
  }
}

const addImage = async (id: string, url: string) => {
  if ((await db.get(id)) !== null) throw new Error()
  return await db.set(id, url)
}

const searchImage = async (id: string) => {
  const image = await db.get(id)
  if (image) return image
  else throw new Error()
}

const listImages = async () => {
  return await db.keys('*')
}

function emote(msg: Message, bot: Client) {
  let same = false
  const patt = /:\w+:/g
  var result = msg.content.match(patt)
  if (!result) return

  const emotes = result.map((result) => {
    const name = result.slice(1, -1)
    const emote = bot.emojis.cache.find((emoji) => {
      return emoji.name === name
    })
    return { name, emote: emote }
  })
  if (emotes[0].emote === undefined) return
  if (emotes.length === 1 && msg.content[0] === ':') {
    const emote = bot.emojis.cache.get(emotes[0].emote.id)
    if (!emote) return
    msg.channel.send(`${emote}`)
    msg.delete()
  } else {
    let msgs = msg.content
    const alreadyIn = []
    emotes.forEach((t) => {
      if (
        msg.guild.emojis.cache.find((emoji) => emoji.name === t.name) !==
        undefined
      ) {
      } else if (t.emote !== undefined && !alreadyIn.includes(t.name)) {
        const emote = bot.emojis.cache.get(t.emote.id)
        if (emote) {
          msgs = replaceAll(msgs, `:${t.name}:`, emote as any)
        }
        alreadyIn.push(t.name)
      }
    })
    if (!same) {
      msg.channel.send(`${msgs}`)
      msg.delete()
    }
  }
}

function replaceAll(str: string, find: string, replace: any) {
  return str.replace(new RegExp(find, 'g'), replace)
}
