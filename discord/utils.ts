import { Activity } from 'discord.js'
import ago from 's-ago'

export function getCurrently({ type, name }: Activity) {
  if (type === 'LISTENING') return `${type} TO ${name.toUpperCase()}`
  else if (type === 'PLAYING' && name === 'Visual Studio Code')
    return 'CODING IN VS CODE'
  else return `${type} ${name.toUpperCase()}`
}

export function getImage({ name, assets, type }: Activity) {
  if (!assets && type === 'PLAYING') return `${getImageUrl}xbox.png`
  if (!assets) return `${getImageUrl}default.png`
  const map = new Map([
    [
      'Visual Studio Code',
      `https://cdn.discordapp.com/app-assets/383226320970055681/${assets.largeImage}.png`,
    ],
    ['Spotify', `https://i.scdn.co/image/${assets.largeImage.split(':')[1]}`],
  ])
  return map.get(name) || `${getImageUrl}default.png`
}

export function getTime({ timestamps }: Activity) {
  if (timestamps) {
    return `started ${ago(timestamps.start)}`
  } else return ago(new Date())
}

export function makePresence(activity: Activity[]) {
  console.log(
    '🚀 ~ file: utils.ts ~ line 37 ~ makePresence ~ activity',
    activity
  )
  return activity.map((a) => {
    // const state =
    //   a.type === 'LISTENING' ? `by ${a.state.replace(';', ',')}` : a.state
    return {
      currently: getCurrently(a),
      details: a.details,
      time: getTime(a),
      imgUrl: getImage(a),
    }
  })
}

let url = ''
export function setImageUrl(hosturl: string) {
  if (url === '') url = hosturl
}
export function getImageUrl() {
  return `${url}/assets/`
}
