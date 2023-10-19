migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("oiwizhmushn5qqh")

  collection.indexes = []

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("oiwizhmushn5qqh")

  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_K2zQ0nH` ON `torrents` (`infoHash`)"
  ]

  return dao.saveCollection(collection)
})
