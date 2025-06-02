/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("oiwizhmushn5qqh")

  // add field
  collection.fields.addAt(8, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1412308793",
    "max": 0,
    "min": 0,
    "name": "groupUrl",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("oiwizhmushn5qqh")

  // remove field
  collection.fields.removeById("text1412308793")

  return app.save(collection)
})
