migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("oiwizhmushn5qqh")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "yllvndrm",
    "name": "dualAudio",
    "type": "bool",
    "required": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("oiwizhmushn5qqh")

  // remove
  collection.schema.removeField("yllvndrm")

  return dao.saveCollection(collection)
})
