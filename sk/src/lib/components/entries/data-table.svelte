<script lang='ts'>
  import { Render, Subscribe } from 'svelte-headless-table'

  import * as Table from '$lib/components/ui/table'

  import { ColumnHeader, Pagination, Toolbar } from './index'
  import { query, loadFromCache, loading } from './query'
  import { columns, tableModel } from './table'
  import { debounce } from '$lib/util'
  import type { SortKey } from 'svelte-headless-table/plugins'

  const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } = tableModel

  const { pageIndex, pageSize } = pluginStates.page
  const { filterValues } = pluginStates.colFilter
  const { sortKeys } = pluginStates.sort

  export let ids: number[]

  const debouncedQuery = debounce((pageIndex: number, pageSize: number, filterValues: Record<string, unknown>, $sortKeys: SortKey[], ids?: number[]) => {
    if (firstLoad) {
      firstLoad = false // this is hacky, ugly etc, don't care, RT wanted it
      return
    }
    query(pageIndex, pageSize, filterValues, $sortKeys, ids)
  }, 300)

  let isEditing = false
  let firstLoad = true

  $: debouncedQuery($pageIndex, $pageSize, $filterValues, $sortKeys, isEditing ? undefined : ids)
  loadFromCache($pageIndex, $pageSize, $filterValues, $sortKeys, ids)
</script>

<div class='space-y-4 w-full flex-grow flex flex-col'>
  <Toolbar {tableModel} bind:isEditing />
  <div class='rounded-md border h-full'>
    <Table.Root {...$tableAttrs} class={$loading || !$pageRows.length ? 'h-full' : ''}>
      <Table.Header>
        {#each $headerRows as headerRow}
          <Subscribe rowAttrs={headerRow.attrs()}>
            <Table.Row>
              {#each headerRow.cells as cell (cell.id)}
                <Subscribe
                  attrs={cell.attrs()}
                  let:attrs
                  props={cell.props()}
                  let:props>
                  <Table.Head {...attrs} class={cell.id === 'title' ? 'w-full' : ''}>
                    {#if cell.id !== 'actions' && cell.id !== 'Best' && cell.id !== 'Alt' && cell.id !== 'incomplete' && cell.id !== 'theoreticalBest'}
                      {#key $sortKeys}
                        <ColumnHeader {props} {tableModel} cellId={cell.id}>
                          <Render of={cell.render()} />
                        </ColumnHeader>
                      {/key}
                    {:else}
                      <div class='text-xs px-3'>
                        <Render of={cell.render()} />
                      </div>
                    {/if}
                  </Table.Head>
                </Subscribe>
              {/each}
            </Table.Row>
          </Subscribe>
        {/each}
      </Table.Header>
      <Table.Body {...$tableBodyAttrs}>
        {#if $loading}
          <Table.Row>
            <Table.Cell colspan={columns.length} class='h-full text-center'>
              Loading...
            </Table.Cell>
          </Table.Row>
        {:else if $pageRows.length}
          {#each $pageRows as row (row.original.id)}
            <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
              <Table.Row {...rowAttrs} class='cursor-pointer' href='./{row.original.id}/{isEditing ? 'edit' : ''}'>
                {#each row.cells as cell (cell.id)}
                  <Subscribe attrs={cell.attrs()} let:attrs>
                    <Table.Cell {...attrs} class='px-5 w-[32px]'>
                      {#if cell.id === 'actions'}
                        <div class='w-[32px]'>
                          <Render of={cell.render()} />
                        </div>
                      {:else}
                        <Render of={cell.render()} />
                      {/if}
                    </Table.Cell>
                  </Subscribe>
                {/each}
              </Table.Row>
            </Subscribe>
          {/each}
        {:else}
          <Table.Row>
            <Table.Cell colspan={columns.length} class='h-full text-center'>
              No Results Found.
            </Table.Cell>
          </Table.Row>
        {/if}
      </Table.Body>
    </Table.Root>
  </div>
  <Pagination {tableModel} />
</div>
