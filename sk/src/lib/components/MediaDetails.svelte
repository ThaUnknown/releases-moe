<script lang='ts'>
  import { type media as _media, formatMap } from '$lib/anilist'

  export let media: _media

  const format = media.format as keyof typeof formatMap
</script>

<div class='d-flex position-relative w-100'>
  <div class='w-100 d-flex flex-column h-100 content-visibility-auto'>
    <div class='w-full d-flex justify-content-center pb-3'>
      <img loading='lazy' src={media.coverImage.extraLarge || ''} alt='cover' class='rounded h-100 mw-100' style:--color={media.coverImage.color || '#1890ff'} />
    </div>
    <h2 class='text-white font-weight-bold pt-2 title overflow-hidden my-0'>
      {media.title.english || media.title.userPreferred}
    </h2>
    <div class='d-flex flex-row mt-auto pt-2 justify-content-between w-100 text-muted font-size-18'>
      <div class='d-flex align-items-center' style='margin-left: -3px'>
        <span class='material-symbols-outlined font-size-24 pe-2'>calendar_month</span>
        {media.seasonYear || 'N/A'}
      </div>
      <div class='d-flex align-items-center'>
        {formatMap[format]}
        <span class='material-symbols-outlined font-size-24 ps-2'>monitor</span>
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
