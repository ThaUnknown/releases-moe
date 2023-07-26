migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("oiwizhmushn5qqh")

  // remove
  collection.schema.removeField("tiwktz8q")

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
        "Nyaa",
        "AnimeBytes",
        "AniDex",
        "RuTracker",
        "AnimeTosho"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("oiwizhmushn5qqh")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "tiwktz8q",
    "name": "isBest",
    "type": "bool",
    "required": false,
    "unique": false,
    "options": {}
  }))

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
