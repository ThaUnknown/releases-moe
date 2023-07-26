migrate((db) => {
  const collection = new Collection({
    "id": "9prkra0sspoqcdg",
    "created": "2023-07-17 15:50:41.794Z",
    "updated": "2023-07-17 15:50:41.794Z",
    "name": "anilistIDs",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "hrnkznqz",
        "name": "field",
        "type": "number",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("9prkra0sspoqcdg");

  return dao.deleteCollection(collection);
})
