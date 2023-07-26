migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3l2x9nxip35gqb5")

  // remove
  collection.schema.removeField("7aqgnstu")

  // remove
  collection.schema.removeField("zl40bbcd")

  // add
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
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3l2x9nxip35gqb5")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "7aqgnstu",
    "name": "infoHash",
    "type": "text",
    "required": true,
    "unique": false,
    "options": {
      "min": 20,
      "max": 20,
      "pattern": "[0-9a-f]+"
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "zl40bbcd",
    "name": "files",
    "type": "json",
    "required": true,
    "unique": false,
    "options": {}
  }))

  // remove
  collection.schema.removeField("bdb9s2ju")

  return dao.saveCollection(collection)
})
