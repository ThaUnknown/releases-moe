migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9prkra0sspoqcdg")

  collection.createRule = "@request.auth.id != '' && @request.auth.canEdit = true"
  collection.updateRule = "@request.auth.id != '' && @request.auth.canEdit = true"
  collection.deleteRule = "@request.auth.id != '' && @request.auth.canEdit = true"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9prkra0sspoqcdg")

  collection.createRule = null
  collection.updateRule = null
  collection.deleteRule = null

  return dao.saveCollection(collection)
})
