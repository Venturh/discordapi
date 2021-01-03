import { Client } from 'discord.js'
import { makePresence } from './utils'
import { DEFAULT_IMG_URL } from '../constants'

export default async function discordRequest(bot: Client) {
  const activity = bot.users.cache.get(process.env.DISCORD_USER_ID)

  if (activity === undefined) return { info: 'ERROR' }
  const presence = activity.presence

  const defaultStatus = {
    currently: 'DISCORD STATUS',
    time: '',
    imgUrl: DEFAULT_IMG_URL,
  }

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
