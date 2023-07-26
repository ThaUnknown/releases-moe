import { client } from '$lib/pocketbase/index.js'
import type { PageLoad } from './$types'
import { search } from '$lib/anilist'
import { error } from '@sveltejs/kit'
import type { EntriesResponse, TorrentsResponse } from '$lib/pocketbase/generated-types'

type Texpand = {
  torrents: TorrentsResponse<any>[]
}

export const load: PageLoad = async function ({ fetch, url, params: { id } }) {
  let entry: EntriesResponse<Texpand> = {}
  try {
    entry = await client
      .collection('entries')
      .getFirstListItem<EntriesResponse<Texpand>>(`alID="${id}"`, { expand: 'torrents' })
  } catch (e) {
    if (!url.pathname.endsWith('edit/')) throw error(404, 'Index Entry Not Found')
  }

  const res = await search('', fetch, id)

  const media = res.media[0]

  if (!media) throw error(404, 'Anilist Entry Not Found')

  return { entry, media }
}
