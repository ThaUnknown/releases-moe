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
    hasNextPage: boolean,
    total: number
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
  } catch (error: unknown) {
    if (res.ok) toast.error((error as Error).message)
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

export async function idList ({ ids, pageIndex = 0, perPage = 10, sort = 'SEARCH_MATCH', search, format }: { ids?: number[], pageIndex: number, perPage: number, sort?: string | string[], search?: string, format?: string[] }): Promise<alResponse> {
  const query = await alQuery(JSON.stringify({
    query: /* js */` 
    query($search: String, $ids: [Int], $sort: [MediaSort], $format: [MediaFormat], $page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          total
        },
        media(id_in: $ids, type: ANIME, search: $search, sort: $sort, format_not: MUSIC, format_in: $format, status_not_in: [NOT_YET_RELEASED, CANCELLED] ) {
          id,
          title {
            userPreferred,
            english
          },
          seasonYear,
          format,
          episodes
        }
      }
    }`.replace(/\s/g, ''),
    variables: {
      search,
      ids,
      sort,
      page: pageIndex + 1,
      perPage,
      format
    }
  }))

  return query.data.Page
}

export async function search (search: string, id?: string): Promise<alResponse> {
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
