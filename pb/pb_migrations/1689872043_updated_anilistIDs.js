migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9prkra0sspoqcdg")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "hrnkznqz",
    "name": "al",
    "type": "number",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9prkra0sspoqcdg")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "hrnkznqz",
    "name": "ALID",
    "type": "number",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null
    }
  }))

  return dao.saveCollection(collection)
})
