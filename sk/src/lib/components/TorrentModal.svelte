<script lang='ts'>
  import type { TorrentEntry } from '$lib/tosho'
  import { sanitiseTerms, since } from '$lib/util'

  export let modalContent: TorrentEntry[] | null = null

  export let addTorrentFile: Function

  $: updateBody(modalContent)

  $: filtered = modalContent

  function updateBody (modalContent: TorrentEntry[] | null) {
    document.body.classList.toggle('modal-open', !!modalContent)
  }

  async function filter ({ target }: Event) {
    if (!modalContent) return
    const searchText = (target as HTMLInputElement).value

    filtered = modalContent.filter(({ title }: any) => title.toLowerCase().includes(searchText.toLowerCase()))
  }

  async function fetchAndAddTorrent (row: TorrentEntry) {
    modalContent = null
    const torrentRequest = await fetch(row.link)
    addTorrentFile(await torrentRequest.arrayBuffer())
  }
</script>

{#if filtered}
  <div class='modal-backdrop fade show' />
  <div class='modal fade'
    class:show={modalContent}
    data-bs-backdrop='static'
    data-bs-keyboard='false'
    tabindex='-1'
    on:pointerup|self={() => { modalContent = null }}
    role='dialog'>
    <div class='modal-dialog modal-dialog-centered modal-fullscreen p-5'>
      <div class='modal-content bg-dark-subtle rounded border overflow-y-scroll'>
        <div class='d-flex align-items-ed bg-dark-subtle position-sticky top-0 z-10 px-3 py-3'>
          <div class='material-symbols-outlined text-danger symbol-bold pt-1' title='Badges Are a Rough Guess of Information And Might Not Be Representative of Actual Data'>
            warning
          </div>
          <input type='text' class='form-control bg-dark specific-w-300 mx-2' placeholder='Search...' on:input={filter} />
          <button class='btn btn-square bg-dark rounded-circle ms-auto pointer' type='button' on:click={() => { modalContent = null }}> &times; </button>
        </div>
        <table class='table table-hover mb-0'>
          <thead>
            <tr>
              <th />
              <th>Name</th>
              <th>Size</th>
              <th>Seed</th>
              <th>Leech</th>
              <th>Downloads</th>
              <th>Released</th>
            </tr>
          </thead>
          <tbody class='pointer'>
            {#each filtered as row}
              <tr on:click={() => fetchAndAddTorrent(row)}>
                <td class='py-2 ps-4 pe-0'>
                  {#if row.verified}
                    <div class='text-success material-symbols-outlined font-size-24 symbol-bold' title='Verified'>
                      verified
                    </div>
                  {:else if row.batch}
                    <div class='text-light material-symbols-outlined font-size-24 symbol-bold' title='Batch'>
                      database
                    </div>
                  {/if}
                </td>
                <td class='py-2 px-3'>{row.title}
                  <div class='d-flex flex-row text-dark font-weight-bold font-size-12'>
                    {#each sanitiseTerms(row.parseObject) as { text, color }}
                      <div style={'background:' + color} class='rounded px-3 me-2 mt-1'>
                        {text}
                      </div>
                    {/each}
                  </div>
                </td>
                <td class='py-10 px-20 text-nowrap'>{row.size}</td>
                <td class='py-10 px-20'>{row.seeders ?? '?'}</td>
                <td class='py-10 px-20'>{row.leechers ?? '?'}</td>
                <td class='py-10 px-20'>{row.downloads ?? '?'}</td>
                <td class='py-10 px-20 text-nowrap'>{since(row.date)}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>
{/if}

<style>
  .symbol-bold {
    font-variation-settings: 'wght' 500;
  }
  .show {
    display: block;
  }
</style>
