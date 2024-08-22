<script lang='ts'>
  import { type media as _media, formatMap } from '$lib/anilist'
  import { Monitor, Calendar } from 'lucide-svelte'

  export let media: _media

  const format = media.format as keyof typeof formatMap
</script>

<div class='flex position-relative w-full'>
  <div class='w-full flex flex-col h-full content-visibility-auto'>
    <div class='w-full flex justify-center pb-3'>
      <img loading='lazy' src={media.coverImage.extraLarge || ''} alt='cover' class='rounded h-full mw-full' style:--color={media.coverImage.color || '#1890ff'} />
    </div>
    <h2 class='font-bold pt-2 title overflow-hidden my-0 text-2xl'>
      {media.title.english || media.title.userPreferred}
    </h2>
    <div class='flex flex-row mt-auto pt-2 justify-between w-full font-size-18'>
      <div class='flex align-items-center' style='margin-left: -3px'>
        <Calendar class='pe-2' />
        {media.seasonYear || 'N/A'}
      </div>
      <div class='flex align-items-center'>
        {formatMap[format]}
        <Monitor class='ps-2' />
      </div>
    </div>
  </div>
</div>

<style>
  .title {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  img {
    object-fit: contain;
    background-color: var(--color) !important;
    max-height: 75vh;
  }
</style>
