<script lang='ts'>
  import * as Avatar from '$lib/components/ui/avatar'
  import { client } from '$lib/pocketbase'
  import hljs from 'highlight.js/lib/core'
  import js from 'highlight.js/lib/languages/javascript'
  import 'highlight.js/styles/github-dark.min.css'

  const { origin } = location

  hljs.registerLanguage('javascript', js)

  const pocketBaseExample = `import PocketBase from 'pocketbase'

const pb = new PocketBase('${origin}/')

const entriesList = await pb.collection('entries').getList(1, 50, { filter: 'alID=1' })`

  const tinyRestExample = `import tinyRest from 'tiny-rest'

const seadexEndpoint = tinyRest('${origin}/api/collections/')

const entriesResponse = await seadexEndpoint('entries/records', { filter: 'alID=1' })

const entriesList = await entriesResponse.json()`

  const { value: pocketBaseCode } = hljs.highlight(pocketBaseExample, { language: 'javascript' })
  const { value: tinyRestCode } = hljs.highlight(tinyRestExample, { language: 'javascript' })

  const editors = client.collection('editors').getList(1, 50)
</script>

<div>
  <h3 class='font-bold text-2xl pb-4'>What is this?</h3>
  <p>
    Anime index for tracking the best releases of anime torrents across many trackers.<br />
    This site only provides names and metadata, there are no actual torrents here!
  </p>
  <h3 class='font-bold text-2xl py-4'>Why was this made?</h3>
  <p>
    Automation enjoyings! Metadata provided is great for automation.<br />
    Old index was also annoying for linking to people, and difficult to find the desired anime/OVA.
  </p>
  <h3 class='font-bold text-2xl py-4'>Is there any difference between the releases listed on this and the sheet?</h3>
  <p>
    Ideally, there's no difference. If you find any discrepancies between this and the sheet, report them to the SeaDex discord.<br />
    Sheet will be maintained alongside this. We have no plans to discontinue the sheet anytime soon.
  </p>
  <h3 class='font-bold text-2xl py-4'>Are there any extensions/scripts?</h3>
  <ul class='list-disc list-inside'>
    <li><a href={`${origin}/nyaablue.user.js`} target='_blank' class='text-blue-600 dark:text-blue-500 hover:underline'>NyaaBlue</a></li>
  </ul>
  <h3 class='font-bold text-2xl py-4'>Who are the editors?</h3>

  {#await editors}
    Loading...
  {:then { items }}
    <div>
      {#each items || [] as { avatar, username, id }}
        <div class='inline-flex items-center'>
          {#if avatar}
            <Avatar.Root class='h-8 w-8'>
              <Avatar.Image src={client.files.getUrl({ id, collectionName: 'users' }, avatar)} alt={username} />
              <Avatar.Fallback>{username}</Avatar.Fallback>
            </Avatar.Root>
          {/if}
          <span class='me-8 ms-4'>
            {username}
          </span>
        </div>
      {/each}
    </div>
  {/await}

  <h3 class='font-bold text-2xl py-4'>How to programmatically access the data?</h3>
  <p>
    We provide a REST API under <a href={`${origin}/api/collections`} class='text-blue-600 dark:text-blue-500 hover:underline'>{origin}/api/collections</a>.<br />
    Publicly available endpoints are:
  </p>
  <ul class='list-disc list-inside py-4'>
    <li><a href={`${origin}/api/collections/entries/records`} class='text-blue-600 dark:text-blue-500 hover:underline'>/entries/records</a></li>
    <li><a href={`${origin}/api/collections/torrents/records`} class='text-blue-600 dark:text-blue-500 hover:underline'>/torrents/records</a></li>
  </ul>
  <p>
    For details on how to use the query parameters visit the <a class='text-blue-600 dark:text-blue-500 hover:underline' href='https://pocketbase.io/docs/api-records/#listsearch-records'>PocketBase documentation</a>.
  </p>
  <p>
    This API enables some very powerful automation, as you can query the data in any way you want. For example, you can get the best releases for a specific anime, or the best releases for a specific group.
  </p>
  <p>
    Some examples of what you can do with the API are:
  </p>
  <ul class='list-disc list-inside py-4'>
    <li><a href={`${origin}/api/collections/entries/records?filter=theoreticalBest!=%27%27`} target='_blank' class='text-blue-600 dark:text-blue-500 hover:underline'>List all entries with theoretical releases which aren't yet muxed, to find what you could mux yourself</a></li>
    <li><a href={`${origin}/api/collections/entries/records?filter=comparison=%27%27`} target='_blank' class='text-blue-600 dark:text-blue-500 hover:underline'>List all entries without comparisons, so you can create some and contribute them</a></li>
    <li><a href={`${origin}/api/collections/entries/records?filter=incomplete=false`} target='_blank' class='text-blue-600 dark:text-blue-500 hover:underline'>List all entries which aren't incomplete, to make sure you only get entries which are finished</a></li>
    <li><a href={`${origin}/api/collections/entries/records?expand=trs&filter=trs.tracker=%27Nyaa%27`} target='_blank' class='text-blue-600 dark:text-blue-500 hover:underline'>List all entries which are only uploaded to Nyaa, and not any PTs, if you want to mirror public tracker entries to some PTs</a></li>
    <li><a href={`${origin}/api/collections/entries/records?sort=@random&perPage=1`} target='_blank' class='text-blue-600 dark:text-blue-500 hover:underline'>Get a single random entry</a></li>
    <li><a href={`${origin}/api/collections/entries/records?filter=alID=585`} target='_blank' class='text-blue-600 dark:text-blue-500 hover:underline'>Get an entry for a specific AniList ID</a></li>
    <li><a href={`${origin}/api/collections/entries/records?expand=trs&filter=trs.files?~%27"name":"[OZR]%20Goblin%20Slayer%20-%20S01E04%20(BD%201080p%20HEVC%20FLAC)%20[Dual-Audio]%20[B2BDEAF3].mkv"%27&fields=alID`} target='_blank' class='text-blue-600 dark:text-blue-500 hover:underline'>Get the AniList ID using a torrent's file name</a></li>
    <li><a href={`${origin}/api/collections/torrents/records?filter=files=%27[{%22length%22:9415031919,%22name%22:%22Jujutsu%20Kaisen%200%20(2021)%20[v2]%20[BD%201080p%20HEVC%20Dual-Audio]%20[Vodes].mkv%22}]%27`} target='_blank' class='text-blue-600 dark:text-blue-500 hover:underline'>List all torrents which contain a specific set of files, this allows you to find tracker links and infoHashes with a file's size and or name</a></li>
    <li><a href={`${origin}/api/collections/torrents/records?filter=tracker=%27RuTracker%27&sort=-updated`} target='_blank' class='text-blue-600 dark:text-blue-500 hover:underline'>List all torrents from a specific tracker and sort them by newest first</a></li>
    <li><a href={`${origin}/api/collections/torrents/records?filter=(isBest=true%26%26releaseGroup=%27GJM%27)`} target='_blank' class='text-blue-600 dark:text-blue-500 hover:underline'>List all torrents from a specific release group, which are marked as best</a></li>
  </ul>
  <p>
    The <a href={`${origin}/api/collections/torrents/records`} class='text-blue-600 dark:text-blue-500 hover:underline'>torrents</a> endpoint is also available as <a href={`${origin}/rss`} target='_blank' class='text-blue-600 dark:text-blue-500 hover:underline'>an RSS feed</a> instead of a JSON feed. This allows you to use the data in your torrent client, or in a feed reader. The query parameters are the same as for the JSON torrent feed.
  </p>
  <p>
    This once again enables some powerful queries for your torrent client such as <a href={`${origin}/rss?filter=(isBest=true%26%26infoHash!=%27<redacted>%27)&sort=-updated`} target='_blank' class='text-blue-600 dark:text-blue-500 hover:underline'>an RSS feed for all public torrents, which are marked as best, sorted by newest first.</a>
  </p>

  <h3 class='font-bold text-2xl py-4'>API usage examples using JavaScript:</h3>
  <p>Using the official pocketbase library:</p>
  <div class='py-2 px-3 mb-3 mt-2 border rounded'>
    <code class='whitespace-pre leading-none text-sm'>
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      {@html pocketBaseCode}
    </code>
  </div>
  <p>Or if you want to use a smaller library:</p>
  <div class='py-2 px-3 mb-3 mt-2 border rounded'>
    <code class='whitespace-pre leading-none text-sm'>
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      {@html tinyRestCode}
    </code>
  </div>
</div>
