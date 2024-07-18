<script lang='ts'>
  import Check from 'svelte-radix/Check.svelte'
  import { Cross2 } from 'svelte-radix'
  export let value: boolean
</script>

{#if !value}
  <Check class='h-4 w-4' />
{:else}
  <Cross2 class='h-4 w-4' />
{/if}
