import { toast } from 'svelte-sonner'

export type media = {
  id: number,
  title: {
    userPreferred: string,
    english: string
  },
  coverImage: {
    extraLarge: string,
    color: string
  }
  season?: number,
  seasonYear?: number,
  type: string,
  format?: string,
  status: string,
  episodes?: number,
  duration?: number,
  averageScore?: number,
  genres?: string[],
  relations?: {
    edges: {
      node: media
    }[]
  }
}

export type alResponse = {
  pageInfo: {
    hasNextPage: boolean
  },
  media: media[]
}

export const formatMap = {
  TV: 'TV Series',
  TV_SHORT: 'TV Short',
  MOVIE: 'Movie',
  SPECIAL: 'Special',
  OVA: 'OVA',
  ONA: 'ONA',
  MUSIC: 'Music',
  undefined: 'N/A',
  null: 'N/A'
}

async function alQuery (body: string, fetch = window.fetch) {
  const opts = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body
  }
  const res = await fetch('https://graphql.anilist.co', opts)
  if (!res.ok && res.status === 429) {
    throw res
  }
  let json = null
  try {
    json = await res.json()
  } catch (error: any) {
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
  return json
}

export async function idList (ids: number[]) {
  const query = await alQuery(JSON.stringify({
    query: /* js */` 
    query($search: String, $ids: [Int]) {
      Page(page: 1, perPage: 50) {
        pageInfo {
          hasNextPage
        },
        media(id_in: $ids, type: ANIME, search: $search, sort: SEARCH_MATCH, format_not: MUSIC) {
          id,
          title {
            userPreferred,
            english
          },
          coverImage{
            extraLarge,
            color
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
      ids
    }
  }))

  return query.data.Page
}

export async function search (search: string, fetch = window.fetch, id?: string): Promise<alResponse> {
  const query = await alQuery(JSON.stringify({
    query: /* js */` 
    query($search: String, $id: Int) {
      Page(page: 1, perPage: 50) {
        pageInfo {
          hasNextPage
        },
        media(id: $id, type: ANIME, search: $search, sort: SEARCH_MATCH, format_not: MUSIC) {
          id,
          title {
            userPreferred,
            english
          },
          coverImage{
            extraLarge,
            color
          }
          season,
          seasonYear,
          format,
          status,
          episodes,
          duration,
          averageScore,
          genres,
          relations {
            edges {
              node {
                id,
                title {
                  userPreferred,
                  english
                },
                coverImage{
                  extraLarge,
                  color
                }
                seasonYear,
                format,
                status,
                type,
                episodes
              }
            }
          }
        }
      }
    }`.replace(/\s/g, ''),
    variables: {
      search: search || undefined,
      id
    }
  }))

  return query.data.Page
}
