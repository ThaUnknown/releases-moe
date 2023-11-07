<script lang='ts' context='module'>
  import { TorrentsTrackerOptions, type TorrentsResponse, type EntriesRecord, type TorrentsRecord } from '$lib/pocketbase/generated-types'
  import TorrentModal from '$lib/components/TorrentModal.svelte'
  import MediaDetails from '$lib/components/MediaDetails.svelte'
  import { TYPE_EXCLUSIONS, VIDEO_RX, anitomyscriptarray } from '$lib/util'
  import { client, save } from '$lib/pocketbase/index.js'
  import { getToshotTorrentsForID, type TorrentEntry } from '$lib/tosho'
</script>

<script lang='ts'>
  import { toast } from 'svelte-sonner'

  import { goto, invalidateAll } from '$app/navigation'
  import type { PageData } from './$types'
  import TorrentEditorForm from '$lib/components/TorrentEditorForm.svelte'
  import { createTorrentFromData } from '$lib/torrent'

  export let data: PageData

  type TorrentData = { id?: string } & (TorrentsRecord|TorrentsResponse)

  const { entry, media } = data
  let torrents: TorrentData[] = entry?.expand?.trs || []

  async function checkTorrentVideoFiles ({ files }: any) {
    if (!media.episodes) return
    const videoFiles = await anitomyscriptarray(files.filter(({ name }: any) => VIDEO_RX.test(name)).map(({ name }: any) => name))

    const episodes = videoFiles.filter(file => !TYPE_EXCLUSIONS.includes(file.anime_type?.toUpperCase() || ''))

    if (media.episodes === episodes.length) return

    if (media.episodes < episodes.length) {
      toast.error('Detected added torrent has more video files than media has episodes. Check if the torrent doesn\'t include multiple seasons, OVAs or ONAs and add them to other AniList entries.')
    } else {
      toast.error('Detected added torrent has less video files than media has episodes. Check if the torrent doesn\'t include multiple seasons, OVAs or ONAs and add them to other AniList entries.')
    }
  }

  async function addTorrentFile (buffer: ArrayBuffer) {
    const torrent = await createTorrentFromData(new Uint8Array(buffer))
    checkTorrentVideoFiles(torrent)
    torrents = [...torrents, torrent]
  }

  async function findOrCreateTorrentEntry (torrent: TorrentData) {
    if (torrent.id) return (await save('torrents', torrent)).id
    // find
    try {
      if (torrent.infoHash === '<redacted>') {
        return (await client.collection('torrents').getFirstListItem(
          `infoHash='<redacted>' && tracker='${torrent.tracker}' && url='${torrent.url}' && dualAudio=${torrent.dualAudio} && releaseGroup='${torrent.releaseGroup}' && isBest=${torrent.isBest}`
        )).id
      } else {
        return (await client.collection('torrents').getFirstListItem(`infoHash='${torrent.infoHash}'`)).id
      }
    } catch (e) {
      // create
      return (await save('torrents', torrent)).id
    }
  }

  async function submit (e: Event) {
    if (!torrents?.length) return toast.error('No Torrent Files Provided')
    try {
      const savedTorrents = []
      for (const torrent of torrents) {
        if (torrent.tracker === TorrentsTrackerOptions.AnimeBytes) {
          torrent.infoHash = '<redacted>'
          torrent.id = ''
        }
        savedTorrents.push(await findOrCreateTorrentEntry(torrent))
      }
      const newEntry: EntriesRecord = { ...entry, alID: media.id, trs: savedTorrents }

      await save('entries', newEntry)
      toast.success('Entry Created')
      await invalidateAll()
      goto('..')
    } catch (error) {
      toast.error('Failed To Save Entry' + error)
    }
  }

  function duplicateTorrent (original: TorrentData) {
    const torrent = { ...original }
    torrent.id = ''
    torrents = [...torrents, torrent]
  }

  async function parseTorrentFileInput ({ target }: Event) {
    const _target = (target as HTMLInputElement)
    const files = [..._target.files as FileList]
    _target.value = ''

    for (const file of files) {
      await addTorrentFile(await file.arrayBuffer())
    }
  }

  function removeSingleTorrent (torrent: TorrentData) {
    const index = torrents.indexOf(torrent)
    torrents.splice(index, 1)
    torrents = torrents
  }
  async function findTorrentsOnline () {
    const toshoTorrents = getToshotTorrentsForID(media.id)

    toast.promise(toshoTorrents, {
      loading: `Looking for torrents for ${media.title.english || media.title.userPreferred}...`,
      success: `Found torrents for ${media.title.english || media.title.userPreferred}.`,
      error: (err: any) => `Couldn't find torrents for ${media.title.english || media.title.userPreferred}\n${err.message}`
    })
    modalContent = await toshoTorrents
  }

  let modalContent: TorrentEntry[] | null = null

  let torrentIdInputValue = ''

  async function addTorrentById () {
    let torrent
    try {
      torrent = await client.collection('torrents').getOne(torrentIdInputValue) as TorrentsResponse
    } catch (e) {
      toast.error('Torrent Not Found: ' + e)
    }
    if (!torrent) return
    checkTorrentVideoFiles(torrent)
    torrent.id = ''
    torrents = [...torrents, torrent]
  }
</script>
<TorrentModal bind:modalContent {addTorrentFile} />

<form on:submit|preventDefault={submit}>
  <div class='row justify-content-center'>
    <div class='col-lg-3 col-12 mb-3'>
      <MediaDetails {media} />
      <div class='text-muted pt-2'>Episodes: {media.episodes || 'N/A'}</div>
      <input class='btn btn-primary mt-3 px-3 me-1' value='Save' type='submit' />
      <button class='btn btn-success mt-3 px-3' type='button' on:click={findTorrentsOnline}>Find Torrents</button>
      <div class='my-3'>
        <label for='torrents' class='form-label'>Add torrent file(s)</label>
        <input class='form-control' type='file' id='torrents' accept='.torrent' multiple on:input={parseTorrentFileInput} />
      </div>
      <div class='input-group mb-3'>
        <label class='input-group-text' for='addByTorrentId'>Add By ID</label>
        <input type='text' class='form-control' placeholder='Torrent ID' id='addByTorrentId' bind:value={torrentIdInputValue} />
        <button type='button' class='btn btn-primary' on:click={addTorrentById}>Add</button>
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
      <div class='mb-2'>
        <label for='theoreticalBest' class='form-label'>Theoretical Best</label>
        <input type='text' class='form-control' id='theoreticalBest' placeholder='Potential Unmuxed Combination' bind:value={entry.theoreticalBest} />
      </div>
      <div class='form-check'>
        <input class='form-check-input' type='checkbox' id='incomplete' bind:checked={entry.incomplete} />
        <label class='form-check-label' for='incomplete'>Is Incomplete</label>
      </div>

      {#each torrents || [] as torrent, i (i)}
        <hr />
        <TorrentEditorForm bind:torrent {i} {removeSingleTorrent} {duplicateTorrent} />
      {/each}
    </div>
  </div>
</form>
