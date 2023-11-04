/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("oiwizhmushn5qqh")

  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_8ro5Pvl` ON `torrents` (\n  `infoHash`,\n  `url`,\n  `tracker`,\n  `files`,\n  `dualAudio`,\n  `releaseGroup`,\n  `isBest`\n)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("oiwizhmushn5qqh")

  collection.indexes = []

  return dao.saveCollection(collection)
})
