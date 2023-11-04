<script lang='ts' context='module'>
  import parseTorrent from 'parse-torrent'
  import { TorrentsTrackerOptions, type TorrentsResponse, type EntriesRecord, type TorrentsRecord } from '$lib/pocketbase/generated-types'

  function getTrackerByComment (comment?: string): { tracker: TorrentsTrackerOptions, url: string } {
    if (!comment) return { tracker: TorrentsTrackerOptions.Nyaa, url: '' }
    if (comment.startsWith('https://nyaa.si/view/')) return { tracker: TorrentsTrackerOptions.Nyaa, url: comment }
    if (comment.includes('AniDex')) {
      const match = comment.match(/\[AniDex Torrent #(\d+)]/)
      if (match?.[1]) return { tracker: TorrentsTrackerOptions.AniDex, url: 'https://anidex.info/torrent/' + match[1] }
    }
    return { url: '', tracker: TorrentsTrackerOptions.AnimeBytes }
  }

  function isDualAudio (audioTerm?: string | string[]) {
    const check = (string?: string) => string?.toLowerCase().replace(/[ -]/g, '').includes('dualaudio')
    if (Array.isArray(audioTerm)) return audioTerm.some(check)
    return check(audioTerm)
  }

  const VIDEO_EXTENSIONS = ['3g2', '3gp', 'asf', 'avi', 'dv', 'flv', 'gxf', 'm2ts', 'm4a', 'm4b', 'm4p', 'm4r', 'm4v', 'mkv', 'mov', 'mp4', 'mpd', 'mpeg', 'mpg', 'mxf', 'nut', 'ogm', 'ogv', 'swf', 'ts', 'vob', 'webm', 'wmv', 'wtv']
  const VIDEO_RX = new RegExp(`.(${VIDEO_EXTENSIONS.join('|')})$`, 'i')
  const TYPE_EXCLUSIONS = ['ED', 'ENDING', 'NCED', 'NCOP', 'OP', 'OPENING', 'PREVIEW', 'PV']
</script>

<script lang='ts'>
  import { toast } from 'svelte-sonner'

  import { goto } from '$app/navigation'
  import type { PageData } from './$types'

  import { client, save } from '$lib/pocketbase/index.js'
  import MediaDetails from '$lib/components/MediaDetails.svelte'
  import { anitomyscript, anitomyscriptarray, sanitiseTerms, since } from '$lib/util'
  import { getToshotTorrentsForID, type TorrentEntry } from '$lib/tosho'

  export let data: PageData

  type TorrentData = TorrentsRecord|TorrentsResponse

  const { entry, media } = data
  let torrents: TorrentData[] = entry?.expand?.trs || []

  let addTorrentsAsPrivate = false

  async function checkTorrentFiles ({ files }: any) {
    if (!media.episodes) return
    const videoFiles = await anitomyscriptarray(files.filter(({ name }: any) => VIDEO_RX.test(name)).map(({ name }: any) => name))

    const episodes = videoFiles.filter(file => !TYPE_EXCLUSIONS.includes(file.anime_type?.toUpperCase()))

    if (media.episodes === episodes.length) return

    if (media.episodes < episodes.length) {
      toast.error('Detected added torrent has more video files than media has episodes. Check if the torrent doesn\'t include multiple seasons, OVAs or ONAs and add them to other AniList entries.')
    } else {
      toast.error('Detected added torrent has less video files than media has episodes. Check if the torrent doesn\'t include multiple seasons, OVAs or ONAs and add them to other AniList entries.')
    }
  }

  async function processSingleTorrent (file: Blob): Promise<TorrentData> {
    const torrent = await parseTorrent(new Uint8Array(await file.arrayBuffer()))
    checkTorrentFiles(torrent)
    if (!addTorrentsAsPrivate) {
      try {
        return await client
          .collection('torrents')
          .getFirstListItem<TorrentsResponse<any>>(`infoHash="${torrent.infoHash}"`)
      } catch (e) {}
    }

    const { tracker, url } = getTrackerByComment(torrent.comment)
    const parseObject = await anitomyscript(torrent.name)
    return {
      infoHash: addTorrentsAsPrivate ? '<redacted>' : torrent.infoHash,
      dualAudio: !!isDualAudio(parseObject.audio_term),
      isBest: false,
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
    const _target = (target as HTMLInputElement)
    const files = [..._target.files as FileList]
    _target.value = ''

    torrents = [...torrents, ...await Promise.all(files.map(file => processSingleTorrent(file)))]
  }

  function remove (torrent: TorrentData) {
    const index = torrents.indexOf(torrent)
    torrents.splice(index, 1)
    torrents = torrents
  }
  const toshoTorrents = getToshotTorrentsForID(media.id)

  async function findTorrents () {
    toast.promise(toshoTorrents, {
      loading: `Looking for torrents for ${media.title.english || media.title.userPreferred}...`,
      success: `Found torrents for ${media.title.english || media.title.userPreferred}.`,
      error: (err: any) => `Couldn't find torrents for ${media.title.english || media.title.userPreferred}\n${err.message}`
    })
    filtered = await toshoTorrents
    showModal = true
  }

  let filtered: TorrentEntry[] = []
  let showModal = false

  $: updateBody(showModal)

  function updateBody (showModal: boolean) {
    document.body.classList.toggle('modal-open', showModal)
  }

  async function filter ({ target }: Event) {
    const searchText = (target as HTMLInputElement).value

    filtered = (await toshoTorrents).filter(({ title }: any) => title.toLowerCase().includes(searchText.toLowerCase()))
  }

  async function fetchAndAddTorrent (row: TorrentEntry) {
    showModal = false
    const torrentRequest = await fetch(row.link)
    const torrentData = await torrentRequest.arrayBuffer()
    const file = new File([torrentData], row.title || '')
    torrents = [...torrents, await processSingleTorrent(file)]
  }

  let torrentIdInputValue = ''

  async function addTorrentById () {
    let torrent
    try {
      torrent = await client.collection('torrents').getOne(torrentIdInputValue) as TorrentsResponse
    } catch (e) {
      toast.error('Torrent Not Found: ' + e)
    }
    if (!torrent) return
    checkTorrentFiles(torrent)
    if (addTorrentsAsPrivate && torrent.infoHash !== '<redacted>') {
      torrent.id = ''
      torrent.infoHash = '<redacted>'
    }
    torrents = [...torrents, torrent]
  }
</script>
{#if showModal}
  <div class='modal-backdrop fade show' />
{/if}
<div class='modal fade'
  class:show={showModal}
  data-bs-backdrop='static'
  data-bs-keyboard='false'
  tabindex='-1'
  on:pointerup|self={() => { showModal = false }}
  role='dialog'>
  <div class='modal-dialog modal-dialog-centered modal-fullscreen p-5'>
    <div class='modal-content bg-dark-subtle rounded border overflow-y-scroll'>
      <div class='d-flex align-items-ed bg-dark-subtle position-sticky top-0 z-10 px-3 py-3'>
        <div class='material-symbols-outlined text-danger symbol-bold pt-1' title='Badges Are a Rough Guess of Information And Might Not Be Representative of Actual Data'>
          warning
        </div>
        <input type='text' class='form-control bg-dark specific-w-300 mx-2' placeholder='Search...' on:input={filter} />
        <button class='btn btn-square bg-dark rounded-circle ms-auto pointer' type='button' on:click={() => { showModal = false }}> &times; </button>
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

<form on:submit|preventDefault={submit}>
  <div class='row justify-content-center'>
    <div class='col-lg-3 col-12 mb-3'>
      <MediaDetails {media} />
      <div class='text-muted pt-2'>Episodes: {media.episodes || 'N/A'}</div>
      <input class='btn btn-primary mt-3 px-3 me-1' value='Save' type='submit' />
      <button class='btn btn-success mt-3 px-3' type='button' on:click={findTorrents}>Find Torrents</button>
      <div class='my-3'>
        <label for='torrents' class='form-label'>Add torrent file(s)</label>
        <input class='form-control' type='file' id='torrents' accept='.torrent' multiple on:input={parseTorrentFiles} />
      </div>
      <div class='input-group mb-3'>
        <label class='input-group-text' for='addByTorrentId'>Add By ID</label>
        <input type='text' class='form-control' placeholder='Torrent ID' id='addByTorrentId' bind:value={torrentIdInputValue} />
        <button type='button' class='btn btn-primary' on:click={addTorrentById}>Add</button>
      </div>
      <div class='form-check'>
        <input class='form-check-input' type='checkbox' bind:checked={addTorrentsAsPrivate} id='addTorrentsAsPrivate' />
        <label class='form-check-label' for='addTorrentsAsPrivate'>Parse Next Torrent File As Private</label>
      </div>
    </div>
    <div class='col'>
      <div class='mb-2'>
        <label for='notes' class='form-label'>Notes</label>
        <textarea class='form-control' id='notes' placeholder='Entry notes' bind:value={entry.notes} />
      </div>
      <div class='mb-2'>
        <label for='comparison' class='form-label'>Comparisons</label>
        <input type='text' class='form-control' id='comparison' placeholder='Comma Separated Links' bind:value={entry.comparison} />
      </div>
      <div class='form-check'>
        <input class='form-check-input' type='checkbox' id='incomplete' bind:checked={entry.incomplete} />
        <label class='form-check-label' for='incomplete'>Is Incomplete</label>
      </div>

      {#each torrents || [] as torrent, i (i)}
        <hr />
        <div class='mb-2'>
          <label for={'infohash' + i} class='form-label'>InfoHash</label>
          <input type='text' class='form-control' required disabled id={'infohash' + i} bind:value={torrent.infoHash} />
        </div>
        <div class='mb-2'>
          <label for={'releaseGroup' + i} class='form-label'>Release Group</label>
          <input type='text' class='form-control' required id={'releaseGroup' + i} bind:value={torrent.releaseGroup} />
        </div>
        <div class='mb-2'>
          <label for={'tracker' + i} class='form-label'>Tracker</label>
          <select class='form-select' required id={'tracker' + i} bind:value={torrent.tracker}>
            {#each Object.keys(TorrentsTrackerOptions) as tracker}
              <option>{tracker}</option>
            {/each}
          </select>
        </div>
        <div class='mb-2'>
          <label for={'url' + i} class='form-label'>URL</label>
          <input type='text' class='form-control' required id={'url' + i} bind:value={torrent.url} />
        </div>
        <div class='form-check'>
          <input type='checkbox' id={'dualAudio' + i} class='form-check-input' bind:checked={torrent.dualAudio} />
          <label for={'dualAudio' + i} class='form-check-label'>Dual Audio</label>
        </div>
        <div class='form-check mb-2'>
          <input type='checkbox' id={'isBest' + i} class='form-check-input' bind:checked={torrent.isBest} />
          <label for={'isBest' + i} class='form-check-label'>Is Best</label>
        </div>
        <h5>Video Files</h5>
        <ul>
          {#each torrent.files.filter(({ name }) => VIDEO_RX.test(name)) as file}
            <li>{file.name}</li>
          {/each}
        </ul>
        <button class='btn btn-danger' type='button' on:click={() => remove(torrent)}>Delete Torrent</button>
        {#if torrent.id}
          <button class='btn btn-primary' type='button' on:click={() => navigator.clipboard.writeText(torrent.id)}>Copy Torrent ID</button>
        {/if}
      {/each}
    </div>
  </div>
</form>

<style>
  .symbol-bold {
    font-variation-settings: 'wght' 500;
  }
  .show {
    display: block;
  }
</style>
