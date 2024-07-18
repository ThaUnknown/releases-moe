<script lang='ts'>
  import { metadata } from '$lib/app/stores'
  import MediaDetails from '$lib/components/MediaDetails.svelte'
  import { authModel } from '$lib/pocketbase'
  import { fastPrettyBytes } from '$lib/util'
  import MediaRelations from '$lib/components/MediaRelations.svelte'
  import { Button } from '$lib/components/ui/button'
  import * as Card from '$lib/components/ui/card'
  import { Separator } from '$lib/components/ui/separator'
  import type { TorrentsResponse, TorrentsTrackerOptions } from '$lib/pocketbase/generated-types.js'
  export let data

  let { entry, media } = data

  $: entry = data.entry
  $: media = data.media

  $: groupped = Object.groupBy(entry.expand?.trs || [], ({ releaseGroup }) => releaseGroup) as Record<string, TorrentsResponse[]>

  function hasDualBest (torrents: TorrentsResponse[]) {
    let isBest = false
    let isDual = false
    const sizes: string[] = []
    for (const torrent of torrents) {
      if (torrent.isBest) isBest = true
      if (torrent.dualAudio) isDual = true
      const size = torrent.files && fastPrettyBytes(torrent.files.reduce((acc, { length }) => acc + length, 0))
      if (size && !sizes.includes(size)) sizes.push(size)
    }
    return { isBest, isDual, sizes }
  }

  const icons: Record<TorrentsTrackerOptions, string> = {
    AnimeBytes: '/ab.ico',
    AniDex: '/anidex.ico',
    AnimeTosho: '/tosho.ico',
    Nyaa: '/cat.png',
    RuTracker: '/rutracker.ico'
  }

  $metadata.title = media.title.userPreferred
</script>

<div class='flex h-full lg:flex-row flex-col justify-content-center'>
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
        <Card.Root class='min-w-48 max-w-full flex flex-col'>
          <Card.Header>
            <Card.Title>{entry.theoreticalBest}</Card.Title>
          </Card.Header>
          <Card.Footer class='mt-auto'>
            <span class='bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300'>Unmuxed</span>
            <span class='bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300'>Best</span>
          </Card.Footer>
        </Card.Root>
      {/if}
      {#each Object.entries(groupped) as [releaseGroup, torrents]}
        {@const { isBest, isDual, sizes } = hasDualBest(torrents)}
        <Card.Root class='min-w-48 max-w-full'>
          <Card.Header class='pb-3'>
            <Card.Title>{releaseGroup}</Card.Title>
            <Card.Description>
              {sizes.join(' | ')}
            </Card.Description>
          </Card.Header>
          <Card.Content class='pb-3'>
            {#if isDual}
              <span class='bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300'>DualAudio</span>
            {/if}
            {#if isBest}
              <span class='bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300'>Best</span>
            {:else}
              <span class='bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300'>Alt</span>
            {/if}
          </Card.Content>
          <Card.Footer>
            <div class='grid grid-cols-2 gap-4'>
              {#each torrents as torrent}
                <Button size='sm' variant='outline' class='px-4' href={torrent.url}>
                  {#if icons[torrent.tracker]}
                    <img src={icons[torrent.tracker]} alt={torrent.tracker} class='w-3 h-3 me-2' />
                  {/if}
                  {torrent.tracker}
                </Button>
              {/each}
            </div>
          </Card.Footer>
        </Card.Root>
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
