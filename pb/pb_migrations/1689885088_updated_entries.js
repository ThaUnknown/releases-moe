migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3l2x9nxip35gqb5")

  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_nrSbHzP` ON `entries` (`anilistIDs`)"
  ]

  // update
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

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "bdb9s2ju",
    "name": "torrents",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "oiwizhmushn5qqh",
      "cascadeDelete": false,
      "minSelect": 1,
      "maxSelect": null,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3l2x9nxip35gqb5")

  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_nrSbHzP` ON `entries` (`anilistID`)"
  ]

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "c3izxdlr",
    "name": "anilistID",
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

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "bdb9s2ju",
    "name": "field",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "oiwizhmushn5qqh",
      "cascadeDelete": false,
      "minSelect": 1,
      "maxSelect": null,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
})
