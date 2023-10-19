migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("oiwizhmushn5qqh")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "lt2phbxp",
    "name": "infoHash",
    "type": "text",
    "required": true,
    "unique": false,
    "options": {
      "min": 40,
      "max": 40,
      "pattern": "[0-9a-f]+|<redacted>"
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("oiwizhmushn5qqh")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "lt2phbxp",
    "name": "infoHash",
    "type": "text",
    "required": true,
    "unique": false,
    "options": {
      "min": 40,
      "max": 40,
      "pattern": "[0-9a-f]+"
    }
  }))

  return dao.saveCollection(collection)
})
