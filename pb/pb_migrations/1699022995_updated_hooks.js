/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3fhw2mfr9zrgodj")

  // remove
  collection.schema.removeField("u3bmgjpb")

  // remove
  collection.schema.removeField("kayyu1l3")

  // remove
  collection.schema.removeField("balsaeka")

  // remove
  collection.schema.removeField("emgxgcok")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3fhw2mfr9zrgodj")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "u3bmgjpb",
    "name": "action_type",
    "type": "select",
    "required": true,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "command",
        "post"
      ]
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "kayyu1l3",
    "name": "action",
    "type": "text",
    "required": true,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "balsaeka",
    "name": "expands",
    "type": "text",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "emgxgcok",
    "name": "disabled",
    "type": "bool",
    "required": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
})
