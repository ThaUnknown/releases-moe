import { get } from 'svelte/store'
import { error } from '@sveltejs/kit'
import { authModel } from '$lib/pocketbase'

export const ssr = false

export const load = async function ({ parent }) {
  const user = get(authModel)
  if (!user?.canEdit) throw error(403, 'Not Authorized')
  return parent()
}
