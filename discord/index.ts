import { Client } from 'discord.js'
import { makePresence } from './utils'
import { DEFAULT_IMG_URL } from '../constants'

export default async function discordRequest(bot: Client) {
  const activity = bot.users.cache.get('302595184271687681')

  if (activity === undefined) return { info: 'ERROR' }
  const presence = activity.presence

  const defaultStatus = {
    currently: 'DISCORD STATUS',
    state: '',
    time: '',
    imgUrl: DEFAULT_IMG_URL,
  }

  if (presence) {
    if (presence.status === 'offline')
      return { ...defaultStatus, details: 'Currently offline' }
    else {
      if (presence.activities.length > 0)
        return { presence: makePresence(presence.activities) }
      else return { ...defaultStatus, details: 'Currently no activity' }
    }
  } else return { ...defaultStatus, details: 'Error oh oh' }
}
