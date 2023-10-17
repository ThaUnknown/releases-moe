<script lang='ts'>
  // import { page } from '$app/stores'
  import MediaDetails from '$lib/components/MediaDetails.svelte'
  import { goto } from '$app/navigation'
  import { authModel } from '$lib/pocketbase'
  import type { PageData } from './$types'
  export let data: PageData

  const { entry, media } = data

  const torrents = entry.expand?.trs
</script>

<div class='row px-20 justify-content-center'>
  <div class='col-lg-3 col-12'>
    {#if entry.incomplete}
      <div class='font-weight-bold text-danger font-size-20 mb-10'>This Entry Is Incomplete</div>
    {/if}
    <MediaDetails {media} />
    {#if $authModel?.canEdit}
      <button class='btn btn-primary mt-15' type='button' on:click={() => goto('./edit')}>Edit</button>
    {/if}
    {#if entry.comparison}
      <hr class='my-20 bg-light' />
      <h4 class='font-weight-bold mb-10 text-white'>Comparisons</h4>
      <div class='d-flex flex-column mb-20 pb-20'>
        {#each entry.comparison.split(',') as comp}
          {#if comp}
            <a href={comp} class='font-weight-bold'>{comp}</a>
          {/if}
        {/each}
      </div>
    {/if}
  </div>
  <div class='col ml-lg-20'>
    {#if entry.notes}
      <h4 class='font-weight-bold mb-10 text-white'>Notes</h4>
      <div class='mb-15' style='white-space: pre-wrap;'>
        {entry.notes}
      </div>
    {/if}
    <h4 class='font-weight-bold mb-10 text-white'>Torrents</h4>
    <div class='row w-full'>
      {#if torrents}
        {#each torrents as { dualAudio, infoHash, tracker, url, releaseGroup, isBest }}
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
                {#if isBest}
                  <div class='badge badge-primary'>Best</div>
                {/if}
              </div>
            </div>
          </a>
        {/each}
      {/if}
    </div>
  </div>
</div>
