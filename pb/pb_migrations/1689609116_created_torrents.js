migrate((db) => {
  const collection = new Collection({
    "id": "3l2x9nxip35gqb5",
    "created": "2023-07-17 15:51:56.223Z",
    "updated": "2023-07-17 15:51:56.223Z",
    "name": "torrents",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "7aqgnstu",
        "name": "infoHash",
        "type": "text",
        "required": true,
        "unique": false,
        "options": {
          "min": 20,
          "max": 20,
          "pattern": "[0-9a-f]+"
        }
      },
      {
        "system": false,
        "id": "569bwutq",
        "name": "name",
        "type": "text",
        "required": true,
        "unique": false,
        "options": {
          "min": 2,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "zl40bbcd",
        "name": "files",
        "type": "json",
        "required": true,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "c3izxdlr",
        "name": "field",
        "type": "relation",
        "required": true,
        "unique": false,
        "options": {
          "collectionId": "9prkra0sspoqcdg",
          "cascadeDelete": false,
          "minSelect": 1,
          "maxSelect": null,
          "displayFields": []
        }
      }
    ],
    "indexes": [
      "CREATE INDEX `idx_nrSbHzP` ON `torrents` (`field`)"
    ],
    "listRule": "",
    "viewRule": "",
    "createRule": "@request.auth.id != '' && @request.auth.canEdit = true",
    "updateRule": "@request.auth.id != '' && @request.auth.canEdit = true",
    "deleteRule": "@request.auth.id != '' && @request.auth.canEdit = true",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("3l2x9nxip35gqb5");

  return dao.deleteCollection(collection);
})
