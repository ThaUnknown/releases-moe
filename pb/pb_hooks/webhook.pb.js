/* eslint-disable no-undef */
/// <reference path="../pb_data/types.d.ts" />

onRecordAfterUpdateRequest(e => {
  try {
    const embeds = require(`${__hooks}/embeds.js`)

    const user = e.httpContext.get('authRecord')
    const record = e.record
    const hooks = $app.dao()?.findRecordsByFilter('hooks', 'event = \'update\'')
    if (!hooks || !record) return

    const util = require(`${__hooks}/util.js`)
    const data = embeds[record.collection()?.name || ''](record, user, util, 'update')
    if (!data) return

    for (const hook of hooks || []) {
      if (!hook || hook.get('collection') !== record.collection()?.name) continue
      $http.send({
        url: hook.get('action_params'),
        method: 'POST',
        data,
        headers: { 'content-type': 'application/json' }
      })
    }
  } catch (e) {
    console.log(e)
  }
})

onRecordAfterCreateRequest(e => {
  try {
    const embeds = require(`${__hooks}/embeds.js`)

    const user = e.httpContext.get('authRecord')
    const record = e.record
    const hooks = $app.dao()?.findRecordsByFilter('hooks', 'event = \'insert\'')
    if (!hooks || !record) return

    const util = require(`${__hooks}/util.js`)
    const data = embeds[record.collection()?.name || ''](record, user, util, 'insert')

    if (!data) return

    for (const hook of hooks || []) {
      if (!hook || hook.get('collection') !== record.collection()?.name) continue
      $http.send({
        url: hook.get('action_params'),
        method: 'POST',
        data,
        headers: { 'content-type': 'application/json' }
      })
    }
  } catch (e) {
    console.log(e)
  }
})

// This is here as the torrents get updated first then the entry
// and due to how we expand for the torrent data it will only
// ever have one data set to pull from meaning the data is the same.
const torrentHook = e => {
  try {
    const record = e.record
    const hooks = $app.dao()?.findRecordsByFilter('hooks', 'event = \'update\'')
    if (!hooks || !record) return
    if (record.collection()?.name !== 'torrents') return
    const store = $app.store()
    for (const hook of hooks || []) {
      if (!hook || hook.get('collection') !== 'entries') continue

      store.set(record.get('id'), record.originalCopy())
    }
  } catch (e) {
    console.log(e)
  }
}
onRecordBeforeUpdateRequest(torrentHook)
onRecordBeforeDeleteRequest(torrentHook)
onRecordBeforeCreateRequest(torrentHook)
