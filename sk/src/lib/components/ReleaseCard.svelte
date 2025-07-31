<script lang='ts'>
  import { type TorrentsResponse, TorrentsTrackerOptions, TorrentTags } from '$lib/pocketbase/generated-types.js'
  import { fastPrettyBytes } from '$lib/util'
  import * as Card from '$lib/components/ui/card'
  import { Button } from '$lib/components/ui/button'
  import { PRIVATE_TRACKERS } from '$lib/torrent'
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
  import * as Tooltip from '$lib/components/ui/tooltip'

  export let torrents: TorrentsResponse[]
  export let releaseGroup: string

  function hasDualBest (torrents: TorrentsResponse[]) {
    let isBest = false
    let isDual = false
    let tagsArr: TorrentTags[] = []
    const sizes: Map<TorrentsTrackerOptions, number> = new Map()
    for (const torrent of torrents) {
      if (torrent.isBest) isBest = true
      if (torrent.dualAudio) isDual = true
      const size = torrent.files && torrent.files.reduce((acc, { length }) => acc + length, 0)
      if (size) sizes.set(torrent.tracker, (sizes.get(torrent.tracker) || 0) + size )
      tagsArr = tagsArr.concat(torrent.tags)
    }

    // Unique tags only
    const tags = new Set(tagsArr)
    return { isBest, isDual, tags, sizes: [...sizes.values()].map((num) => fastPrettyBytes(num)) }
  }

  function mapToTracker (torrents: TorrentsResponse[]) {
    const map = new Map<TorrentsTrackerOptions, TorrentsResponse[]>()

    for (const torrent of torrents) {
      const keyValue = torrent.tracker

      if (!map.has(keyValue)) {
        map.set(keyValue, [])
      }

      map.get(keyValue)?.push(torrent)
    }

    return map
  }

  const icons: Record<TorrentsTrackerOptions, string> = {
    AB: '/lock.ico',
    AniDex: '/anidex.ico',
    AnimeTosho: '/tosho.ico',
    Nyaa: '/cat.png',
    RuTracker: '/rutracker.ico',
    BeyondHD: '/bhd.ico',
    Aither: '/aith.ico',
    Blutopia: '/blu.ico',
    HDBits: '/hdb.png',
    BroadcastTheNet: '/btn.ico',
    PassThePopcorn: 'ptp.ico',
    Other: '/favicon.png',
    OtherPrivate: '/favicon.png'
  }

  const tagDesc: Record<TorrentTags, string> = {
    "Dolby Vision": "This release is Dolby Vision Profile 5 which will not display correctly on unsupported setups.",
    "HDR": "This release is HDR which will not display correctly on unsupported setups.",
    "Deband Required": "This release requires the use of MPV Deband (Press b). If you cannot deband, get the alt release.",
    "Deband Recommended": "This release recommends the use of MPV Deband (Press b). If you cannot deband, still get this release.",
    "YUV444P": "This release is encoded in YUV444P which has poor hardware support, make sure your device can play it properly or get the alt release.",
    "Patch Required": "This release requires you to download an external patch to fix issues.",
    "Misplaced Special": "This release has specials at the top of the file list, make sure you watch the episodes in the correct order.",
    "VFR": "This release has a variable framerate, your screen should be set to a multiple of 120hz or use VRR to display it correctly.",
    "Incomplete": "This release does not contain all the episodes.",
    "Broken": "This release has issues, see notes for more information.",
  }

  const alias: Partial<Record<TorrentsTrackerOptions, string>> = {
    AB: 'Private Tracker'
  }

</script>

{#if torrents}
  {@const { isBest, isDual, tags, sizes } = hasDualBest(torrents)}
  {@const groupedTorrents = mapToTracker(torrents)}
  <Card.Root class='w-80 max-w-full'>
    <Card.Header class='pb-3'>
      <Card.Title>{releaseGroup}</Card.Title>
      <Card.Description>
        {#each sizes as size}
          <span class='size text-nowrap'>{size}</span>
        {/each}
      </Card.Description>
    </Card.Header>
    <Card.Content class='pb-3'>
      <div class='flex flex-wrap gap-2 w-full'>
        {#if isDual}
          <span class='bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2 mr-0 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 inline-block'>DualAudio</span>
        {/if}
        {#if isBest}
        <span class='bg-green-100 text-green-800 text-xs font-medium me-2 px-2 mr-0 py-0.5 rounded dark:bg-green-900 dark:text-green-300 inline-block'>Best</span>
        {:else}
        <span class='bg-red-100 text-red-800 text-xs font-medium me-2 px-2 mr-0 py-0.5 rounded dark:bg-red-900 dark:text-red-300 inline-block'>Alt</span>
        {/if}
        {#each tags as tag}
          <Tooltip.Root openDelay={200}>
            <Tooltip.Trigger class='flex'>
              <span class='cursor-help bg-purple-100 text-purple-800 text-xs font-medium me-2 px-2 mr-0 py-0.5 rounded dark:bg-purple-900 dark:text-purple-300 inline-block'>{tag}</span>
            </Tooltip.Trigger>
            <Tooltip.Content>
              <span class='font-semibold'>{tagDesc[tag]}</span>
            </Tooltip.Content>
          </Tooltip.Root>
        {/each}
      </div>
    </Card.Content>
    <Card.Footer>
      <div class='grid grid-cols-2 gap-4 w-full'>
        {#each groupedTorrents.entries() as [tracker, torrents]}
          {@const isPrivate = PRIVATE_TRACKERS.includes(tracker)}
          {#if torrents.length === 1 || torrents[0].groupedUrl}
            {@const torrent = torrents[0]}
            <Button size='sm' variant='outline' class='px-4 {isPrivate && 'pt-button pointer-events-none'}' href={torrent.groupedUrl || torrent.url} data-href={torrent.groupedUrl || torrent.url} target='_blank'>
              {#if icons[torrent.tracker]}
                <img src={icons[torrent.tracker]} alt={torrent.tracker} class='w-3 h-3 me-2' />
              {/if}
              {alias[torrent.tracker] || torrent.tracker}
            </Button>
          {:else}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild let:builder>
                <Button variant='outline' size='sm' class='px-4 {isPrivate && 'pt-button'}' builders={[builder]}>
                  <img src={icons[tracker]} alt={tracker} class='w-3 h-3 me-2' />
                  {alias[tracker] || tracker}
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                {#each torrents as torrent, index}
                  <DropdownMenu.Item class='cursor-pointer {isPrivate && 'pt-button pointer-events-none'}' href={torrent.url} data-href={torrent.url} target='_blank'>
                    <img src={icons[tracker]} alt={tracker} class='w-3 h-3 me-2' />
                    Torrent #{index + 1}
                  </DropdownMenu.Item>
                {/each}
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          {/if}
        {/each}
      </div>
    </Card.Footer>
  </Card.Root>
{/if}

<style>
  .size + .size::before {
    content: ' | ';
    white-space: normal;
  }
</style>
