import { Client, Activity } from 'discord.js'

let imageUrl = ''

type Presence = {
    name: string,
    state: string,
    details?: string,
    imgUrl?: string
}

const defaultStatus: Presence = {
    name: 'Offline',
    state: ''
  }

export async function presenceRequest(bot: Client):Promise<Presence[]> {
  const user = bot.users.cache.get(process.env.DISCORD_USER_ID)

  if (user === undefined) return [defaultStatus]

  const presence = user.presence

  if (presence.activities) {
    if (presence.status === 'offline') return [defaultStatus]
    else {
      if (presence.activities.length > 0)
        return makePresence(presence.activities)
      else return [{ ...defaultStatus, name: 'Online', state: 'No activity' }]
    }
  }
}

export function makePresence(activity: Activity[]): Presence[] {

  const presence = activity
    .map((a) => {
        const nameWithType = a.name === 'Visual Studio Code' || a.name === 'CODE' ? `Coding in ${a.name}` : `${a.type} ${a.name}`
      if (a.type !== 'CUSTOM_STATUS')
        return {
          name: nameWithType,
          state: a.state,
          details: a.details,
          imgUrl: getImage(a),
        }
      return
    })
    .filter((e) => e !== undefined)
  return presence
}

export function setImageUrl(hosturl: string) {
  if (imageUrl === '') imageUrl = hosturl
}
export function getImageUrl() {
  return `${imageUrl}/assets/`
}

export function getImage({ name, assets, applicationID }: Activity) {
    if (applicationID === '438122941302046720')
    return `${getImageUrl()}xbox.png`


    const imagesMap = new Map([
        [
          'Visual Studio Code',
          `https://media.discordapp.net/${assets.largeImage.replace('mp:', '')}`,
        ],
        ['Spotify', `https://i.scdn.co/image/${assets.largeImage.split(':')[1]}`],
        ['Figma', `${getImageUrl()}figma.png`],
      ])


  return imagesMap.get(name) || undefined
}
