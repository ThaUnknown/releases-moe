/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("5lpk1ojhj7axx4b")

  collection.options = {
    "query": "SELECT id, alID FROM entries LIMIT 10000"
  }

  // remove
  collection.schema.removeField("qmldd1q9")

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

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("5lpk1ojhj7axx4b")

  collection.options = {
    "query": "SELECT id, alID FROM entries"
  }

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "qmldd1q9",
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
  collection.schema.removeField("gk8d96gl")

  return dao.saveCollection(collection)
})
