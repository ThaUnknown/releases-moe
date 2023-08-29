<script lang='ts'>
  // import { page } from '$app/stores'
  import MediaDetails from '$lib/components/MediaDetails.svelte'
  import type { PageData } from './$types'
  export let data: PageData

  const { entry, media } = data

  const torrents = entry.expand?.trs
</script>
<MediaDetails {media} />
{#if entry.incomplete}
  <div class='font-weight-bold mb-10 text-danger'>This Entry Is Incomplete</div>
{/if}
<h4 class='font-weight-bold mb-10 text-white'>Torrents</h4>
<div class='row w-full'>
  {#if torrents}
    {#each torrents as { dualAudio, infoHash, tracker, url, releaseGroup, id }}
      <a href={url} class='col-4' target='_blank' title={infoHash}>
        <div class='card m-5 border-0 h-150 d-flex flex-column'>
          <h2 class='card-title mb-15 text-white'>
            {releaseGroup}
          </h2>
          <div>Tracker: {tracker}</div>
          <div class='d-flex flex-row mt-auto'>
            {#if dualAudio}
              <div class='badge badge-primary mr-5'>DualAudio</div>
            {/if}
            {#if entry.best === id}
              <div class='badge badge-primary'>Best</div>
            {/if}
          </div>
        </div>
      </a>
    {/each}
  {/if}
</div>
<h4 class='font-weight-bold mb-10 text-white'>Notes</h4>
<div class='mb-15'>
  {entry.notes}
</div>
<h4 class='font-weight-bold mb-10 text-white'>Comparisons</h4>
<div class='d-flex flex-column mb-20 pb-20'>
  {#each entry.comparison.split(',') as comp}
    {#if comp}
      <a href={comp} class='font-weight-bold'>{comp}</a>
    {/if}
  {/each}
</div>
