<script lang='ts'>
  import DotsHorizontal from 'svelte-radix/DotsHorizontal.svelte'
  import { type Entry } from './schemas.js'
  import { Button } from '$lib/components/ui/button'
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
  import { authModel } from '$lib/pocketbase'
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'

  export let row: Entry

  function open (entry: Entry) {
    goto(`./${entry.id}`)
  }
  function copyLink (entry: Entry) {
    navigator.clipboard.writeText($page.url + entry.id)
  }
  function edit (entry: Entry) {
    goto(`./${entry.id}/edit`)
  }
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild let:builder>
    <Button
      variant='ghost'
      builders={[builder]}
      class='flex h-8 w-8 p-0 data-[state=open]:bg-muted'>
      <DotsHorizontal class='h-4 w-4' />
      <span class='sr-only'>Open Menu</span>
    </Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content class='w-[160px]' align='end'>
    <DropdownMenu.Item on:click={() => open(row)}>Open</DropdownMenu.Item>
    <DropdownMenu.Item on:click={() => copyLink(row)}>Copy link</DropdownMenu.Item>
    {#if $authModel?.canEdit}
      <DropdownMenu.Separator />
      <DropdownMenu.Item on:click={() => edit(row)}>
        Edit
      </DropdownMenu.Item>
    {/if}
  </DropdownMenu.Content>
</DropdownMenu.Root>
