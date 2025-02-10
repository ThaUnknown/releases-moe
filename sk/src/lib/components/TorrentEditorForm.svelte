<script lang='ts'>
  import { TorrentsTrackerOptions, type TorrentsRecord } from '$lib/pocketbase/generated-types'
  import { Checkbox } from '$lib/components/ui/checkbox'
  import { Input } from '$lib/components/ui/input'
  import { Label } from '$lib/components/ui/label'
  import * as Select from '$lib/components/ui/select'
  import * as Accordion from '$lib/components/ui/accordion'
  import { Button } from './ui/button'
  import { PRIVATE_TRACKERS, URL_TRACKER_MAP } from '$lib/torrent'

  type TorrentData = { id?: string } & TorrentsRecord

  export let torrent: TorrentData
  export let i: number
  export let removeSingleTorrent: (torrent: TorrentData) => void
  export let duplicateTorrent: (torrent: TorrentData) => void

  function removeTorrentFile (i: number) {
    if (!torrent.files) return
    torrent.files.splice(i, 1)
    torrent = torrent
  }
  function selectTracker (obj: { value: TorrentsTrackerOptions } | undefined) {
    if (obj) torrent.tracker = obj.value
  }
  $: selectedTracker = torrent.tracker
    ? { label: torrent.tracker, value: torrent.tracker }
    : undefined

  function updateTracker () {
    const ent = Object.entries(URL_TRACKER_MAP).find(([url]) => torrent.url.startsWith(url)) ?? []
    if (ent[1]) {
      torrent.tracker = ent[1]
    }
  }
</script>

<div class='grid grid-cols-2 gap-3'>
  <div>
    <div class='mb-2'>
      <Label for={'infohash' + i}>InfoHash</Label>
      {#if PRIVATE_TRACKERS.includes(torrent.tracker)}
        <Input type='text' class='form-control disabled' required disabled id={'infohash' + i} value='<redacted>' />
      {:else}
        <Input type='text' class='form-control disabled' required disabled id={'infohash' + i} bind:value={torrent.infoHash} />
      {/if}
    </div>
  </div>
  <div>
    <div class='mb-2'>
      <Label for={'releaseGroup' + i}>Release Group</Label>
      <Input type='text' class='form-control' required id={'releaseGroup' + i} bind:value={torrent.releaseGroup} />
    </div>
  </div>
</div>
<div class='grid grid-cols-2 gap-3'>
  <div>
    <div class='mb-2'>
      <Label>Tracker</Label>
      <Select.Root required selected={selectedTracker} onSelectedChange={selectTracker}>
        <Select.Trigger>
          <Select.Value placeholder='Select a tracker' />
        </Select.Trigger>
        <Select.Content>
          {#each Object.keys(TorrentsTrackerOptions) as tracker}
            <Select.Item value={tracker} />
          {/each}
        </Select.Content>
      </Select.Root>
    </div>
  </div>
  <div>
    <div class='mb-2'>
      <Label for={'url' + i}>URL</Label>
      <Input type='text' class='form-control' on:change={updateTracker} required id={'url' + i} bind:value={torrent.url} />
    </div>
  </div>
</div>
<div class='flex mb-2'>
  <div class='form-check me-3'>
    <Checkbox id={'isBest' + i} bind:checked={torrent.isBest} />
    <Label for={'isBest' + i}>Is Best</Label>
  </div>
  <div class='form-check'>
    <Checkbox id={'dualAudio' + i} bind:checked={torrent.dualAudio} />
    <Label for={'dualAudio' + i}>Dual Audio</Label>
  </div>
</div>
<Accordion.Root class='mb-2'>
  <Accordion.Item value='item-1' class='border rounded-md'>
    <Accordion.Trigger class='px-3 py-2'>Video Files</Accordion.Trigger>
    <Accordion.Content class='px-3 pt-2'>
      {#each torrent.files || [] as file, i}
        <li class='mb-1 flex'>
          {file.name}
          {#if torrent.tracker === TorrentsTrackerOptions.PT}
            <Button class='ms-auto' size='sm' variant='destructive' on:click={() => removeTorrentFile(i)}>Remove</Button>
          {/if}
        </li>
      {/each}
    </Accordion.Content>
  </Accordion.Item>
</Accordion.Root>

<Button variant='destructive' size='sm' on:click={() => removeSingleTorrent(torrent)}>Delete</Button>
<Button variant='secondary' size='sm' on:click={() => duplicateTorrent(torrent)}>Duplicate</Button>
{#if torrent.id}
  <Button variant='secondary' size='sm' on:click={() => navigator.clipboard.writeText(torrent.id || '')}>Copy ID</Button>
{/if}
