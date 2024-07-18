<script lang='ts'>
  import { formats } from '../data'

  export let value: string | undefined
  const format = formats.find(format => format.value === value)
</script>

{#if format}
  <span>{format.label}</span>
{/if}
