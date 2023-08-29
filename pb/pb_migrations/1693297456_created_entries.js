migrate((db) => {
  const collection = new Collection({
    "id": "3l2x9nxip35gqb5",
    "created": "2023-08-29 08:24:16.563Z",
    "updated": "2023-08-29 08:24:16.563Z",
    "name": "entries",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "bdb9s2ju",
        "name": "torrents",
        "type": "relation",
        "required": true,
        "unique": false,
        "options": {
          "collectionId": "oiwizhmushn5qqh",
          "cascadeDelete": false,
          "minSelect": 1,
          "maxSelect": null,
          "displayFields": []
        }
      },
      {
        "system": false,
        "id": "lsgax7id",
        "name": "alID",
        "type": "number",
        "required": true,
        "unique": false,
        "options": {
          "min": 1,
          "max": null
        }
      },
      {
        "system": false,
        "id": "nqsidepl",
        "name": "notes",
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
        "id": "7c9qutoz",
        "name": "incomplete",
        "type": "bool",
        "required": false,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "ekinf2g1",
        "name": "best",
        "type": "relation",
        "required": false,
        "unique": false,
        "options": {
          "collectionId": "oiwizhmushn5qqh",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": []
        }
      },
      {
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
      }
    ],
    "indexes": [],
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
