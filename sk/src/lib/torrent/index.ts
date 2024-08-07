import { client } from '$lib/pocketbase'
import { TorrentsTrackerOptions, type TorrentsRecord, type TorrentsResponse } from '$lib/pocketbase/generated-types'
import { anitomyscript } from '$lib/util'
import parseTorrent from 'parse-torrent'

function getTrackerByComment (comment?: string): { tracker: TorrentsTrackerOptions, url: string } {
  if (!comment) return { tracker: TorrentsTrackerOptions.Nyaa, url: '' }
  if (comment.startsWith('https://nyaa.si/view/')) return { tracker: TorrentsTrackerOptions.Nyaa, url: comment }
  if (comment.includes('AniDex')) {
    const match = comment.match(/\[AniDex Torrent #(\d+)]/)
    if (match?.[1]) return { tracker: TorrentsTrackerOptions.AniDex, url: 'https://anidex.info/torrent/' + match[1] }
    return { url: '', tracker: TorrentsTrackerOptions.AniDex }
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
    tracker: TorrentsTrackerOptions.AnimeBytes,
    url: ''
  }
}
