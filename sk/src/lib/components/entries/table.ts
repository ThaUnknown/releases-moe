import { createRender, createTable } from 'svelte-headless-table'
import { data, serverItemCount } from './query'
import { sortTorrents } from '$lib/util'
import {
  addColumnFilters,
  addHiddenColumns,
  addPagination,
  addSortBy
} from 'svelte-headless-table/plugins'
import { RowActions, FormatCell, BoolCell } from '.'

const table = createTable(data, {
  sort: addSortBy({
    toggleOrder: ['asc', 'desc'],
    serverSide: true,
    disableMultiSort: true
  }),
  page: addPagination({
    serverSide: true,
    serverItemCount,
    initialPageSize: 30
  }),
  colFilter: addColumnFilters({
    serverSide: true
  }),
  hide: addHiddenColumns({
    initialHiddenColumnIds: ['incomplete', 'theoreticalBest']
  })
})

export const columns = table.createColumns([
  table.column({
    accessor: ({ title }) => title.english || title.userPreferred,
    header: 'Title',
    id: 'title'
  }),
  table.column({
    accessor: 'format',
    header: 'Format',
    id: 'format',
    cell: ({ value }) => createRender(FormatCell, { value })
  }),
  table.column({
    accessor: 'seasonYear',
    header: 'Year'
  }),
  table.column({
    accessor: 'episodes',
    header: 'Episodes'
  }),
  table.column({
    accessor: entry => sortTorrents(entry.expand?.trs).find(({ isBest }) => isBest)?.releaseGroup ?? '',
    header: 'Best'
  }),
  table.column({
    accessor: entry => sortTorrents(entry.expand?.trs).find(({ isBest }) => !isBest)?.releaseGroup ?? '',
    header: 'Alt'
  }),
  table.column({
    accessor: 'theoreticalBest',
    header: 'Unmuxed'
  }),
  table.column({
    accessor: 'incomplete',
    header: 'Complete',
    cell: ({ value }) => createRender(BoolCell, { value })
  }),
  table.display({
    id: 'actions',
    header: () => '',
    cell: ({ row }) => {
      if (row.isData() && row.original) {
        return createRender(RowActions, { row: row.original })
      }
      return ''
    }
  })
])

export const tableModel = table.createViewModel(columns)

export type TableModel = typeof tableModel
