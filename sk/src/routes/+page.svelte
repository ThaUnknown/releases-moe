<script lang='ts'>
  import { metadata } from '$lib/app/stores'
  import DataTable from '$lib/components/entries/data-table.svelte'

  $metadata.title = 'Home'
  export let data
</script>

<DataTable ids={data.ids} />
