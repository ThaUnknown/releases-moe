<script lang='ts'>
  import type { TableViewModel } from 'svelte-headless-table'
  import Cross2 from 'svelte-radix/Cross2.svelte'
  import type { Writable } from 'svelte/store'
  import { formats } from '../data.js' // TODO: change to format
  import type { Entry } from '../schemas.js'
  import { FacetedFilter, ViewOptions } from '../index.js'
  import { Button } from '$lib/components/ui/button'
  import { Input } from '$lib/components/ui/input'

  export let tableModel: TableViewModel<Entry>

  const { pluginStates } = tableModel

  const { filterValues }: {
    filterValues: Writable<{
      format: string[]
      priority: string[]
      title: string
    }>
  } = pluginStates.colFilter

  $: showReset = Object.values($filterValues).some((v) => v.length > 0)
</script>

<div class='flex items-center justify-between'>
  <div class='flex flex-1 items-center space-x-2'>
    <Input
      placeholder='Filter titles...'
      class='h-8 w-[150px] lg:w-[250px]'
      type='search'
      bind:value={$filterValues.title}
    />

    <FacetedFilter
      bind:filterValues={$filterValues.format}
      title='Format'
      options={formats}
    />
    {#if showReset}
      <Button
        on:click={() => {
          $filterValues.format = []
          $filterValues.priority = []
          $filterValues.title = ''
        }}
        variant='ghost'
        class='h-8 px-2 lg:px-3'>
        Reset
        <Cross2 class='ml-2 h-4 w-4' />
      </Button>
    {/if}
  </div>

  <ViewOptions {tableModel} />
</div>
