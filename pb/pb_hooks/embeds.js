/// <reference path="../pb_data/types.d.ts" />

module.exports = {
  embed (user, fields, title, id) {
    const DOMAIN = 'https://beta.releases.moe'

    const obj = {
      username: user.get('username'),
      avatar_url: `${DOMAIN}/api/files/${user.collection().id}/${user.id}/${user.get('avatar')}`,
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
  /**
   * @param {models.Record} record
   * @param {models.Record} user
   */
  entries (record, user, util) {
    const fields = []

    const id = record.get('alID')

    fields.push({ name: 'Title', value: this.wrap(util.anilistTitle(id)) })

    $app.dao()?.expandRecord(record, ['trs'])

    const trs = record.expandedAll('trs')

    const best = trs.find(record => record?.get('isBest'))
    if (best) fields.push({ name: 'Best', value: this.wrap(best.get('releaseGroup')), inline: true })
    const alt = trs.find(record => record && !record.get('isBest'))
    if (alt) fields.push({ name: 'Alt', value: this.wrap(alt.get('releaseGroup')), inline: true })
    const notes = record.get('notes')
    if (notes) fields.push({ name: 'Notes', value: this.wrap(notes) })
    const unmuxed = record.get('theoreticalBest')
    if (unmuxed) fields.push({ name: 'Unmuxed Best', value: this.wrap(unmuxed) })

    return this.embed(user, fields, 'New Entry', id)
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
