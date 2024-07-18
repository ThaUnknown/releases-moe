<script lang='ts'>
  import * as Avatar from '$lib/components/ui/avatar'
  import { client } from '$lib/pocketbase'
  import hljs from 'highlight.js/lib/core'
  import js from 'highlight.js/lib/languages/javascript'
  import 'highlight.js/styles/github-dark.min.css'

  const { origin } = location

  hljs.registerLanguage('javascript', js)

  const pocketBaseExample = `import PocketBase from 'pocketbase'

const pb = new PocketBase('${origin}/api/')

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
  <h3 class='font-bold text-2xl py-4'>Are there any extensions/scripts?</h3>
  <ul class='list-disc list-inside'>
    <li><a href={`${origin}/nyaablue.user.js`} target='_blank' class='text-blue-600 dark:text-blue-500 hover:underline'>NyaaBlue</a></li>
    <li><a href={`${origin}/animebytesmark.user.js`} target='_blank' class='text-blue-600 dark:text-blue-500 hover:underline'>AB Releases Marking</a></li>
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

  <h3 class='font-bold text-2xl py-4'>API usage examples:</h3>
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
