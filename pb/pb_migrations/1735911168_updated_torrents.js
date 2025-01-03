/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("oiwizhmushn5qqh")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jp5spaaa",
    "name": "tracker",
    "type": "select",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "Nyaa",
        "AnimeBytes",
        "AniDex",
        "RuTracker",
        "AnimeTosho",
        "BeyondHD",
        "Aither",
        "Blutopia",
        "HDBits",
        "BroadcastTheNet",
        "PassThePopcorn",
        "Other"
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
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "Nyaa",
        "AnimeBytes",
        "AniDex",
        "RuTracker",
        "AnimeTosho",
        "BeyondHD",
        "Other"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
