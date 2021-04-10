import { Client, Activity } from 'discord.js'

let imageUrl = ''

export async function presenceRequest(bot: Client) {
  const defaultStatus = {
    currently: 'Status',
    details: 'Offline',
    imgUrl: `${getImageUrl()}discord.png`,
  }
  const user = bot.users.cache.get(process.env.DISCORD_USER_ID)

  if (user === undefined) return defaultStatus
  const presence = user.presence

  if (presence.activities) {
    if (presence.status === 'offline') return defaultStatus
    else {
      if (presence.activities.length > 0)
        return makePresence(presence.activities)
      else return [{ ...defaultStatus, details: 'Online' }]
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
          imgUrl: getImage(a),
        }
      return
    })
    .filter((e) => e !== undefined)
  if (presence.length === 0)
    return [
      {
        currently: 'DISCORD STATUS',
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
  const capitalized = { name: capitalize(name), type: capitalize(type) }
  switch (type) {
    case 'LISTENING':
      return `${capitalized.type} to ${capitalized.type}`
    case 'PLAYING':
      if (name === 'Visual Studio Code') return 'Coding in VS Code'
    default:
      return `${capitalized.type} ${capitalized.name}`
  }
}

export function getImage({ name, assets, type, applicationID }: Activity) {
  if (!assets && type === 'PLAYING') {
    switch (name) {
      case 'Figma':
        return `${getImageUrl()}figma.png`

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

const capitalize = (s: string) => {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
