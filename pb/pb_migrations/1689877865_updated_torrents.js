migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("oiwizhmushn5qqh")

  collection.listRule = ""
  collection.viewRule = ""
  collection.createRule = "@request.auth.id != '' && @request.auth.canEdit = true"
  collection.updateRule = "@request.auth.id != '' && @request.auth.canEdit = true"
  collection.deleteRule = "@request.auth.id != '' && @request.auth.canEdit = true"

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "scgskbr2",
    "name": "files",
    "type": "json",
    "required": true,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("oiwizhmushn5qqh")

  collection.listRule = null
  collection.viewRule = null
  collection.createRule = null
  collection.updateRule = null
  collection.deleteRule = null

  // remove
  collection.schema.removeField("scgskbr2")

  return dao.saveCollection(collection)
})
