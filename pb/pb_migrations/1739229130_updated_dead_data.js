/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("uynljignfze0qas")

  // remove
  collection.schema.removeField("xyz31yco")

  // remove
  collection.schema.removeField("fnp2ykd5")

  // remove
  collection.schema.removeField("7sa8coib")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "w3b054iy",
    "name": "releaseGroup",
    "type": "text",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": 1,
      "max": null,
      "pattern": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "c7xlxzdv",
    "name": "infoHash",
    "type": "text",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": 10,
      "max": 40,
      "pattern": "[0-9a-f]+|<redacted>"
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "q9vz6lvt",
    "name": "tracker",
    "type": "select",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "Nyaa",
        "PT",
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
  const collection = dao.findCollectionByNameOrId("uynljignfze0qas")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "xyz31yco",
    "name": "releaseGroup",
    "type": "text",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": 1,
      "max": null,
      "pattern": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "fnp2ykd5",
    "name": "infoHash",
    "type": "text",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": 10,
      "max": 40,
      "pattern": "[0-9a-f]+|<redacted>"
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "7sa8coib",
    "name": "tracker",
    "type": "select",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "Nyaa",
        "PT",
        "AniDex",
        "RuTracker",
        "AnimeTosho",
        "BeyondHD",
        "Aither",
        "Blutopia",
        "HDBits",
        "BroadcastTheNet",
        "PassThePopcorn",
        "Other",
        "OtherPrivate"
      ]
    }
  }))

  // remove
  collection.schema.removeField("w3b054iy")

  // remove
  collection.schema.removeField("c7xlxzdv")

  // remove
  collection.schema.removeField("q9vz6lvt")

  return dao.saveCollection(collection)
})
