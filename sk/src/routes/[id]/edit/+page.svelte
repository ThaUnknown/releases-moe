<script lang='ts' context='module'>
  import parseTorrent from 'parse-torrent'
  import anitomyScript from 'anitomyscript'
  import { TorrentsTrackerOptions, type TorrentsResponse } from '$lib/pocketbase/generated-types'

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
    const parseObject: any = await anitomyScript(torrent.name)
    return {
      infoHash: torrent.infoHash,
      dualAudio: isDualAudio(parseObject.audio_term),
      files: torrent.files.map(({ length, name }: any) => ({ length, name })),
      releaseGroup: parseObject.release_group || '',
      tracker,
      url
    }
  }

  let bestRelease = ''

  async function submit (e: Event) {
    if (!torrents?.length) return toast.error('No Torrent Files Provided')
    try {
      const savedTorrents = []
      for (const torrent of torrents) {
        savedTorrents.push(await save('torrents', torrent))
      }
      const best = savedTorrents.find(({ infoHash }) => infoHash === bestRelease)?.id
      const newEntry = { ...entry, alID: media.id, torrents: savedTorrents.map(({ id }) => id), best }

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
</script>

<MediaDetails {media} />
<form on:submit|preventDefault={submit} class='pb-20'>
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
        <input type='checkbox' id={'isBest' + i} checked={bestRelease === torrent.infoHash} on:input={({ target }) => { if (target.checked) bestRelease = torrent.infoHash }} />
        <label for={'isBest' + i}>Is Best</label>
      </div>
    </div>
    <button class='btn btn-danger' type='button' on:click={() => remove(torrent)}>Delete</button>
    <hr class='my-20 bg-light' />
  {/each}
  <input class='btn btn-primary' value='Submit' type='submit' />
</form>
