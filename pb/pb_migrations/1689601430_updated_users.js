migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("_pb_users_auth_")

  collection.options = {
    "allowEmailAuth": false,
    "allowOAuth2Auth": true,
    "allowUsernameAuth": false,
    "exceptEmailDomains": null,
    "manageRule": null,
    "minPasswordLength": 8,
    "onlyEmailDomains": null,
    "requireEmail": false
  }

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "x8b3fasn",
    "name": "role",
    "type": "select",
    "required": true,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "user",
        "admin"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("_pb_users_auth_")

  collection.options = {
    "allowEmailAuth": true,
    "allowOAuth2Auth": true,
    "allowUsernameAuth": true,
    "exceptEmailDomains": null,
    "manageRule": null,
    "minPasswordLength": 8,
    "onlyEmailDomains": null,
    "requireEmail": false
  }

  // remove
  collection.schema.removeField("x8b3fasn")

  return dao.saveCollection(collection)
})
