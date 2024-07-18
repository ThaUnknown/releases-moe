import type { media } from '$lib/anilist'
import type { EntriesResponse, TorrentsResponse } from '$lib/pocketbase/generated-types'

export type Task = {
  id: string,
  title: string,
  status: string,
  label: string,
  priority: string
}

export type Entry = { dbid: string } & media & EntriesResponse<{ trs: TorrentsResponse[] }>
