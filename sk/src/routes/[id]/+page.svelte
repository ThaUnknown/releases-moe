<script lang='ts'>
  // import { page } from '$app/stores'
  import MediaDetails from '$lib/components/MediaDetails.svelte'
  import { goto } from '$app/navigation'
  import { authModel } from '$lib/pocketbase'
  import type { PageData } from './$types'
  import { sortTorrents } from '$lib/util'
  export let data: PageData

  const { entry, media } = data

  const torrents = entry.expand?.trs
</script>

<div class='row justify-content-center'>
  <div class='col-lg-3 col-12'>
    {#if entry.incomplete}
      <div class='font-weight-bold text-danger font-size-20 mb-3'>This Entry Is Incomplete</div>
    {/if}
    <MediaDetails {media} />
    {#if $authModel?.canEdit}
      <button class='btn btn-primary my-3 px-3' type='button' on:click={() => goto('./edit')}>Edit</button>
    {/if}
    {#if entry.comparison}
      <hr class='mt-3 mb-2 bg-light' />
      <h4 class='font-weight-bold text-white'>Comparisons</h4>
      <div class='d-flex flex-column mb-20 pb-20'>
        {#each entry.comparison.split(',') as comp}
          {#if comp}
            <a href={comp} class='font-weight-bold'>{comp}</a>
          {/if}
        {/each}
      </div>
    {/if}
  </div>
  <div class='col'>
    {#if entry.notes}
      <h2 class='font-weight-bold my-4 text-white'>Notes</h2>
      <div class='mb-3' style='white-space: pre-wrap;'>
        {entry.notes}
      </div>
    {/if}
    <h2 class='font-weight-bold text-white my-4'>Torrents</h2>
    <div class='w-100 d-flex gap-3 flex-wrap'>
      {#if entry.theoreticalBest}
        <div class='specific-w-300 mw-100'>
          <div class='card px-5 py-4 h-100'>
            <h4 class='card-title mb-15 text-white'>
              {entry.theoreticalBest}
            </h4>
            <div class='mt-auto pt-2'>
              <div class='badge text-bg-warning'>Unmuxed</div>
              <div class='badge text-bg-success'>Best</div>
            </div>
          </div>
        </div>
      {/if}
      {#if torrents}
        {#each sortTorrents(torrents) as { dualAudio, infoHash, tracker, url, releaseGroup, isBest }}
          <a href={url} class='text-decoration-none specific-w-300 mw-100' target='_blank' title={infoHash}>
            <div class='card px-5 py-4 h-100'>
              <h4 class='card-title mb-15 text-white'>
                {releaseGroup}
              </h4>
              <div>Tracker: {tracker}</div>
              <div class='mt-auto pt-2'>
                {#if dualAudio}
                  <div class='badge text-bg-primary mr-2'>DualAudio</div>
                {/if}
                {#if isBest}
                  <div class='badge text-bg-success'>Best</div>
                {:else}
                  <div class='badge text-bg-danger'>Alt</div>
                {/if}
              </div>
            </div>
          </a>
        {/each}
      {/if}
    </div>
  </div>
</div>
