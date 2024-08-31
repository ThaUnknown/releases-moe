import PocketBase from 'pocketbase'
import { keyedTrimWhiteSpace } from '$lib/util'
import { env } from '$env/dynamic/private'

const client = new PocketBase(env.PROXY_TARGET || 'http://0.0.0.0:59992')

const channel = keyedTrimWhiteSpace/* xml */`
<rss xmlns:atom="http://www.w3.org/2005/Atom" xmlns:seadex="${'origin'}/xmlns/seadex" version="2.0">
  <channel>
    <title>SeaDex</title>
    <link>${'origin'}</link>
    <description>RSS feed for latest changes</description>
    <atom:link href="${'origin'}/rss" rel="self" type="application/rss+xml" />
    ${'items'}
  </channel>
</rss>`

const channelItems = keyedTrimWhiteSpace/* xml */`
<item>
  <title>${'id'}</title>
  <link>${'hash'}</link>
  <guid isPermaLink="true">${'url'}</guid>
  <pubDate>${'date'}</pubDate>
  <seadex:infoHash>${'hash'}</seadex:infoHash>
</item>`

export async function GET ({ url }) {
  const search = Object.fromEntries(url.searchParams.entries())
  const { items } = await client.collection('torrents').getList(1, Number(search.perPage) || 50, { sort: '-updated', ...search, skipTotal: true, fields: '*' })

  const rssItems = items.map(({ id, infoHash, url, updated }) => channelItems({
    id, hash: infoHash.replace(/[<>]/g, ''), url: url.replace('&', '&amp;'), date: '' + new Date(updated)
  })).join('')

  return new Response(channel({ origin: url.origin, items: rssItems }), {
    headers: {
      'Cache-Control': 'public, max-age=43200',
      'Content-Type': 'application/xml'
    }
  })
}
