<script lang='ts' context='module'>
  import { type EntriesRecord, type TorrentsRecord } from '$lib/pocketbase/generated-types'
  import TorrentModal from '$lib/components/TorrentModal.svelte'
  import MediaDetails from '$lib/components/MediaDetails.svelte'
  import { TYPE_EXCLUSIONS, VIDEO_RX, anitomyscriptarray } from '$lib/util'
  import { client, save } from '$lib/pocketbase/index.js'
  import { getToshotTorrentsForID, type TorrentEntry } from '$lib/tosho'
</script>

<script lang='ts'>
  import { metadata } from '$lib/app/stores'
  import { toast } from 'svelte-sonner'

  import { goto, invalidateAll } from '$app/navigation'
  import type { PageData } from './$types'
  import TorrentEditorForm from '$lib/components/TorrentEditorForm.svelte'
  import { createTorrentFromData, fromTorrentList, PRIVATE_TRACKERS } from '$lib/torrent'
  import MediaRelations from '$lib/components/MediaRelations.svelte'
  import { Button } from '$lib/components/ui/button'
  import { Input } from '$lib/components/ui/input'
  import { Label } from '$lib/components/ui/label'
  import { Textarea } from '$lib/components/ui/textarea'
  import { Checkbox } from '$lib/components/ui/checkbox'
  import { Separator } from '$lib/components/ui/separator'

  export let data: PageData

  type TorrentData = { id?: string } & TorrentsRecord

  let { entry, media } = data
  let torrents: TorrentData[] = entry?.expand?.trs || []

  $: entry = data.entry
  $: media = data.media
  $: torrents = entry.expand?.trs || torrents || []

  $metadata.title = 'Editing ' + media.title.userPreferred

  async function checkTorrentVideoFiles ({ files }: TorrentData) {
    if (!media.episodes) return
    const videoFiles = await anitomyscriptarray(files?.filter(({ name }) => VIDEO_RX.test(name)).map(({ name }) => name) || [])

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
    torrents.push(torrent)
    torrents = torrents
  }

  async function findOrCreateTorrentEntry (torrent: TorrentData) {
    // save creates or updates existing
    if (torrent.id) return (await save('torrents', torrent)).id
    try {
      // find existing for given torrent file
      if (torrent.infoHash === '<redacted>') {
        const id = (await client.collection('torrents').getFirstListItem(
          `infoHash='<redacted>' && tracker='${torrent.tracker}' && url='${torrent.url}'`
        )).id
        torrent.id = id
        return (await save('torrents', torrent)).id
      } else {
        return (await client.collection('torrents').getFirstListItem(`infoHash='${torrent.infoHash}'`)).id
      }
    } catch (e) {
      // create new
      return (await save('torrents', torrent)).id
    }
  }

  async function submit () {
    if (!torrents?.length) return toast.error('No Torrent Files Provided')
    try {
      const savedTorrents = []
      for (const torrent of torrents) {
        // we want to duplicate torrents on private trackers, so id is removed to not override existing entries on publics
        if (PRIVATE_TRACKERS.includes(torrent.tracker) && torrent.infoHash !== '<redacted>') {
          torrent.infoHash = '<redacted>'
          torrent.id = ''
          try {
            torrent.url = new URL(torrent.url).pathname
          } catch (e) {
          // it was already a pathname
          }
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
    const torrent = structuredClone(original)
    torrent.id = ''
    torrents.push(torrent)
    torrents = torrents
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
      error: (err: unknown) => `Couldn't find torrents for ${media.title.english || media.title.userPreferred}\n${(err as Error).message}`
    })
    modalContent = await toshoTorrents
  }

  let modalContent: TorrentEntry[] | null = null

  let torrentIdInputValue = ''

  async function addTorrentById () {
    let torrent
    try {
      torrent = await client.collection<TorrentData>('torrents').getOne(torrentIdInputValue)
    } catch (e) {
      toast.error('Torrent Not Found: ' + e)
    }
    if (!torrent) return
    checkTorrentVideoFiles(torrent)
    torrent.id = ''
    torrents.push(torrent)
    torrents = torrents
  }

  async function createABFromFileList () {
    const torrent = await fromTorrentList()
    if (!torrent) return
    torrents.push(torrent)
    torrents = torrents
  }
</script>
<TorrentModal bind:modalContent {addTorrentFile} />

<form on:submit|preventDefault={submit}>
  <div class='flex h-full lg:flex-row flex-col justify-content-center'>
    <div class='mb-3 min-w-0 max-w-72 shrink-0'>
      <MediaDetails {media} />
      <div class='pt-2'>Episodes: {media.episodes || 'N/A'}</div>
      <Separator class='my-10' />
      <Button type='submit' class='me-1 px-3 mt-3'>Save</Button>
      <Button variant='secondary' class='me-1 px-3 mt-3' on:click={findTorrentsOnline}>Find Torrents</Button>
      <Button variant='secondary' class='me-1 px-3 mt-3' on:click={createABFromFileList}>Create From FileList</Button>
      <div class='my-3'>
        <Label for='torrents'>Add torrent file(s)</Label>
        <Input class='cursor-pointer' type='file' id='torrents' accept='.torrent' multiple on:input={parseTorrentFileInput} />
      </div>
      <Label for='addByTorrentId'>Add By ID</Label>
      <div class='flex w-full items-center gap-2'>
        <Input type='text' placeholder='Torrent ID' id='addByTorrentId' bind:value={torrentIdInputValue} />
        <Button variant='secondary' on:click={addTorrentById}>Add</Button>
      </div>
    </div>
    <Separator orientation='vertical' class='mx-10 h-auto' />
    <div class='w-full'>
      <div class='mb-2'>
        <Label for='notes'>Notes</Label>
        <Textarea id='notes' placeholder='Entry notes' class='min-h-32' bind:value={entry.notes} />
      </div>
      <div class='mb-2'>
        <Label for='comparison'>Comparisons</Label>
        <Input type='text' id='comparison' placeholder='Comma Separated Links' bind:value={entry.comparison} />
      </div>
      <div class='mb-2'>
        <Label for='theoreticalBest'>Theoretical Best</Label>
        <Input type='text' id='theoreticalBest' placeholder='Potential Unmuxed Combination' bind:value={entry.theoreticalBest} />
      </div>
      <div class='form-check'>
        <Checkbox id='incomplete' bind:checked={entry.incomplete} />
        <Label for='incomplete'>Is Incomplete</Label>
      </div>

      {#each torrents || [] as torrent, i (i)}
        <Separator class='my-5' />
        <TorrentEditorForm bind:torrent {i} {removeSingleTorrent} {duplicateTorrent} />
      {/each}
      {#key media.id}
        <MediaRelations edges={media.relations?.edges} edit={true} />
      {/key}
    </div>
  </div>
</form>
