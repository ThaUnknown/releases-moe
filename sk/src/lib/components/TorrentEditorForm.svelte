<script lang='ts'>
  import { TorrentsTrackerOptions, type TorrentsRecord, type TorrentsResponse } from '$lib/pocketbase/generated-types'

  type TorrentData = { id?: string } & (TorrentsRecord<any[]>|TorrentsResponse<any[]>)

  export let torrent: TorrentData
  export let i: number
  export let removeSingleTorrent: Function
  export let duplicateTorrent: Function

  function removeTorrentFile (i: number) {
    if (!torrent.files) return
    torrent.files.splice(i, 1)
    torrent = torrent
  }
</script>

<div class='row'>
  <div class='col-6'>
    <div class='mb-2'>
      <label for={'infohash' + i} class='form-label'>InfoHash</label>
      {#if torrent.tracker === TorrentsTrackerOptions.AnimeBytes}
        <input type='text' class='form-control disabled' required disabled id={'infohash' + i} value='<redacted>' />
      {:else}
        <input type='text' class='form-control disabled' required disabled id={'infohash' + i} bind:value={torrent.infoHash} />
      {/if}
    </div>
  </div>
  <div class='col-6'>
    <div class='mb-2'>
      <label for={'releaseGroup' + i} class='form-label'>Release Group</label>
      <input type='text' class='form-control' required id={'releaseGroup' + i} bind:value={torrent.releaseGroup} />
    </div>
  </div>
</div>
<div class='row'>
  <div class='col-6'>
    <div class='mb-2'>
      <label for={'tracker' + i} class='form-label'>Tracker</label>
      <select class='form-select' required id={'tracker' + i} bind:value={torrent.tracker}>
        {#each Object.keys(TorrentsTrackerOptions) as tracker}
          <option>{tracker}</option>
        {/each}
      </select>
    </div>
  </div>
  <div class='col-6'>
    <div class='mb-2'>
      <label for={'url' + i} class='form-label'>URL</label>
      <input type='text' class='form-control' required id={'url' + i} bind:value={torrent.url} />
    </div>
  </div>
</div>
<div class='d-flex mb-2'>
  <div class='form-check me-3'>
    <input type='checkbox' id={'isBest' + i} class='form-check-input' bind:checked={torrent.isBest} />
    <label for={'isBest' + i} class='form-check-label'>Is Best</label>
  </div>
  <div class='form-check'>
    <input type='checkbox' id={'dualAudio' + i} class='form-check-input' bind:checked={torrent.dualAudio} />
    <label for={'dualAudio' + i} class='form-check-label'>Dual Audio</label>
  </div>
</div>
<div class='accordion mb-2'>
  <details class='accordion-item'>
    <summary class='accordion-header d-block'>
      <div class='accordion-button collapsed'>
        Video Files
      </div>
    </summary>
    <div class='accordion-collapse'>
      <div class='accordion-body'>
        <ul>
          {#each torrent.files as file, i}
            <li class='mb-1 d-flex'>
              {file.name}
              {#if torrent.tracker === TorrentsTrackerOptions.AnimeBytes}
                <button class='btn btn-sm btn-danger ms-auto' type='button' on:click={() => removeTorrentFile(i)}>Remove</button>
              {/if}
            </li>
          {/each}
        </ul>
      </div>
    </div>
  </details>
</div>

<button class='btn btn-danger' type='button' on:click={() => removeSingleTorrent(torrent)}>Delete</button>
<button class='btn btn-primary' type='button' on:click={() => duplicateTorrent(torrent)}>Duplicate</button>
{#if torrent.id}
  <button class='btn btn-secondary' type='button' on:click={() => navigator.clipboard.writeText(torrent.id || '')}>Copy ID</button>
{/if}

<style>
  details[open] .accordion-button {
    color: var(--bs-accordion-active-color);
    background-color: var(--bs-accordion-active-bg);
    box-shadow: inset 0 calc(-1*var(--bs-accordion-border-width))0 var(--bs-accordion-border-color)
  }

  details[open] .accordion-button::after {
    background-image: var(--bs-accordion-btn-active-icon);
    transform: var(--bs-accordion-btn-icon-transform);
  }

  details {
    overflow: hidden; /* Keep this line to prevent an odd blue outline around the element in Safari. */
  }
  details {
    max-height: 50px;
    height: auto;
    overflow: hidden;
    transition: max-height 3.5s linear;
  }
  details[open] {
    max-height: 999rem;
  }
</style>
