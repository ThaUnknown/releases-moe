migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3l2x9nxip35gqb5")

  collection.indexes = []

  // remove
  collection.schema.removeField("c3izxdlr")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "lsgax7id",
    "name": "alID",
    "type": "number",
    "required": true,
    "unique": false,
    "options": {
      "min": 1,
      "max": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3l2x9nxip35gqb5")

  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_nrSbHzP` ON `entries` (`anilistIDs`)"
  ]

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "c3izxdlr",
    "name": "anilistIDs",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "9prkra0sspoqcdg",
      "cascadeDelete": false,
      "minSelect": 1,
      "maxSelect": null,
      "displayFields": [
        "id"
      ]
    }
  }))

  // remove
  collection.schema.removeField("lsgax7id")

  return dao.saveCollection(collection)
})
