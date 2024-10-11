/// <reference path="../pb_data/types.d.ts" />

module.exports = {
  embed (user, fields, title, id) {
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
    return obj
  },
  wrap (text) {
    return '```' + text + '```'
  },
  getValue(trs, check, retValue, expected=true) {
    let value = ''
    for (const record of trs) {
      if (record?.get(check) === expected) value += record?.get(retValue)
    }
    return value
  },
  wrapMultiple (previous, current, check, retValue, expected=true) {
    let before = this.getValue(previous, check, retValue, expected)
    let after = this.getValue(current, check, retValue, expected)

    return this.warpDiff(before, after)
  },
  warpDiff (before, after) {
    const Diff = require(`${__hooks}/diff.min.js`)

    let diff = ''
    for (const part of Diff.diffTrimmedLines(before, after)) {
      if (part.removed) diff += `- ${part.value}`
      if (part.added) diff += `+ ${part.value}`
    }

    return `\`\`\`diff\n${diff}\n\`\`\``
  },
  /**
   * @param {models.Record} record
   * @param {models.Record} user
   */
  entries (record, user, util) {
    const fields = []

    const preRecord = record.originalCopy()
    const id = record.get('alID')

    $app.dao()?.expandRecord(record, ['trs'])
    $app.dao()?.expandRecord(preRecord, ['trs'])

    const curTrs = record.expandedAll('trs')
    const preTrs = preRecord.expandedAll('trs')

    const best = this.wrapMultiple(preTrs, curTrs, 'isBest', 'releaseGroup')
    if (best) fields.push({ name: 'Best', value: best, inline: true })

    const alt = this.wrapMultiple(preTrs, curTrs, 'isBest', 'releaseGroup', false)
    if (alt) fields.push({ name: 'Alt', value: alt, inline: true })

    const unmuxed = this.warpDiff(preRecord.get('theoreticalBest'), record.get('theoreticalBest'))
    if (unmuxed) fields.push({ name: 'Unmuxed Best', value: unmuxed })

    const notes = this.warpDiff(preRecord.get('notes'), record.get('notes'))
    if (notes) fields.push({ name: 'Notes', value: notes })

    return this.embed(user, fields, util.anilistTitle(id), id)
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
// kill docker
