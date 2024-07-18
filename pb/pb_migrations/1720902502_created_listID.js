/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "5lpk1ojhj7axx4b",
    "created": "2024-07-13 20:28:22.496Z",
    "updated": "2024-07-13 20:28:22.496Z",
    "name": "listID",
    "type": "view",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "qmldd1q9",
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
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {
      "query": "SELECT id, alID FROM entries"
    }
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("5lpk1ojhj7axx4b");

  return dao.deleteCollection(collection);
})
