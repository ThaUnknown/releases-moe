<script lang='ts'>
  import MixerHorizontal from 'svelte-radix/MixerHorizontal.svelte'
  import type { TableViewModel } from 'svelte-headless-table'
  import type { Entry } from '../schemas.js'
  import { Button } from '$lib/components/ui/button'
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu'

  export let tableModel: TableViewModel<Entry>
  const { pluginStates, flatColumns } = tableModel
  const { hiddenColumnIds } = pluginStates.hide

  function handleHide (id: string) {
    hiddenColumnIds.update((ids: string[]) => {
      if (ids.includes(id)) {
        return ids.filter((i) => i !== id)
      }
      return [...ids, id]
    })
  }

  const hidableCols = ['title', 'seasonYear', 'format', 'episodes', 'Best', 'Alt', 'incomplete', 'theoreticalBest', 'updated']
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild let:builder>
    <Button variant='outline' size='sm' class='ml-auto h-8 flex' builders={[builder]}>
      <MixerHorizontal class='mr-2 h-4 w-4' />
      View
    </Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Label>Toggle columns</DropdownMenu.Label>
    <DropdownMenu.Separator />
    {#each flatColumns as col}
      {#if hidableCols.includes(col.id)}
        <DropdownMenu.CheckboxItem
          class='cursor-pointer'
          checked={!$hiddenColumnIds.includes(col.id)}
          on:click={() => handleHide(col.id)}>
          {col.header}
        </DropdownMenu.CheckboxItem>
      {/if}
    {/each}
  </DropdownMenu.Content>
</DropdownMenu.Root>
