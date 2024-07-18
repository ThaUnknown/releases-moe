/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("5lpk1ojhj7axx4b")

  collection.name = "listIDs"

  // remove
  collection.schema.removeField("gk8d96gl")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "duwvjl80",
    "name": "alID",
    "type": "number",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": 1,
      "max": null,
      "noDecimal": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("5lpk1ojhj7axx4b")

  collection.name = "listID"

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "gk8d96gl",
    "name": "alID",
    "type": "number",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": 1,
      "max": null,
      "noDecimal": false
    }
  }))

  // remove
  collection.schema.removeField("duwvjl80")

  return dao.saveCollection(collection)
})
