import { client } from '$lib/pocketbase'

export async function GET ({ url, fetch }) {
  const res = await fetch('/api/collections/torrents/records?page=1&perPage=50&sort=-updated')
  // const items = (await client.collection('torrents').getList(1, 50, { sort: '-updated' })).items
  const { items } = await res.json()

  const headers = {
    'Cache-Control': 'max-age=0, s-maxage=3600',
    'Content-Type': 'application/xml'
  }
  return new Response(
    `<rss xmlns:atom="http://www.w3.org/2005/Atom" xmlns:seadex="${url.origin}/xmlns/seadex" version="2.0">
      <channel>
        <title>SeaDex</title>
        <link>${url.origin}</link>
        <description>RSS feed for latest changes</description>
        <atom:link href="${url}" rel="self" type="application/rss+xml" />
        ${items.filter(item => item.infoHash !== '<redacted>')
          .map(item => `
            <item>
              <title>${item.id}</title>
              <link>${item.infoHash}</link>
              <guid isPermaLink="true">${item.url}</guid>
              <pubDate>${new Date(item.updated)}</pubDate>

              <seadex:infoHash>${item.infoHash}</seadex:infoHash>
            </item>
          `
          )
          .join('')}
      </channel>
    </rss>`,
    { headers }
  )
}
