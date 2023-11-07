import { client } from '$lib/pocketbase'
import { TorrentsTrackerOptions, type TorrentsResponse } from '$lib/pocketbase/generated-types'
import { anitomyscript } from '$lib/util'
import parseTorrent from 'parse-torrent'

function getTrackerByComment (comment?: string): { tracker: TorrentsTrackerOptions, url: string } {
  if (!comment) return { tracker: TorrentsTrackerOptions.Nyaa, url: '' }
  if (comment.startsWith('https://nyaa.si/view/')) return { tracker: TorrentsTrackerOptions.Nyaa, url: comment }
  if (comment.includes('AniDex')) {
    const match = comment.match(/\[AniDex Torrent #(\d+)]/)
    if (match?.[1]) return { tracker: TorrentsTrackerOptions.AniDex, url: 'https://anidex.info/torrent/' + match[1] }
  }
  if (comment.startsWith('https://animebytes.tv')) return { url: comment, tracker: TorrentsTrackerOptions.AnimeBytes }
  return { url: '', tracker: TorrentsTrackerOptions.RuTracker }
}

function isDualAudio (audioTerm?: string | string[]) {
  const check = (string?: string) => string?.toLowerCase().replace(/[ -]/g, '').includes('dualaudio')
  if (Array.isArray(audioTerm)) return audioTerm.some(check)
  return check(audioTerm)
}

export async function createTorrentFromData (data: ArrayBuffer) {
  const torrent = await parseTorrent(data)
  try {
    return await client
      .collection('torrents')
      .getFirstListItem<TorrentsResponse<any>>(`infoHash="${torrent.infoHash}"`)
  } catch (e) {}

  const { tracker, url } = getTrackerByComment(torrent.comment)
  const parseObject = await anitomyscript(torrent.name || '')
  return {
    infoHash: torrent.infoHash,
    dualAudio: !!isDualAudio(parseObject.audio_term),
    isBest: false,
    files: torrent.files?.map(({ length, name }: any) => ({ length, name })),
    releaseGroup: parseObject.release_group || '',
    tracker,
    url
  }
}
