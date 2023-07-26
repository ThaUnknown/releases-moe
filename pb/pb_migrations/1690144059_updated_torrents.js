migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("oiwizhmushn5qqh")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "g2ikws7s",
    "name": "releaseGroup",
    "type": "text",
    "required": true,
    "unique": false,
    "options": {
      "min": 1,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("oiwizhmushn5qqh")

  // remove
  collection.schema.removeField("g2ikws7s")

  return dao.saveCollection(collection)
})
