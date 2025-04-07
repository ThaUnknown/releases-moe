/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3l2x9nxip35gqb5")

  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_pWizDK6` ON `entries` (`alID`)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3l2x9nxip35gqb5")

  collection.indexes = [
    "CREATE INDEX `idx_pWizDK6` ON `entries` (`alID`)"
  ]

  return dao.saveCollection(collection)
})
