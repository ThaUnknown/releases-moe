migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3l2x9nxip35gqb5")

  collection.name = "entries"
  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_nrSbHzP` ON `entries` (`anilistID`)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3l2x9nxip35gqb5")

  collection.name = "torrents"
  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_nrSbHzP` ON `torrents` (`anilistID`)"
  ]

  return dao.saveCollection(collection)
})
