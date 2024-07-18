<script lang='ts'>
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '$lib/utils.js'

  type $$Props = HTMLAttributes<HTMLLinkElement> & {
    'data-state'?: unknown;
    href?: string;
    target?: string;
  };

  let className: $$Props['class'] = ''
  export { className as class }
</script>

<a class={cn(
  'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
  className
)}
  {...$$restProps}
  on:click
  on:keydown>
  <slot />
</a>

<style>
  a {
    display: table-row;
    vertical-align: inherit;
    border-color: inherit;
    color: inherit;
    text-decoration: none;
  }
</style>
