<script lang='ts'>
  import * as Dialog from '$lib/components/ui/dialog'
  import * as Table from '$lib/components/ui/table'
  import { Input } from '$lib/components/ui/input'
  import { debounce } from '$lib/util'
  import { idList, type alResponse } from '$lib/anilist'
  import { onMount, onDestroy } from 'svelte';

  export let open: boolean = false
  export let ids: number[]

  let searchResults: alResponse | null

  const debouncedQuery = debounce(({target}) => {
    const searchText = (target as HTMLInputElement).value
    idList({ids, search: searchText, sort:'START_DATE', pageIndex:0, perPage:10}).then(results => {
      searchResults = results
    })
  }, 300)

  function onSelect() {
    open = false
    searchResults = null
  }


  function handleKeyDown(event:KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
      event.preventDefault(); // Stop browser's default search
      open = !open
    }
  }

  onMount(() => {
    window.addEventListener('keydown', handleKeyDown);
  });

  onDestroy(() => {
    window.removeEventListener('keydown', handleKeyDown);
  });
  
</script>

<Dialog.Root bind:open>
  <Dialog.Content class='max-w-[90%] sm:max-w-[425px] top-4 left-1/2 -translate-x-1/2 translate-y-0'>
    <Dialog.Header class='w-full'>
      <Dialog.Title>
        <div class='flex align-items-ed bg-inherit sticky top-0 z-10 py-3 px-3'>
          <Input type='text' placeholder='Search...' on:input={debouncedQuery} />
        </div>
      </Dialog.Title>
        <Table.Root>
          <Table.Body>
            {#if searchResults && searchResults.media.length> 0}
              {#each searchResults.media as media}
                <Table.Row href='/{media.id}' on:click={onSelect} class='cursor-pointer'>
                  <Table.Cell class='text-base'>
                    {media.title.english || media.title.userPreferred}
                  </Table.Cell>
                </Table.Row>
              {/each}
            {/if}
          </Table.Body>
        </Table.Root>
    </Dialog.Header>
  </Dialog.Content>
</Dialog.Root>
