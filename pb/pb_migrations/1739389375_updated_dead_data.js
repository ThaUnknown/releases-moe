/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("uynljignfze0qas")

  // remove
  collection.schema.removeField("pa8ab1gm")

  // remove
  collection.schema.removeField("m8nrqp9d")

  // remove
  collection.schema.removeField("f4gcpw93")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "l0xt8yjg",
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
    "id": "kllw6jdu",
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
    "id": "ttz1h3yo",
    "name": "tracker",
    "type": "select",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "Nyaa",
        "AB",
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

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("uynljignfze0qas")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "pa8ab1gm",
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
    "id": "m8nrqp9d",
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
    "id": "f4gcpw93",
    "name": "tracker",
    "type": "select",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "Nyaa",
        "AB",
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
  collection.schema.removeField("l0xt8yjg")

  // remove
  collection.schema.removeField("kllw6jdu")

  // remove
  collection.schema.removeField("ttz1h3yo")

  return dao.saveCollection(collection)
})
