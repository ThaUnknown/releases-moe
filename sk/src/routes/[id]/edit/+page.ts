import type { PageLoad } from './$types'
import { get } from 'svelte/store'
import { error } from '@sveltejs/kit'
import { authModel } from '$lib/pocketbase/index.js'

export const ssr = false

export const load: PageLoad = async function ({ parent }) {
  const user = get(authModel)
  if (!user?.canEdit) throw error(403, 'Not Authorized')
  return parent()
}
