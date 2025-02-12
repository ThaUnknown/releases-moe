/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  db.newQuery(`
      UPDATE torrents
      SET tracker = 'AB'
      WHERE tracker = 'PT'
    `)
    .execute()
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId('torrents')

  const field = collection.schema.getFieldByName('url')
  field.type = 'text'

  return dao.saveCollection(collection)
}, (db) => {
  db.newQuery(`
    UPDATE torrents
    SET tracker = 'PT'
    WHERE tracker = 'AB'
  `)
    .execute()
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId('torrents')

  const field = collection.schema.getFieldByName('url')
  field.type = 'url'

  return dao.saveCollection(collection)
})
