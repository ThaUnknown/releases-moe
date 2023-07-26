migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("9prkra0sspoqcdg");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "9prkra0sspoqcdg",
    "created": "2023-07-17 15:50:41.794Z",
    "updated": "2023-07-20 17:25:10.214Z",
    "name": "anilistIDs",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "hrnkznqz",
        "name": "al",
        "type": "number",
        "required": true,
        "unique": false,
        "options": {
          "min": null,
          "max": null
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
})
