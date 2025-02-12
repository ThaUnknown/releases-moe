/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "vo51tfxn9pyqi59",
    "created": "2025-02-12 20:22:28.233Z",
    "updated": "2025-02-12 20:22:28.233Z",
    "name": "releaseGroups",
    "type": "view",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "jpdkgctt",
        "name": "count",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
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
      "query": "SELECT\n    torrents.releaseGroup as id,\n    count(torrents.releaseGroup) as count\nFROM torrents\nGROUP BY torrents.releaseGroup"
    }
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("vo51tfxn9pyqi59");

  return dao.deleteCollection(collection);
})
