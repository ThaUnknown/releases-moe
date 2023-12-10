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
    const data = embeds[record.collection()?.name || ''](record, user, util)

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
    const data = embeds[record.collection()?.name || ''](record, user, util)

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
