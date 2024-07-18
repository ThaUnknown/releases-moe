import { client } from '$lib/pocketbase/index.js'
import type { LayoutLoad } from './$types'
import { search } from '$lib/anilist'
import { error } from '@sveltejs/kit'
import type { EntriesResponse, TorrentsResponse } from '$lib/pocketbase/generated-types'

type Texpand = {
  trs: TorrentsResponse[]
}

export const load: LayoutLoad = async function ({ url, params: { id } }) {
  let entry: EntriesResponse<Texpand>
  try {
    entry = await client
      .collection('entries')
      .getFirstListItem<EntriesResponse<Texpand>>(`alID="${id}"`, { expand: 'trs' })
  } catch (e) {
    if (!url.pathname.includes('edit')) throw error(404, 'Index Entry Not Found')
  }

  const res = await search('', id)

  const media = res.media[0]

  if (!media) throw error(404, 'Anilist Entry Not Found')

  return { entry, media }
}
