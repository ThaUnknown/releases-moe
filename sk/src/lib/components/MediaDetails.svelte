<script lang='ts'>
  import { type media as _media, formatMap } from '$lib/anilist'
  import { Monitor, Calendar, CalendarArrowUp, CalendarPlus } from 'lucide-svelte'
  import type { EntriesResponse } from '$lib/pocketbase/generated-types.js'

  export let data: {entry: EntriesResponse, media: _media}

  $: ({ entry, media } = data)

  $: format = media.format as keyof typeof formatMap
</script>

<div class='flex position-relative w-full'>
  <div class='w-full flex flex-col h-full content-visibility-auto'>
    <div class='w-full flex justify-center pb-2'>
      <a href={`https://anilist.co/anime/${media.id}`} target="_blank">
        <img loading='lazy' src={media.coverImage.extraLarge || ''} alt='cover' class='rounded h-full mw-full' style:--color={media.coverImage.color || '#1890ff'} />
      </a>
    </div>
    <div class="w-full">      
      <h2 class='font-bold pt-2 my-0 text-xl'>
        {media.title.english || media.title.userPreferred}
      </h2>
      {#if (media.title.english && media.title.english != media.title.userPreferred)}
        <h2 class='pt-2 my-0 text-base'>
          {media.title.userPreferred}
        </h2>
      {/if}
    </div>
    <div class='flex flex-row mt-auto pt-2 justify-between w-full font-size-18'>
      <div class='flex align-items-center' style='margin-left: -3px'>
        <Calendar class='pe-2' />
        {media.seasonYear || 'N/A'}
      </div>
      <div class='flex align-items-center'>
        {formatMap[format]}
        {#if (media.episodes || 0) > 1}
          ({media.episodes})
        {/if}
        <Monitor class='ps-2' />
      </div>
    </div>
    <div class='flex flex-row mt-auto pt-2 justify-between w-full font-size-18'>
      <div class='flex align-items-center' style='margin-left: -3px' title='Created on'>
        <CalendarPlus class='pe-2' />
        {entry.created.substring(0, 10) || 'N/A'}
      </div>
      <div class='flex align-items-center' style='margin-left: -3px' title='Updated on'>
        {entry.updated.substring(0, 10) || 'N/A'}
        <CalendarArrowUp class='ps-2' />
      </div>
    </div>
  </div>
</div>

<style>
  img {
    object-fit: contain;
    background-color: var(--color) !important;
    max-height: 75vh;
  }
</style>
