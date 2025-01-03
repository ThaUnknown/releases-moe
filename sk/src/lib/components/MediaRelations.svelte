<script lang='ts'>
  import { formatMap, type media } from '$lib/anilist'

  export let edges: { node: media }[] | undefined

  export let edit = false

  const edgesFiltered = edges?.filter(({ node }) => node.type === 'ANIME' && node.format !== 'MUSIC' && node.format !== 'CHARACTER') || []
</script>

{#if edgesFiltered?.length}
  <h2 class='font-bold my-4 text-2xl'>Relations</h2>
  <div class='w-full flex flex-col'>
    {#each edgesFiltered as { node }}
      <a href='/{node.id}/{edit ? 'edit' : '' }' class='w-full text-decoration-none mb-3'>
        <div class='w-full h-28 flex flex-row border rounded overflow-hidden'>
          <img src={node.coverImage.extraLarge} alt='cover' class='w-22 h-full' style:object-fit='cover' />
          <div class='p-2 ps-3 flex flex-col w-full' style:min-width='0'>
            <div class='font-bold truncate w-full'>{node.title.english || node.title.userPreferred}</div>
            <div class='mt-auto flex flex-row gap-2'>
              {#if (node.format ?? '') in formatMap}
                <span class='bg-green-100 text-green-800 text-xs font-medium me-1 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300'>{formatMap[node.format]}</span>
              {/if}
              {#if node.seasonYear}
                <span class='bg-blue-100 text-blue-800 text-xs font-medium me-1 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300'>{node.seasonYear}</span>
              {/if}
              {#if node.episodes && !(node.episodes === 1 && node.format === 'MOVIE')}
                <span class='bg-gray-100 text-gray-800 text-xs font-medium me-1 px-2.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-300'>{node.episodes} Episode{node.episodes > 1 ? 's' : ''}</span>
              {/if}
              {#if node.status}
                <span class='bg-gray-100 text-gray-800 text-xs font-medium me-1 px-2.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-300 capitalize'>{node.status.replaceAll('_', '').toLowerCase()}</span>
              {/if}
            </div>
          </div>
        </div>
      </a>
    {/each}
  </div>
{/if}
