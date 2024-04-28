<script lang='ts'>
  import { formatMap, type media } from '$lib/anilist'

  export let relations: media['relations']

  const edges = relations?.edges.filter(({ node }) => node.type === 'ANIME' && node.format !== 'MUSIC') || []
</script>

{#if relations}
  <h2 class='font-weight-bold text-white my-4'>Relations</h2>
  <div class='w-100 d-flex flex-column'>
    {#each edges as { node }}
      <a href={`/${node.id}`} class='w-100 text-decoration-none mb-3'>
        <div class='w-100 card specific-h-100 d-flex flex-row overflow-hidden'>
          <div class='specific-w-75 h-100 flex-shrink-0'>
            <img src={node.coverImage.extraLarge} alt='cover' class='w-100 h-100' style:object-fit='cover' />
          </div>
          <div class='p-2 ps-3 d-flex flex-column w-100' style:min-width='0'>
            <div class='text-white fw-bold text-truncate w-100'>{node.title.english || node.title.userPreferred}</div>
            <div class='mt-auto d-flex flex-row gap-2'>
              {#if formatMap[node.format]}
                <span class='badge rounded-pill text-bg-success'>{formatMap[node.format]}</span>
              {/if}
              {#if node.seasonYear}
                <span class='badge rounded-pill text-bg-info'>{node.seasonYear}</span>
              {/if}
              {#if node.episodes && !(node.episodes === 1 && node.format === 'MOVIE')}
                <span class='badge rounded-pill'>{node.episodes} Episode {node.episodes > 1 ? 's' : ''}</span>
              {/if}
              {#if node.status}
                <span class='badge rounded-pill text-capitalize text-bg-dark'>{node.status.replaceAll('_', '').toLowerCase()}</span>
              {/if}
            </div>
          </div>
        </div>
      </a>
    {/each}
  </div>
{/if}
