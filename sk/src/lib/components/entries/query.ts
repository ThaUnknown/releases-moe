import { writable } from 'simple-store-svelte'
import type { Entry } from './schemas'
import type { SortKey } from 'svelte-headless-table/plugins'
import { idList } from '$lib/anilist'
import { client } from '$lib/pocketbase'
import type { ListResult } from 'pocketbase'
import type { EntriesResponse, TorrentsResponse } from '$lib/pocketbase/generated-types'

export const data = writable<Entry[]>([])

export const serverItemCount = writable(0)

type Texpand = {
  trs: TorrentsResponse[]
}

const SORT_ID_MAP: { [key: string]: string } = {
  episodes: 'EPISODES',
  seasonYear: 'START_DATE',
  title: 'TITLE_ROMAJI',
  format: 'FORMAT'
}

export async function query (pageIndex: number, perPage: number, filterValues: Record<string, unknown>, sortKeys: SortKey[], ids: number[]) {
  data.value = []
  let sort = SORT_ID_MAP[sortKeys[0]?.id] || undefined

  if (sort && sortKeys[0].order === 'desc') {
    sort += '_DESC'
  }

  const search = filterValues.title as string || undefined
  const alRes = await idList({ ids, pageIndex, perPage, search, sort, format: (filterValues.format as string[])?.length ? filterValues.format as string[] : undefined })
  const res: ListResult<EntriesResponse<Texpand>> = await client.collection('entries').getList(1, 50, {
    filter: alRes.media.map(({ id }) => 'alID=' + id).join('||'),
    skipTotal: true,
    expand: 'trs'
  })
  const dbmap: { [key: string]: EntriesResponse<Texpand> } = {}
  for (const entry of res.items) {
    dbmap[entry.alID] = entry
  }
  const entries: Entry[] = []
  for (const media of alRes.media) {
    const entry = dbmap[media.id] || {}
    const obj = {
      ...entry,
      ...media,
      dbid: entry?.id ? '' + entry.id : ''
    } as Entry
    entries.push(obj)
  }
  data.value = entries
  serverItemCount.value = alRes.pageInfo.total
}
