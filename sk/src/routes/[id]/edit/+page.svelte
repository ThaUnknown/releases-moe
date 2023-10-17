<script lang='ts' context='module'>
  import parseTorrent from 'parse-torrent'
  import anitomyscript from 'anitomyscript'
  import { TorrentsTrackerOptions, type TorrentsResponse, type EntriesRecord } from '$lib/pocketbase/generated-types'

  function getTrackerByComment (comment: string): { tracker: TorrentsTrackerOptions, url: string } {
    if (comment.startsWith('https://nyaa.si/view/')) return { tracker: TorrentsTrackerOptions.Nyaa, url: comment }
    if (comment.includes('AniDex')) {
      const match = comment.match(/\[AniDex Torrent #(\d+)]/)
      if (match?.[1]) return { tracker: TorrentsTrackerOptions.AniDex, url: 'https://anidex.info/torrent/' + match[1] }
    }
    return { url: '', tracker: TorrentsTrackerOptions.AnimeBytes }
  }

  function isDualAudio (audioTerm: string | string[]) {
    const check = (string: string) => string?.toLowerCase().replace(/[ -]/g, '').includes('dualaudio')
    if (Array.isArray(audioTerm)) return audioTerm.some(check)
    return check(audioTerm)
  }
</script>

<script lang='ts'>
  import { toast } from 'svelte-sonner'

  import { goto } from '$app/navigation'
  import type { PageData } from './$types'

  import { client, save } from '$lib/pocketbase/index.js'
  import MediaDetails from '$lib/components/MediaDetails.svelte'
  import { sanitiseTerms, since } from '$lib/util'
  import { getToshotTorrentsForID, type TorrentEntry } from '$lib/tosho'

  export let data: PageData

  const { entry, media } = data
  let torrents = entry?.expand?.trs || []

  async function processSingleTorrent (file: Blob) {
    const torrent = await parseTorrent(new Uint8Array(await file.arrayBuffer()))
    try {
      return await client
        .collection('torrents')
        .getFirstListItem<TorrentsResponse<any>>(`infoHash="${torrent.infoHash}"`)
    } catch (e) {}

    const { tracker, url } = getTrackerByComment(torrent.comment)
    const parseObject: any = await anitomyscript(torrent.name)
    return {
      infoHash: torrent.infoHash,
      dualAudio: isDualAudio(parseObject.audio_term),
      files: torrent.files.map(({ length, name }: any) => ({ length, name })),
      releaseGroup: parseObject.release_group || '',
      tracker,
      url
    }
  }

  async function submit (e: Event) {
    if (!torrents?.length) return toast.error('No Torrent Files Provided')
    try {
      const savedTorrents = []
      for (const torrent of torrents) {
        savedTorrents.push(await save('torrents', torrent))
      }
      const newEntry: EntriesRecord = { ...entry, alID: media.id, trs: savedTorrents.map(({ id }) => id) }

      await save('entries', newEntry)
      toast.success('Entry Created')
      goto('..')
    } catch (error) {
      toast.error('Failed To Save Entry' + error)
    }
  }

  async function parseTorrentFiles ({ target }: Event) {
    const files = [...(target as HTMLInputElement).files as FileList]

    torrents = [...torrents, ...await Promise.all(files.map(file => processSingleTorrent(file)))] as TorrentsResponse<any>[]
  }

  function remove (torrent: TorrentsResponse) {
    const index = torrents.indexOf(torrent)
    torrents.splice(index, 1)
    torrents = torrents
  }
  const toshoTorrents = getToshotTorrentsForID(media.id)

  async function findTorrents () {
    toast.promise(toshoTorrents, {
      loading: `Looking for torrents for ${media.title.userPreferred}...`,
      success: `Found torrents for ${media.title.userPreferred}.`,
      error: (err: any) => `Couldn't find torrents for ${media.title.userPreferred}\n${err.message}`
    })
    filtered = await toshoTorrents
    showModal = true
  }

  let filtered: TorrentEntry[] = []
  let showModal = false

  async function filter ({ target }: InputEvent) {
    const searchText = (target as HTMLInputElement).value

    filtered = (await toshoTorrents).filter(({ title }: any) => title.toLowerCase().includes(searchText.toLowerCase()))
  }

  async function fetchAndAddTorrent (row: TorrentEntry) {
    showModal = false
    const torrentRequest = await fetch(row.link)
    const torrentData = await torrentRequest.arrayBuffer()
    const file = new File([torrentData], row.title || '')
    torrents = [...torrents, await processSingleTorrent(file)] as TorrentsResponse<any>[]
  }
</script>

<div class='modal z-40' class:show={showModal}>
  <div class='modal-dialog' on:pointerup|self={() => { showModal = false }} tabindex='-1' role='button'>
    <div class='modal-content w-auto h-full mx-20 p-0 rounded overflow-x-hidden overflow-y-scroll'>
      <div class='w-full bg-dark-light d-flex px-15 py-10 position-sticky top-0 z-10'>
        <div class='material-symbols-outlined text-danger symbol-bold pt-5' title='Badges Are a Rough Guess of Information And Might Not Be Representative of Actual Data'>
          warning
        </div>
        <input type='text' class='form-control bg-dark w-300 ml-15' placeholder='Search...' on:input={filter} />
        <button class='btn btn-square bg-dark rounded-circle ml-auto pointer' type='button' on:click={() => { showModal = false }}> &times; </button>
      </div>
      <table class='table table-hover font-size-14 position-relative'>
        <thead>
          <tr class='border-0'>
            <td class='py-15 pl-20 pr-0' />
            <td class='py-15 px-20'>Name</td>
            <td class='py-15 px-20'>Size</td>
            <td class='py-15 px-20'>Seed</td>
            <td class='py-15 px-20'>Leech</td>
            <td class='py-15 px-20'>Downloads</td>
            <td class='py-15 px-20'>Released</td>
          </tr>
        </thead>
        <tbody class='pointer'>
          {#each filtered as row}
            <tr class='border-0' on:click={() => fetchAndAddTorrent(row)}>
              <td class='py-10 pl-20 pr-0'>
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
              <td class='py-10 px-20'>{row.title}
                <div class='d-flex flex-row text-dark font-weight-bold font-size-12'>
                  {#each sanitiseTerms(row.parseObject) as { text, color }}
                    <div style={'background:' + color} class='rounded px-15 mr-10 mt-5'>
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

<form on:submit|preventDefault={submit}>
  <div class='row px-20 justify-content-center'>
    <div class='col-lg-3 col-12 mb-15'>
      <MediaDetails {media} />
      <input class='btn btn-primary mt-15' value='Save' type='submit' />
      <button class='btn btn-success' type='button' on:click={findTorrents}>Find Torrents</button>
    </div>
    <div class='col ml-lg-20'>
      <div class='form-group'>
        <label for='notes'>Notes</label>
        <textarea class='form-control' id='notes' placeholder='Entry notes' bind:value={entry.notes} />
      </div>
      <div class='form-group'>
        <label for='comparison'>Comparison</label>
        <input type='text' class='form-control' id='comparison' placeholder='Comma Separated Links' bind:value={entry.comparison} />
      </div>
      <div class='form-group'>
        <div class='custom-switch'>
          <input type='checkbox' id='incomplete' bind:checked={entry.incomplete} />
          <label for='incomplete'>Is Incomplete</label>
        </div>
      </div>
      <div class='form-group'>
        <label for='torrents' class='required'>Torrent Files</label>
        <div class='custom-file'>
          <input type='file' id='torrents' accept='.torrent' multiple on:change={parseTorrentFiles} />
          <label for='torrents'>Choose Files</label>
        </div>
      </div>
      <hr class='my-20 bg-light' />
      {#each torrents || [] as torrent, i (torrent.infoHash)}
        <div class='form-group'>
          <label for={'infohash' + i} class='required'>InfoHash</label>
          <input type='text' class='form-control' required disabled id={'infohash' + i} bind:value={torrent.infoHash} />
        </div>
        <div class='form-group'>
          <label for={'releaseGroup' + i} class='required'>Release Group</label>
          <input type='text' class='form-control' required id={'releaseGroup' + i} bind:value={torrent.releaseGroup} />
        </div>
        <div class='form-group'>
          <label for={'tracker' + i} class='required'>Tracker</label>
          <select class='form-control' required id={'tracker' + i} bind:value={torrent.tracker}>
            {#each Object.keys(TorrentsTrackerOptions) as tracker}
              <option>{tracker}</option>
            {/each}
          </select>
        </div>
        <div class='form-group'>
          <label for={'url' + i} class='required'>URL</label>
          <input type='url' class='form-control' required id={'url' + i} bind:value={torrent.url} />
        </div>
        <div class='form-group'>
          <div class='custom-switch'>
            <input type='checkbox' id={'dualAudio' + i} bind:checked={torrent.dualAudio} />
            <label for={'dualAudio' + i}>Dual Audio</label>
          </div>
        </div>
        <div class='form-group'>
          <div class='custom-switch'>
            <input type='checkbox' id={'isBest' + i} bind:checked={torrent.isBest} />
            <label for={'isBest' + i}>Is Best</label>
          </div>
        </div>
        <button class='btn btn-danger' type='button' on:click={() => remove(torrent)}>Delete Torrent</button>
        <hr class='my-20 bg-light' />
      {/each}
    </div>
  </div>
</form>

<style>
  .modal-content {
    margin: 8rem 6rem 0 6rem !important
  }
  .symbol-bold {
    font-variation-settings: 'wght' 500;
  }
</style>
