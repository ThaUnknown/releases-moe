<script lang='ts'>
  import type { TorrentEntry } from '$lib/tosho'
  import { sanitiseTerms, since } from '$lib/util'
  import * as Dialog from '$lib/components/ui/dialog'
  import * as Table from '$lib/components/ui/table'
  import { Input } from '$lib/components/ui/input'

  export let modalContent: TorrentEntry[] | null = null

  export let addTorrentFile: (buffer: ArrayBuffer) => void

  let filtered: TorrentEntry[] | null
  $: filtered = modalContent

  async function filter ({ target }: Event) {
    if (!modalContent) return
    const searchText = (target as HTMLInputElement).value

    filtered = modalContent.filter(({ title }) => title?.toLowerCase().includes(searchText.toLowerCase()))
  }

  async function fetchAndAddTorrent (row: TorrentEntry) {
    modalContent = null
    const torrentRequest = await fetch(row.link)
    addTorrentFile(await torrentRequest.arrayBuffer())
  }
  function checkCloseModal (v: boolean) {
    if (!v) modalContent = null
  }
  $: open = !!filtered
</script>

<Dialog.Root bind:open onOpenChange={checkCloseModal}>
  <Dialog.Content class='max-w-[90vw] max-h-[90vh] w-[90vw] h-[90vh] flex'>
    <Dialog.Header class='w-full'>
      <Dialog.Title>
        <div class='flex align-items-ed bg-inherit sticky top-0 z-10 py-3 px-3'>
          <Input type='text' placeholder='Search...' on:input={filter} />
        </div>
      </Dialog.Title>
      <Dialog.Description class='overflow-auto px-3'>
        <div class='rounded-md border'>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.Head>Name</Table.Head>
                <Table.Head class='w-[90px]'>Size</Table.Head>
                <Table.Head class='w-[60px]'>Seed</Table.Head>
                <Table.Head class='w-[60px]'>Leech</Table.Head>
                <Table.Head class='w-[60px]'>Downloads</Table.Head>
                <Table.Head class='w-[120px]'>Released</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {#if filtered}
                {#each filtered as row}
                  <Table.Row on:click={() => fetchAndAddTorrent(row)} class='cursor-pointer'>
                    <Table.Cell class='text-base'>
                      {row.title}
                      <div class='flex flex-row text-black font-medium text-xs'>
                        {#each sanitiseTerms(row.parseObject) as { text, color }}
                          <div style={'background:' + color} class='rounded px-3 py-0.5 me-2 mt-1'>
                            {text}
                          </div>
                        {/each}
                      </div>
                    </Table.Cell>
                    <Table.Cell>{row.size}</Table.Cell>
                    <Table.Cell>{row.seeders ?? '?'}</Table.Cell>
                    <Table.Cell>{row.leechers ?? '?'}</Table.Cell>
                    <Table.Cell>{row.downloads ?? '?'}</Table.Cell>
                    <Table.Cell class='text-nowrap'>{since(row.date)}</Table.Cell>
                  </Table.Row>
                {/each}
              {/if}
            </Table.Body>
          </Table.Root>
        </div>
      </Dialog.Description>
    </Dialog.Header>
  </Dialog.Content>
</Dialog.Root>
