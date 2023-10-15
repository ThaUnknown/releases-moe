<script lang='ts'>
  import type { media as _media } from '$lib/anilist'

  export let media: _media

  const formatMap = {
    TV: 'TV Series',
    TV_SHORT: 'TV Short',
    MOVIE: 'Movie',
    SPECIAL: 'Special',
    OVA: 'OVA',
    ONA: 'ONA',
    MUSIC: 'Music',
    undefined: 'N/A',
    null: 'N/A'
  }

  const format = media.format as keyof typeof formatMap
</script>

<div class='d-flex position-relative w-full'>
  <div class='w-full d-flex flex-column h-full content-visibility-auto'>
    <img loading='lazy' src={media.coverImage.extraLarge || ''} alt='cover' class='rounded' style:--color={media.coverImage.color || '#1890ff'} />
    <h2 class='text-white font-weight-bold pt-15 title overflow-hidden my-0'>
      {media.title.userPreferred}
    </h2>
    <div class='d-flex flex-row mt-auto pt-10 justify-content-between w-full text-muted font-size-18'>
      <div class='d-flex align-items-center' style='margin-left: -3px'>
        <span class='material-symbols-outlined font-size-24 pr-10'>calendar_month</span>
        {media.seasonYear || 'N/A'}
      </div>
      <div class='d-flex align-items-center'>
        {formatMap[format]}
        <span class='material-symbols-outlined font-size-24 pl-10'>monitor</span>
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
    aspect-ratio: 7/10;
    object-fit: cover;
    background-color: var(--color) !important;
  }
</style>
