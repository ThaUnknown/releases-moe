import { client } from '$lib/pocketbase'
import { TorrentsTrackerOptions, type TorrentsRecord, type TorrentsResponse } from '$lib/pocketbase/generated-types'
import { anitomyscript } from '$lib/util'
import parseTorrent from 'parse-torrent'

function getTrackerByComment (comment?: string): { tracker: TorrentsTrackerOptions, url: string } {
  if (!comment) return { tracker: TorrentsTrackerOptions.Nyaa, url: '' }
  if (comment.includes('AniDex')) {
    const match = comment.match(/\[AniDex Torrent #(\d+)]/)
    if (match?.[1]) return { tracker: TorrentsTrackerOptions.AniDex, url: 'https://anidex.info/torrent/' + match[1] }
    return { url: '', tracker: TorrentsTrackerOptions.AniDex }
  }
  if (comment.startsWith(TRACKER_URL_MAP.AB)) return { url: comment, tracker: TorrentsTrackerOptions.AB }
  const ent = Object.entries(URL_TRACKER_MAP).find(([url]) => comment.startsWith(url)) ?? []
  if (ent[1]) return { url: comment, tracker: ent[1] }
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
      .getFirstListItem<TorrentsResponse<{ length: number, name: string }[]>>(`infoHash="${torrent.infoHash}"`)
  } catch (e) {}

  const { tracker, url } = getTrackerByComment(torrent.comment)
  const parseObject = await anitomyscript(torrent.name || '')
  return {
    infoHash: torrent.infoHash,
    dualAudio: !!isDualAudio(parseObject.audio_term),
    isBest: false,
    files: torrent.files?.map(({ length, name }: ({ length: number, name: string })) => ({ length, name })) || null,
    releaseGroup: parseObject.release_group || '',
    tracker,
    url
  } as TorrentsRecord<{ length: number, name: string }[]>
}

export async function fromTorrentList () {
  const files: { size: number, filename: string }[] = JSON.parse(await navigator.clipboard.readText())
  for (const { size, filename } of files) {
    if (!Number.isInteger(size)) return
    if (typeof filename !== 'string' || !filename.length) return
  }

  const parseObject = await anitomyscript(files[0].filename || '')

  return {
    infoHash: '<redacted>',
    dualAudio: !!isDualAudio(parseObject.audio_term),
    isBest: false,
    files: files.map(({ size, filename }) => ({ length: size, name: filename })),
    releaseGroup: parseObject.release_group || '',
    tracker: TorrentsTrackerOptions.AB,
    url: ''
  }
}

export const TRACKER_URL_MAP: Record<TorrentsTrackerOptions, string> = {
  [TorrentsTrackerOptions.Nyaa]: 'https://nyaa.si/view/',
  [TorrentsTrackerOptions.Other]: 'https://example.com/',
  [TorrentsTrackerOptions.OtherPrivate]: 'https://example-pt.com/',
  [TorrentsTrackerOptions.AB]: 'https://animebytes.tv',
  [TorrentsTrackerOptions.AniDex]: 'https://anidex.info/torrent/',
  [TorrentsTrackerOptions.RuTracker]: 'https://rutracker.org',
  [TorrentsTrackerOptions.AnimeTosho]: 'https://animetosho.org',
  [TorrentsTrackerOptions.BeyondHD]: 'https://beyond-hd.me',
  [TorrentsTrackerOptions.Aither]: 'https://aither.cc',
  [TorrentsTrackerOptions.Blutopia]: 'https://blutopia.cc',
  [TorrentsTrackerOptions.HDBits]: 'https://hdbits.org',
  [TorrentsTrackerOptions.BroadcastTheNet]: 'https://broadcasthe.net',
  [TorrentsTrackerOptions.PassThePopcorn]: 'https://passthepopcorn.me'
}

export const URL_TRACKER_MAP = Object.fromEntries(Object.entries(TRACKER_URL_MAP).map(([key, value]) => [value, key])) as Record<string, TorrentsTrackerOptions>

export const PRIVATE_TRACKERS = [
  TorrentsTrackerOptions.OtherPrivate,
  TorrentsTrackerOptions.AB,
  TorrentsTrackerOptions.BeyondHD,
  TorrentsTrackerOptions.Aither,
  TorrentsTrackerOptions.Blutopia,
  TorrentsTrackerOptions.HDBits,
  TorrentsTrackerOptions.BroadcastTheNet,
  TorrentsTrackerOptions.PassThePopcorn
]
