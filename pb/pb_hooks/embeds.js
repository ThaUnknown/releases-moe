/// <reference path="../pb_data/types.d.ts" />

module.exports = {
  embed (user, fields, title, id, thumbnail) {
    const DOMAIN = 'https://releases.moe'

    const obj = {
      embeds: [
        {
          type: 'rich',
          title,
          description: '',
          color: 0x20242d,
          fields,
          footer: {
            text: 'From SeaDex'
          },
          timestamp: new Date().toISOString()
        }
      ]
    }
    if (id) obj.embeds[0].url = `${DOMAIN}/${id}`
    if (thumbnail) obj.embeds[0].thumbnail = { url: thumbnail }

    return obj
  },
  wrap (text) {
    return '```' + text + '```'
  },
  getValue (trs, check, retValue, expected = true) {
    const values = new Set()
    for (const record of trs) {
      if (record?.get(check) === expected) values.add(record?.get(retValue))
    }
    return [...values].sort().join('\n')
  },
  wrapMultiple (previous, current, check, retValue, expected = true) {
    const before = this.getValue(previous, check, retValue, expected)
    const after = this.getValue(current, check, retValue, expected)

    return this.warpDiff(before, after)
  },
  warpDiff (before, after) {
    const Diff = require(`${__hooks}/diff.js`)

    if (before === after) return ''

    let diff = ''
    for (const part of Diff.diffLines(before, after, { ignoreWhitespace: true })) {
      if (part.removed) diff += `- ${part.value.trim().replace(/\n/g, '\n- ')}\n`
      if (part.added) diff += `+ ${part.value.trim().replace(/\n/g, '\n+ ')}\n`
    }
    if (!diff) return ''
    return `\`\`\`diff\n${diff.trim()}\n\`\`\``
  },
  expandOld (old, expandOld) {
    const store = $app.store()
    const trs = []

    for (const tr of old.get('trs')) {
      const data = store.get(tr) || expandOld.find((record) => record.get('id') === tr)
      if (data) {
        trs.push(data)
        if (store.has(tr)) store.remove(tr)
      }
    }
    return trs
  },
  /**
   * @param {models.Record} record
   * @param {models.Record} user
   */
  entries (record, user, util, type) {
    const fields = []

    const preRecord = record.originalCopy()
    const preRecordExpand = record.originalCopy()
    const id = record.get('alID')

    const { title, poster } = util.anilistData(id)

    $app.dao()?.expandRecord(record, ['trs'])

    const curTrs = record.expandedAll('trs')
    let preTrs = []
    const isUpdate = type === 'update'
    if (isUpdate) {
      $app.dao()?.expandRecord(preRecordExpand, ['trs'])
      preTrs = this.expandOld(preRecord, preRecordExpand.expandedAll('trs'))
    }

    const best = this.wrapMultiple(preTrs, curTrs, 'isBest', 'releaseGroup')
    if (best) fields.push({ name: 'Best', value: best, inline: true })

    const alt = this.wrapMultiple(preTrs, curTrs, 'isBest', 'releaseGroup', false)
    if (alt) fields.push({ name: 'Alt', value: alt, inline: true })

    const unmuxed = this.warpDiff(isUpdate ? preRecord.get('theoreticalBest') : '', record.get('theoreticalBest'))
    if (unmuxed) fields.push({ name: 'Unmuxed Best', value: unmuxed })

    const notes = this.warpDiff(isUpdate ? preRecord.get('notes') : '', record.get('notes'))
    if (notes) fields.push({ name: 'Notes', value: notes })

    if (!fields.length) return

    return this.embed(user, fields, title, id, poster)
  },
  torrents (record, user) {
    const fields = []

    fields.push({ name: 'Hash', value: this.wrap(record.get('infoHash')) })
    fields.push({ name: 'Tracker', value: this.wrap(record.get('tracker')), inline: true })
    fields.push({ name: 'Link', value: this.wrap(record.get('url')), inline: true })
    fields.push({ name: 'Release Group', value: this.wrap(record.get('releaseGroup')) })
    fields.push({ name: 'Dual Audio', value: this.wrap(record.get('dualAudio')), inline: true })
    fields.push({ name: 'Best', value: this.wrap(record.get('isBest')), inline: true })

    return this.embed(user, fields, 'New Torrent')
  }
}
