<script lang='ts'>
  import { Button } from '$lib/components/ui/button'
  import * as Dialog from '$lib/components/ui/dialog'
  import { Input } from '$lib/components/ui/input'
  import { debounce } from '$lib/util'
  import { idList, type alResponse } from '$lib/anilist'
  import { page } from '$app/stores'
  import MagnifyingGlass from 'svelte-radix/MagnifyingGlass.svelte'

  let searchResults: alResponse | null

  let value: string
  let open = false

  const debouncedQuery = debounce((search:string) => {
    if (!search) return
    idList({ ids: $page.data.ids, search, sort: ['FORMAT', 'START_DATE'], pageIndex: 0, perPage: 10 }).then(results => {
      searchResults = results
    })
  }, 300)

  $: debouncedQuery(value)

  function onSelect () {
    searchResults = null
    open = false
  }

  function handleKeyDown (event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
      event.preventDefault()
      open = true
    }
  }
</script>

<svelte:window on:keydown={handleKeyDown} />

<Dialog.Root bind:open>
  <Dialog.Trigger asChild let:builder>
    <Button variant='outline' builders={[builder]} class='mx-auto px-3 text-muted-foreground sm:flex hidden'>
      <MagnifyingGlass class='size-4 mr-2' />
      <div class='font-normal pr-5'>Search anime...</div>
    </Button>
  </Dialog.Trigger>
  <Dialog.Content class='max-w-[90%] sm:max-w-[425px] top-4 left-1/2 -translate-x-1/2 translate-y-0 flex'>
    <Dialog.Header class='w-full flex'>
      <Dialog.Title>
        <div class='flex align-items-ed bg-inherit sticky top-0 z-10 py-3'>
          <Input type='text' placeholder='Search anime...' bind:value />
        </div>
      </Dialog.Title>
      <div class='flex flex-col w-full'>
        {#if searchResults && searchResults.media.length > 0}
          {#each searchResults.media as media}
            <a href='/{media.id}' on:click={onSelect} class='cursor-pointer text-base truncate border-t first:border-none py-2 hover:bg-accent hover:text-accent-foreground px-3 transition-colors'>
              {media.title.english || media.title.userPreferred}
            </a>
          {/each}
        {/if}
      </div>
    </Dialog.Header>
  </Dialog.Content>
</Dialog.Root>
