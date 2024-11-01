<script lang='ts'>
  import { metadata } from '$lib/app/stores'
  import MediaDetails from '$lib/components/MediaDetails.svelte'
  import { authModel } from '$lib/pocketbase'
  import { sortTorrents } from '$lib/util'
  import MediaRelations from '$lib/components/MediaRelations.svelte'
  import ReleaseCard from '$lib/components/ReleaseCard.svelte'
  import { Button } from '$lib/components/ui/button'
  import * as Card from '$lib/components/ui/card'
  import { Separator } from '$lib/components/ui/separator'
  import type { TorrentsResponse, TorrentsTrackerOptions } from '$lib/pocketbase/generated-types.js'
  export let data

  let { entry, media } = data

  $: entry = data.entry
  $: media = data.media

  $: groupped = sortTorrents(entry.expand?.trs).reduce((acc, item) => {
    const { releaseGroup, isBest } = item;
    
    // Initialize the releaseGroup if it doesn't exist
    if (!acc[releaseGroup]) {
      acc[releaseGroup] = { best: [], alt: [] };
    }

    // Push the item into the 'best' or 'alt' group based on the boolean 'best' value
    if (isBest) {
      acc[releaseGroup].best.push(item);
    } else {
      acc[releaseGroup].alt.push(item);
    }

    return acc;
  }, {}) as Record<string, Record<string, TorrentsResponse[]>>

  $metadata.title = media.title.userPreferred
</script>

<div class='flex h-full md:flex-row flex-col justify-content-center'>
  <div class='mb-3 min-w-0'>
    {#if entry.incomplete}
      <div class='font-medium text-red-600 text-xl mb-3'>This Entry Is Incomplete</div>
    {/if}
    <MediaDetails {media} />
    {#if $authModel?.canEdit}
      <Button class='my-3 px-5 h-8' href='./edit'>Edit</Button>
    {/if}
    {#if entry.comparison}
      <hr class='mt-3 mb-2' />
      <h4 class='font-bold text-2xl'>Comparisons</h4>
      <div class='flex flex-col my-4 pb-5'>
        {#each entry.comparison.split(',') as comp}
          {#if comp}
            <Button href={comp} class='text-blue-600 dark:text-blue-500 hover:underline my-1 bg-blue-400/10 hover:bg-blue-400/15'>
              {comp.replace(/https?:\/\//, '').replace(/\/$/, '')}
            </Button>
          {/if}
        {/each}
      </div>
    {/if}
  </div>
  <Separator orientation='vertical' class='mx-10 h-auto' />
  <div class='w-full'>
    <h2 class='font-bold my-4 text-2xl'>Torrents</h2>
    <div class='w-full flex gap-3 flex-wrap'>
      {#if entry.theoreticalBest}
        <Card.Root class='w-80 max-w-full flex flex-col'>
          <Card.Header>
            <Card.Title>{entry.theoreticalBest}</Card.Title>
          </Card.Header>
          <Card.Footer class='mt-auto'>
            <span class='bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300'>Unmuxed</span>
            <span class='bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300'>Best</span>
          </Card.Footer>
        </Card.Root>
      {/if}
      {#each Object.entries(groupped) as [releaseGroup, torrentinfo]}
        {#each torrentinfo["best"] as torrents}
          <ReleaseCard releaseGroup={releaseGroup} torrents={torrents} />
        {/each}        
      {/each}
      {#each Object.entries(groupped) as [releaseGroup, torrentinfo]}
        {#each torrentinfo["alt"] as torrents}
          <ReleaseCard releaseGroup={releaseGroup} torrents={torrents} />
        {/each}        
      {/each}
    </div>
    <Separator class='my-10' />
    {#if entry.notes}
      <h2 class='font-bold my-4 text-2xl'>Notes</h2>
      <div class='mb-3 whitespace-pre-wrap'>
        {entry.notes}
      </div>
      <Separator class='my-10' />
    {/if}
    {#key media}
      <MediaRelations edges={media.relations?.edges.filter(({ node }) => data.ids.includes(node.id))} />
    {/key}
  </div>
</div>

<style>
  .size + .size::before {
    content: ' | ';
    white-space: normal;
  }
</style>
