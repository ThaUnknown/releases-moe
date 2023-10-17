migrate((db) => {
  const collection = new Collection({
    "id": "tk44f7o0fjt3nip",
    "created": "2023-10-17 13:23:51.840Z",
    "updated": "2023-10-17 13:23:51.840Z",
    "name": "editors",
    "type": "view",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "vgnqwmxg",
        "name": "username",
        "type": "text",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "nbvyayar",
        "name": "avatar",
        "type": "file",
        "required": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "maxSize": 5242880,
          "mimeTypes": [
            "image/jpeg",
            "image/png",
            "image/svg+xml",
            "image/gif",
            "image/webp"
          ],
          "thumbs": null,
          "protected": false
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {
      "query": "SELECT users.username, users.avatar, users.id FROM users WHERE users.canEdit = TRUE;"
    }
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("tk44f7o0fjt3nip");

  return dao.deleteCollection(collection);
})
