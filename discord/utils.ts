import { Activity } from 'discord.js'
import ago from 's-ago'

export function getCurrently({ type, name }: Activity) {
  let customType: string
  if (type === 'LISTENING') customType = `${type} TO`
  else if (type === 'PLAYING' && name === 'Visual Studio Code')
    customType = 'CODING IN'
  else customType = type
  return `${customType} ${name.toUpperCase()}`
}

export function getImage({ name, assets }: Activity) {
  const map = new Map([
    [
      'Visual Studio Code',
      `https://cdn.discordapp.com/app-assets/383226320970055681/${assets.largeImage}.png`,
    ],
    ['Spotify', `https://i.scdn.co/image/${assets.largeImage.split(':')[1]}`],
  ])
  return map.get(name) || ''
}

export function getTime({ timestamps }: Activity) {
  if (timestamps) {
    return `started ${ago(timestamps.start)}`
  } else return ago(new Date())
}

export function makePresence(activity: Activity[]) {
  return activity.map((a) => {
    const state =
      a.type === 'LISTENING' ? `by ${a.state.replace(';', ',')}` : a.state

    return {
      currently: getCurrently(a),
      details: a.details,
      state,
      time: getTime(a),
      imgUrl: getImage(a),
    }
  })
}