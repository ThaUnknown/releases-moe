import { fastPrettyBytes } from '$lib/util'
import anitomyscript, { type AnitomyResult } from 'anitomyscript'

export type TorrentEntry = {
  title?: string,
  id: string,
  seeders: number,
  leechers: number,
  downloads: number,
  link: string,
  hash: string,
  size?: number,
  batch: boolean,
  verified: boolean,
  date: Date,
  parseObject: AnitomyResult
}

function mapTosho2dDeDupedEntry (entries: any[]) {
  const deduped: Record<any, TorrentEntry> = {}
  for (const entry of entries) {
    if (deduped[entry.info_hash]) {
      const dupe = deduped[entry.info_hash]
      dupe.title ??= entry.title || entry.torrent_name
      dupe.id ||= entry.nyaa_id
      dupe.seeders ||= entry.seeders >= 30000 ? 0 : entry.seeders
      dupe.leechers ||= entry.leechers >= 30000 ? 0 : entry.leechers
      dupe.downloads ||= entry.torrent_downloaded_count
      dupe.size ||= entry.total_size && fastPrettyBytes(entry.total_size)
      dupe.verified ||= !!entry.anidb_fid
      dupe.date ||= entry.timestamp && new Date(entry.timestamp * 1000)
    } else {
      deduped[entry.info_hash] = {
        title: entry.title || entry.torrent_name,
        link: entry.torrent_url,
        id: entry.nyaa_id,
        seeders: entry.seeders >= 30000 ? 0 : entry.seeders,
        leechers: entry.leechers >= 30000 ? 0 : entry.leechers,
        downloads: entry.torrent_downloaded_count,
        hash: entry.info_hash,
        size: entry.total_size && fastPrettyBytes(entry.total_size),
        verified: !!entry.anidb_fid,
        batch: entry.batch,
        date: entry.timestamp && new Date(entry.timestamp * 1000),
        parseObject: { file_name: entry.title || entry.torrent_name }
      }
    }
  }

  return Object.values(deduped)
}

export async function getToshotTorrentsForID (id: number) {
  const mappingsResponse = await fetch('https://api.ani.zip/mappings?anilist_id=' + id)
  const { mappings } = await mappingsResponse.json()

  if (!mappings.anidb_id) throw new Error('No mappings found')

  const toshoResponse = await fetch('https://feed.animetosho.org/json?order=size-d&aid=' + mappings.anidb_id)
  const torrentEntries = mapTosho2dDeDupedEntry(await toshoResponse.json())

  const anitomy = await anitomyscript(torrentEntries.map(({ title }: any) => title))

  const parseObjects: AnitomyResult[] = Array.isArray(anitomy) ? anitomy : [anitomy]

  for (const i in parseObjects) torrentEntries[Number(i)].parseObject = parseObjects[Number(i)]

  return torrentEntries
}
