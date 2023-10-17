<script lang='ts' context='module'>
  import type { EntriesResponse, TorrentsResponse } from '$lib/pocketbase/generated-types'
  import { authModel, client } from '$lib/pocketbase/index.js'
  import type { ListResult } from 'pocketbase'

// const ids = derived<PageStore, number[]>(anilistIDs, (ids: ListResult<EntriesRecord>) => ids.items.map(({ alID }) => alID))
</script>

<script lang='ts'>
  import { metadata } from '$lib/app/stores'
  import { search, type media } from '$lib/anilist'
  import { goto } from '$app/navigation'

  $metadata.title = 'Home'

  let title = ''

  let isEditing = false

  $: items = searchAndMap(title)

  type Texpand = {
    trs: TorrentsResponse<any>[],
    best: TorrentsResponse<any>
  }

  type WithMedia = {
    dbid: number
  } & media & EntriesResponse<Texpand>

  async function searchAndMap (title: string): Promise<WithMedia[]> {
    const data = await search(title)
    if (!data.media.length) return []
    const foundIDs: any = {}
    for (const media of data.media as any) {
      foundIDs[media.id] = media
    }
    const res: ListResult<EntriesResponse<Texpand>> = await client.collection('entries').getList(1, 50, {
      filter: Object.keys(foundIDs).map((id: string) => 'alID=' + id).join('||'),
      expand: 'best,trs'
    })

    for (const item of res.items) {
      foundIDs[item.alID] = { ...item, ...foundIDs[item.alID], dbid: item.id }
    }

    return Object.values(foundIDs)
  }

  function rowClick (media: any) {
    if (isEditing) {
      goto(`/${media.id}/edit`)
    } else {
      goto(`/${media.id}`)
    }
  }

</script>

<div class='input-group'>
  {#if $authModel?.canEdit}
    <div class='input-group-prepend'>
      <div class='input-group-text'>
        <div class='custom-checkbox d-inline-block'>
          <input type='checkbox' id='editor' bind:checked={isEditing} />
          <label for='editor' class='blank' style='position:initial' />
        </div>
      </div>
    </div>
  {/if}
  <input type='text' class='form-control' placeholder='Search anime title' bind:value={title} />
</div>

<table class='table table-hover font-size-14 position-relative overflow-x-auto w-full'>
  <thead>
    <tr class='border-0'>
      <td class='y-15 pl-20 pr-0' />
      <td class='py-15 px-20'>Name</td>
      <td class='py-15 px-20'>Year</td>
      <td class='py-15 px-20'>Episodes</td>
      <td class='py-15 px-20'>Best</td>
      <td class='py-15 px-20'>Alt</td>
    </tr>
  </thead>
  <tbody>
    {#await items}
      Loading...
    {:then mediaList}
      {#if mediaList}
        {#each mediaList as media, i}
          {@const disabled = !isEditing && !media.dbid}
          <tr class='border-0' on:click={() => { if (!disabled) rowClick(media) }}
            class:pointer={!isEditing && media.dbid}
            class:editing={isEditing}
            class:disabled
            class:text-muted={disabled}>
            <td class='py-10 pl-20 pr-0'>{i + 1}</td>
            <td class='py-10 px-20 text-nowrap'>{media.title.userPreferred}</td>
            <td class='py-10 px-20'>{media.seasonYear ?? 'N/A'}</td>
            <td class='py-10 px-20'>{media.episodes ?? 'N/A'}</td>
            <td class='py-10 px-20'>{media.expand?.trs?.find(({ isBest }) => isBest)?.releaseGroup ?? ''}</td>
            <td class='py-10 px-20'>{media.expand?.trs?.find(({ isBest }) => !isBest)?.releaseGroup ?? ''}</td>
          </tr>
        {/each}
      {/if}
    {/await}
  </tbody>
</table>
