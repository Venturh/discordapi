import { Client } from 'discord.js'
import { getImageUrl, makePresence } from './utils'

export default async function discordRequest(bot: Client) {
  const defaultStatus = {
    currently: 'DISCORD STATUS',
    time: '',
    imgUrl: `${getImageUrl()}default.png`,
  }
  const activity = bot.users.cache.get(process.env.DISCORD_USER_ID)

  if (activity === undefined) return [{ ...defaultStatus, details: 'Error' }]
  const presence = activity.presence

  if (presence) {
    if (presence.status === 'offline')
      return [{ ...defaultStatus, details: 'Currently offline' }]
    else {
      if (presence.activities.length > 0)
        return makePresence(presence.activities)
      else return [{ ...defaultStatus, details: 'Currently no activity' }]
    }
  } else return [{ ...defaultStatus, details: 'Error oh oh' }]
}
