/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  db.newQuery(`
    UPDATE torrents
    SET url = substr(url, instr(substr(url, 9), '/') + 8)
    WHERE infoHash = '<redacted>'
  `)
    .execute()

  db.newQuery(`
      UPDATE torrents
      SET tracker = 'PT'
      WHERE tracker = 'AnimeBytes'
    `)
    .execute()
}, (db) => {
  db.newQuery(`
    UPDATE torrents
    SET tracker = 'AnimeBytes'
    WHERE tracker = 'PT'
  `)
    .execute()
})
