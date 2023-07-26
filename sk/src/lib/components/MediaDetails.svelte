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

<div class='d-flex flex-row align-items-end pb-15'>
  <div class='cover d-flex flex-row align-items-end'>
    <img class='rounded cover-img w-full overflow-hidden' alt='cover-art' src={media.coverImage?.extraLarge} />
  </div>
  <div class='pl-20 ml-20'>
    <h1 class='font-weight-bold text-white select-all'>{media.title.userPreferred}</h1>
    <p class='d-flex flex-row font-size-18'>
      {#if media.averageScore}
        <span class='material-symbols-outlined mx-10 font-size-24'> trending_up </span>
        <span class='mr-20'>
          Rating: {media.averageScore + '%'}
        </span>
      {/if}
      {#if media.format}
        <span class='material-symbols-outlined mx-10 font-size-24'> monitor </span>
        <span class='mr-20 text-capitalize'>
          Format: {formatMap[format]}
        </span>
      {/if}
      {#if media.episodes !== 1}
        <span class='material-symbols-outlined mx-10 font-size-24'> theaters </span>
        <span class='mr-20'>
          Episodes: {media.episodes}
        </span>
      {:else if media.duration}
        <span class='material-symbols-outlined mx-10 font-size-24'> timer </span>
        <span class='mr-20'>
          Length: {media.duration + ' min'}
        </span>
      {/if}
      {#if media.season || media.seasonYear}
        <span class='material-symbols-outlined mx-10 font-size-24'> spa </span>
        <span class='text-capitalize'>
          {[media.season?.toString().toLowerCase(), media.seasonYear].filter(f => f).join(' ')}
        </span>
      {/if}
    </p>
    {#if media.genres}
      <div class='d-flex flex-row pt-10'>
        {#each media.genres as genre}
          <div class='bg-dark px-20 py-10 mr-10 rounded font-size-16'>
            {genre}
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .cover {
    aspect-ratio: 7/10;
    max-width: 25%;
  }
</style>
