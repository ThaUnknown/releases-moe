/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("oiwizhmushn5qqh")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "4ixuxvzt",
    "name": "tags",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 10,
      "values": [
        "Dolby Vision",
        "HDR",
        "Deband Required",
        "Deband Recommended",
        "YUV444P",
        "Patch Required",
        "Misplaced Special",
        "VFR",
        "Incomplete",
        "Broken"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("oiwizhmushn5qqh")

  // remove
  collection.schema.removeField("4ixuxvzt")

  return dao.saveCollection(collection)
})
