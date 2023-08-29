migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3l2x9nxip35gqb5")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "bdb9s2ju",
    "name": "trs",
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
})
