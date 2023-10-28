<script lang='ts'>
  import { client } from '$lib/pocketbase/index.js'
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

<div class='d-flex flex-column pb-20'>
  <h3 class='font-weight-bold'>What is this?</h3>
  <p>
    Anime index for tracking the best releases of anime torrents across many trackers.<br />
    This site only provides names and metadata, there are no actual torrents here!
  </p>
  <h3 class='font-weight-bold'>Why was this made?</h3>
  <p>
    Automation enjoyings! Metadata provided is great for automation.<br />
    Old index was also annoying for linking to people, and difficult to find the desired anime/OVA.
  </p>
  <h3 class='font-weight-bold'>Are there any extensions/scripts?</h3>
  <ul>
    <li><a href={`${origin}/nyaablue.user.js`} target='_blank'>NyaaBlue</a></li>
    <li>AB Releases Marking [WIP]</li>
  </ul>
  <h3 class='font-weight-bold'>Who are the editors?</h3>

  {#await editors}
    Loading...
  {:then { items }}
    <div class='py-10'>
      {#each items || [] as { avatar, username, id }}
        <div class='d-inline-flex align-items-center'>
          {#if avatar}
            <img src={client.files.getUrl({ id, collectionName: 'users' }, avatar)} alt='avatar' class='avatar rounded me-3' />
          {/if}
          <div class='me-5'>
            {username}
          </div>
        </div>
      {/each}
    </div>
  {/await}

  <h3 class='font-weight-bold'>How to programmatically access the data?</h3>
  <p>
    We provide a REST API under <a href={`${origin}/api/collections`}>{origin}/api/collections</a>.<br />
    Publicly available endpoints are:
  </p>
  <ul>
    <li><a href={`${origin}/api/collections/entries/records`}>/entries/records</a></li>
    <li><a href={`${origin}/api/collections/torrents/records`}>/torrents/records</a></li>
  </ul>
  <p>
    For details on how to use the query parameters visit the <a href='https://pocketbase.io/docs/api-records/#listsearch-records'>PocketBase documentation</a>.
  </p>

  <h3 class='font-weight-bold'>API usage examples:</h3>
  <p>Using the official pocketbase library:</p>
  <code class='bg-dark py-2 px-3 mb-2 border rounded' style='white-space: pre;'>
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html pocketBaseCode}
  </code>
  <p>Or if you want to use a smaller library:</p>
  <code class='bg-dark py-2 px-3 border rounded' style='white-space: pre;'>
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html tinyRestCode}
  </code>
</div>

<style>
  .avatar {
    height: 2rem;
    width: 2rem;
  }
</style>
