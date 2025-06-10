import PocketBase, {
  type AuthProviderInfo, type RecordService
} from 'pocketbase'

import { readable } from 'svelte/store'
import { browser } from '$app/environment'
import { base } from '$app/paths'
import type { CollectionRecords, UsersResponse } from './generated-types'
import { toast } from 'svelte-sonner'

export const client = new PocketBase(
  browser ? window.location.origin + '/' + base : undefined
)

export const authModel = readable<UsersResponse | null>(
  null,
  function (set) {
    client.authStore.onChange((token, model) => {
      set(model as UsersResponse)
    }, true)
  }
)

if (browser && client.authStore.isValid) client.collection('users').authRefresh()

export function logout () {
  client.authStore.clear()
}

/*
 * Save (create/update) a record (a plain object). Automatically converts to
 * FormData if needed.
 */
export async function save <T extends keyof CollectionRecords> (collection: T, record: CollectionRecords[T] & { id?: string }, create = false) {
  try {
    const data = object2formdata(record)
    if (record.id && !create) {
      // "create" flag overrides update
      return await client.collection(collection).update(record.id, data)
    } else {
      return await client.collection(collection).create(data)
    }
  } catch (error) {
    const err = error as Error
    toast.error(err?.message)
    throw err
  }
  // convert obj to FormData in case one of the fields is instanceof FileList
}

// convert obj to FormData in case one of the fields is instanceof FileList
function object2formdata (obj: CollectionRecords[keyof CollectionRecords]) {
  // check if any field's value is an instanceof FileList
  if (!Object.values(obj).some(val => val instanceof FileList || val instanceof File)) {
    // if not, just return the original object
    return obj
  }
  // otherwise, build FormData from obj
  const fd = new FormData()
  for (const [key, val] of Object.entries(obj)) {
    if (val instanceof FileList) {
      for (const file of val) {
        fd.append(key, file)
      }
    } else if (typeof val === 'object' && !(val instanceof File)) {
      fd.append(key, JSON.stringify(val))
    } else {
      fd.append(key, val)
    }
  }
  return fd
}

export async function providerLogin (provider: AuthProviderInfo, authCollection: RecordService) {
  const authResponse = await authCollection.authWithOAuth2({
    provider: provider.name,
    createData: {
      emailVisibility: false,
      canEdit: false
    }
  })
  // update user "record" if "meta" has info it doesn't have
  const { meta, record } = authResponse
  const changes = {} as { [key: string]: unknown }
  if (!record.name && meta?.name) {
    changes.name = meta.name
  }
  if (!record.avatar && meta?.avatarUrl) {
    const response = await fetch(meta.avatarUrl)
    if (response.ok) {
      const type = response.headers.get('content-type') ?? 'image/jpeg'
      changes.avatar = new File([await response.blob()], 'avatar', { type })
    }
  }
  if (Object.keys(changes).length) {
    authResponse.record = await save(authCollection.collectionIdOrName as keyof CollectionRecords, {
      ...record,
      ...changes
    })
  }
  return authResponse
}
