migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3l2x9nxip35gqb5")

  // remove
  collection.schema.removeField("58fnitth")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "mmhalxvt",
    "name": "comparison",
    "type": "text",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3l2x9nxip35gqb5")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "58fnitth",
    "name": "comparison",
    "type": "url",
    "required": false,
    "unique": false,
    "options": {
      "exceptDomains": [],
      "onlyDomains": [
        "slow.pics"
      ]
    }
  }))

  // remove
  collection.schema.removeField("mmhalxvt")

  return dao.saveCollection(collection)
})
