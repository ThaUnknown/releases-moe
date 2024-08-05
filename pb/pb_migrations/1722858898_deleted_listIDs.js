/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("5lpk1ojhj7axx4b");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "5lpk1ojhj7axx4b",
    "created": "2024-07-13 20:28:22.496Z",
    "updated": "2024-07-14 12:50:35.582Z",
    "name": "listIDs",
    "type": "view",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "0mpccfsi",
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
      }
    ],
    "indexes": [],
    "listRule": "",
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {
      "query": "SELECT id, alID FROM entries LIMIT 10000"
    }
  });

  return Dao(db).saveCollection(collection);
})
