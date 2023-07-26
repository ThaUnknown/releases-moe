migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("oiwizhmushn5qqh")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jp5spaaa",
    "name": "tracker",
    "type": "select",
    "required": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "nyaa",
        "animebytes",
        "anidex",
        "rutracker"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("oiwizhmushn5qqh")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jp5spaaa",
    "name": "tracker",
    "type": "select",
    "required": true,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "nyaa",
        "animebytes",
        "anidex",
        "rutracker"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
