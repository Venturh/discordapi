import { Client, Activity } from 'discord.js'
import ago from 's-ago'

let imageUrl = ''

export async function discordRequest(bot: Client) {
  const defaultStatus = {
    currently: 'DISCORD STATUS',
    time: '',
    imgUrl: `${getImageUrl()}discord.png`,
  }
  const user = bot.users.cache.get(process.env.DISCORD_USER_ID)

  if (user === undefined) return [{ ...defaultStatus, details: 'Error' }]
  const presence = user.presence

  if (presence.activities) {
    if (presence.status === 'offline')
      return [{ ...defaultStatus, details: 'Currently offline' }]
    else {
      if (presence.activities.length > 0)
        return makePresence(presence.activities)
      else return [{ ...defaultStatus, details: 'Currently no activity' }]
    }
  }
}

export function makePresence(activity: Activity[]) {
  const presence = activity
    .map((a) => {
      if (a.type !== 'CUSTOM_STATUS')
        return {
          currently: getCurrently(a),
          details: a.details,
          time: getTime(a),
          imgUrl: getImage(a),
        }
      return
    })
    .filter((e) => e !== undefined)
  if (presence.length === 0)
    return [
      {
        currently: 'DISCORD STATUS',
        time: '',
        imgUrl: `${getImageUrl()}discord.png`,
        details: 'Currently no activity',
      },
    ]

  return presence
}

export function setImageUrl(hosturl: string) {
  if (imageUrl === '') imageUrl = hosturl
}
export function getImageUrl() {
  return `${imageUrl}/assets/`
}

export function getCurrently({ type, name }: Activity) {
  switch (type) {
    case 'LISTENING':
      return `${type} TO ${name.toUpperCase()}`
    case 'PLAYING':
      if (name === 'Visual Studio Code') return 'CODING IN VS CODE'
    default:
      return `${type} ${name.toUpperCase()}`
  }
}

export function getImage({ name, assets, type, applicationID }: Activity) {
  if (!assets && type === 'PLAYING') {
    switch (name) {
      case 'Figma':
        return `${getImageUrl()}figma.png`
        break

      default:
        if (applicationID === '438122941302046720')
          return `${getImageUrl()}xbox.png`
        else return `${getImageUrl()}discord.png`
        break
    }
  }

  const map = new Map([
    [
      'Visual Studio Code',
      `https://cdn.discordapp.com/app-assets/383226320970055681/${assets.largeImage}.png`,
    ],
    ['Spotify', `https://i.scdn.co/image/${assets.largeImage.split(':')[1]}`],
    ['Figma', `${getImageUrl()}figma.png`],
  ])
  return map.get(name) || `${getImageUrl()}discord.png`
}

export function getTime({ timestamps }: Activity) {
  if (timestamps) {
    return `started ${ago(timestamps.start)}`
  } else return ago(new Date())
}
