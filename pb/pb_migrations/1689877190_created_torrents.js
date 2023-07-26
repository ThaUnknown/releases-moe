migrate((db) => {
  const collection = new Collection({
    "id": "oiwizhmushn5qqh",
    "created": "2023-07-20 18:19:50.688Z",
    "updated": "2023-07-20 18:19:50.688Z",
    "name": "torrents",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "lt2phbxp",
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
        "id": "jp5spaaa",
        "name": "tracker",
        "type": "select",
        "required": true,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "nyaa",
            "animebytes",
            "anidex",
            "rutracker"
          ]
        }
      },
      {
        "system": false,
        "id": "hcahkpo7",
        "name": "url",
        "type": "url",
        "required": true,
        "unique": false,
        "options": {
          "exceptDomains": [],
          "onlyDomains": []
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
  const collection = dao.findCollectionByNameOrId("oiwizhmushn5qqh");

  return dao.deleteCollection(collection);
})
