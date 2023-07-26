import { toast } from 'svelte-sonner'

export type media = {
  id: number,
  title: {
    userPreferred: string
  },
  coverImage: {
    extraLarge: string
  }
  season?: number,
  seasonYear?: number,
  format?: string,
  status: string,
  episodes?: number,
  duration?: number,
  averageScore?: number,
  genres?: string[]
}

export type alResponse = {
  pageInfo: {
    hasNextPage: boolean
  },
  media: media[]
}

export async function search (search: string, fetch = window.fetch, id?: number): alResponse {
  const opts = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      query: /* js */` 
      query($search: String, $id: Int) {
        Page(page: 1, perPage: 50) {
          pageInfo {
            hasNextPage
          },
          media(id: $id, type: ANIME, search: $search, sort: SEARCH_MATCH, format_not: MUSIC) {
            id,
            title {
              userPreferred
            },
            coverImage{
              extraLarge
            }
            season,
            seasonYear,
            format,
            status,
            episodes,
            duration,
            averageScore,
            genres
          }
        }
      }`.replace(/\s/g, ''),
      variables: {
        search: search || undefined,
        id
      }
    })
  }
  const res = await fetch('https://graphql.anilist.co', opts)
  if (!res.ok && res.status === 429) {
    throw res
  }
  let json = null
  try {
    json = await res.json()
  } catch (error) {
    if (res.ok) toast.error(error.message)
  }
  if (!res.ok) {
    if (json) {
      for (const error of json?.errors || []) {
        toast.error(error.message)
      }
    } else {
      toast.error(res.statusText)
    }
  }
  return json.data.Page
}
