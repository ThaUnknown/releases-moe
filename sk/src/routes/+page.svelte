<script lang='ts' context='module'>
  import type { EntriesResponse, TorrentsResponse } from '$lib/pocketbase/generated-types'
  import { authModel, client } from '$lib/pocketbase/index.js'
  import type { ListResult } from 'pocketbase'

// const ids = derived<PageStore, number[]>(anilistIDs, (ids: ListResult<EntriesRecord>) => ids.items.map(({ alID }) => alID))
</script>

<script lang='ts'>
  import { metadata } from '$lib/app/stores'
  import { search, type media, idList } from '$lib/anilist'
  import { debounce } from '$lib/util'

  $metadata.title = 'Home'

  let title = ''

  let isEditing = false

  type Texpand = {
    trs: TorrentsResponse<any>[]
  }

  type WithMedia = {
    dbid: string
  } & media & EntriesResponse<Texpand>

  let items: Promise<WithMedia[]> = initialLoad()

  async function initialLoad (): Promise<WithMedia[]> {
    const res: ListResult<EntriesResponse<Texpand>> = await client.collection('entries').getList(1, 50, {
      skipTotal: true,
      expand: 'trs'
    })
    const alResponse = await idList(res.items.map(({ alID }) => alID))
    const foundIDs: any = {}
    for (const media of alResponse.media as any) {
      foundIDs[media.id] = media
    }

    for (const item of res.items) {
      foundIDs[item.alID] = { ...item, ...foundIDs[item.alID], dbid: item.id }
    }

    return Object.values(foundIDs)
  }

  async function searchAndMap (title: string): Promise<WithMedia[]> {
    if (!title) return initialLoad()

    const data = await search(title)
    if (!data.media.length) return []
    const foundIDs: Record<string, WithMedia> = {}
    for (const media of data.media as any) {
      foundIDs[media.id] = media
    }
    const res: ListResult<EntriesResponse<Texpand>> = await client.collection('entries').getList(1, 50, {
      filter: Object.keys(foundIDs).map((id: string) => 'alID=' + id).join('||'),
      expand: 'trs',
      skipTotal: true
    })

    for (const item of res.items) {
      foundIDs[item.alID] = { ...item, ...foundIDs[item.alID], dbid: item.id }
    }

    return Object.values(foundIDs).sort((a, b) => Number(!!b.dbid) - Number(!!a.dbid))
  }

  const debouncedSearch = debounce(title => {
    items = searchAndMap(title)
  }, 300)

  $: debouncedSearch(title)

  let textInput: HTMLInputElement

  function checkSearchFocus ({ code }: KeyboardEvent) {
    if (code === 'Slash') setTimeout(() => textInput.focus())
  }

</script>

<svelte:document on:keydown={checkSearchFocus} />

<div class='input-group'>
  {#if $authModel?.canEdit}
    <div class='input-group-text'>
      <input type='checkbox' class='form-check-input mt-0' bind:checked={isEditing} aria-label='Checkbox for following input' />
    </div>
  {/if}
  <input type='text' class='form-control' placeholder='Search anime title' aria-label='Input with checkbox' bind:value={title} bind:this={textInput} />
</div>
<div class='mt-1'>
  <small>Press <kbd class='text-body' style='font-size: 10px; background-color: hsla(var(--bs-emphasis-color-hsl), 0.1)'>/</kbd> to focus</small>
</div>

<table class='table table-hover font-size-14 position-relative overflow-x-auto w-100 mt-4'>
  <thead class='table-secondary'>
    <tr>
      <th>#</th>
      <th>Name</th>
      <th>Year</th>
      <th>Episodes</th>
      <th>Best</th>
      <th>Alt</th>
    </tr>
  </thead>
  <tbody>
    {#await items}
      Loading...
    {:then mediaList}
      {#if mediaList}
        {#each mediaList as media, i}
          {@const disabled = !isEditing && !media.dbid}
          <a class='table-row' href={!disabled ? (isEditing ? `/${media.id}/edit` : '/' + media.id) : ''}
            class:pointer={!isEditing && media.dbid}
            class:editing={isEditing}
            class:disabled>
            <td class:text-light={disabled} class='py-10 pl-20 pr-0'>{i + 1}</td>
            <td class:text-light={disabled} class='py-10 px-20 text-nowrap'>{media.title.english || media.title.userPreferred}</td>
            <td class:text-light={disabled} class='py-10 px-20'>{media.seasonYear ?? 'N/A'}</td>
            <td class:text-light={disabled} class='py-10 px-20'>{media.episodes ?? 'N/A'}</td>
            <td class:text-light={disabled} class='py-10 px-20'>{media.expand?.trs?.find(({ isBest }) => isBest)?.releaseGroup ?? ''}</td>
            <td class:text-light={disabled} class='py-10 px-20'>{media.expand?.trs?.find(({ isBest }) => !isBest)?.releaseGroup ?? ''}</td>
          </a>
        {/each}
      {/if}
    {/await}
  </tbody>
</table>

<style>
  a.table-row {
    display: table-row;
    vertical-align: inherit;
    border-color: inherit;
    color: inherit;
    text-decoration: none;
  }
</style>
