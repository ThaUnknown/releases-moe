import PocketBase from 'pocketbase'
import { env } from '$env/dynamic/private'
import type { EntriesResponse, TorrentsResponse } from '$lib/pocketbase/generated-types'

const client = new PocketBase(env.PROXY_TARGET || 'http://0.0.0.0:59992')

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export const handle = async ({ event, resolve }) => {
  if (!event.params.id || !Number(event.params.id)) return resolve(event)
  const ua = event.request.headers.get('user-agent')

  if (!ua?.includes('Discordbot')) return resolve(event)
  try {
    const item = await client.collection('entries').getFirstListItem<EntriesResponse<{
      trs: TorrentsResponse[]
    }>>(`alID="${event.params.id}"`, { expand: 'trs' })

    const res = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        query: /* js */`
          query($id: Int) {
            Media(id: $id) {
              title {
                english,
                userPreferred
              }
              coverImage {
                large
                color
              }
            }
          }
        `,
        variables: {
          id: Number(event.params.id)
        }
      })
    })
    if (!res.ok) throw res

    const { data } = await res.json()

    let desc = ''
    
    if (item.theoreticalBest) desc += `Theoretical Best: ${item.theoreticalBest}\n`

    const best = item.expand?.trs.filter(({ isBest }) => isBest)
    if (best?.length) {
      desc += `Best: ${[...new Set(best.map(({ releaseGroup }) => releaseGroup))].join('/')}\n`
    }
    const alt = item.expand?.trs.filter(({ isBest }) => !isBest)
    if (alt?.length) {
      desc += `Alt: ${[...new Set(alt.map(({ releaseGroup }) => releaseGroup))].join('/')}\n`
    }

    if (item.notes) desc += `\n${item.notes}\n`
    // if (item.comparison) desc += `\n${item.comparison.replaceAll(',', ' ')}\n`

    desc = escapeHtml(desc)

    return resolve(event, {
      transformPageChunk: ({ html }) => {
        return html.replace(
          '<meta name="twitter:image" content="/favicon.png">',
          `<meta name="twitter:image" content="${data.Media.coverImage.large}">`
        ).replace(
          '<meta property="og:image" content="/favicon.png">',
          `<meta property="og:image" content="${data.Media.coverImage.large}"><meta property="og:site_name" content="SeaDex" />`
        ).replace(
          '<meta property="og:title" content="SeaDex">',
          `<meta property="og:title" content="${data.Media.title.english || data.Media.title.userPreferred}">`
        ).replace(
          '<meta name="twitter:title" content="SeaDex">',
          `<meta name="twitter:title" content="${data.Media.title.english || data.Media.title.userPreferred}">`
        ).replace(
          '<meta name="twitter:description" content="Your portal to the ultimate enthusiast releases - anime with unparalleled video, audio, and subtitle perfection, backed by in-depth comparisons.">',
          `<meta name="twitter:description" content="${desc}">`
        ).replace(
          '<meta property="og:description" content="Your portal to the ultimate enthusiast releases - anime with unparalleled video, audio, and subtitle perfection, backed by in-depth comparisons.">',
          `<meta property="og:description" content="${desc}">`
        ).replace(
          '<meta name="theme-color" content="#ff4242">',
          `<meta name="theme-color" content="${data.Media.coverImage.color || '#3db4f2'}">`
        )
      }
    })
  } catch (error) {
    return resolve(event)
  }
}
