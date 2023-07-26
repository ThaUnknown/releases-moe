migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3l2x9nxip35gqb5")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "7c9qutoz",
    "name": "incomplete",
    "type": "bool",
    "required": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3l2x9nxip35gqb5")

  // remove
  collection.schema.removeField("7c9qutoz")

  return dao.saveCollection(collection)
})
