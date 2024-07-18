import { client } from '$lib/pocketbase/index.js'

export const load = async () => {
  return { ids: (await client.collection('listIDs').getFullList({ batch: 10000, fields: 'alID' })).map(({ alID }) => alID) }
}
