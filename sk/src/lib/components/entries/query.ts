import { writable, type Writable } from 'simple-store-svelte'
import { type ProgressBar } from '@prgm/sveltekit-progress-bar'
import type { Entry } from './schemas'
import type { SortKey } from 'svelte-headless-table/plugins'
import { idList } from '$lib/anilist'
import { client } from '$lib/pocketbase'
import type { ListResult } from 'pocketbase'
import type { EntriesResponse, TorrentsResponse } from '$lib/pocketbase/generated-types'

export const data = writable<Entry[]>([])

export const serverItemCount = writable(0)

export const progress: Writable<ProgressBar | null> = writable(null)

type Texpand = {
  trs: TorrentsResponse[]
}

const SORT_ID_MAP: { [key: string]: string } = {
  episodes: 'EPISODES',
  seasonYear: 'START_DATE',
  title: 'TITLE_ROMAJI',
  format: 'FORMAT'
}

// these loads have race conditions, oh well

async function load (pageIndex: number, perPage: number, filterValues: Record<string, unknown>, sortKeys: SortKey[], ids?: number[]) {
  let sort = SORT_ID_MAP[sortKeys[0]?.id] || undefined

  if (sort && sortKeys[0].order === 'desc') {
    sort += '_DESC'
  }

  const search = filterValues.title as string || undefined
  const alRes = await idList({ ids, pageIndex, perPage, search, sort, format: (filterValues.format as string[])?.length ? filterValues.format as string[] : undefined })
  progress.value?.setWidthRatio(0.7)
  progress.value?.animate()
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
  serverItemCount.value = Math.min(ids?.length || Infinity, alRes.pageInfo.total)
  progress.value?.complete()
  return entries
}

export async function loadFromCache (pageIndex: number, perPage: number, filterValues: Record<string, unknown>, sortKeys: SortKey[], ids: number[]) {
  const cache = localStorage.getItem('entries')
  if (cache) {
    try {
      const entries = JSON.parse(cache) as Entry[]
      data.value = entries.filter(entry => ids.includes(entry.alID))
      serverItemCount.value = entries.length
    } catch (e) {
      localStorage.removeItem('entries')
    }
  }
  const res = await load(pageIndex, perPage, filterValues, sortKeys, ids)
  data.value = res
  localStorage.setItem('entries', JSON.stringify(res))
}

export async function query (pageIndex: number, perPage: number, filterValues: Record<string, unknown>, sortKeys: SortKey[], ids?: number[]) {
  progress.value?.start()
  data.value = []
  data.value = await load(pageIndex, perPage, filterValues, sortKeys, ids)
}
