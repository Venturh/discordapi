import { Activity, Client } from 'discord.js'
import { makePresence } from './utils'

export default async function discordRequest(bot: Client) {
  const activity = bot.users.cache.get('302595184271687681')

  if (activity === undefined) return { info: 'ERROR' }
  const presence = activity.presence

  if (presence) {
    if (presence.status === 'offline') return { info: 'Offline' }
    else {
      if (presence.activities.length > 0)
        return { presence: makePresence(presence.activities) }
      else return { info: 'NO ACTIVITY' }
    }
  } else return { info: 'ERROR' }
}
