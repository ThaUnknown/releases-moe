migrate((db) => {
  const collection = new Collection({
    "id": "oiwizhmushn5qqh",
    "created": "2023-08-29 08:24:16.563Z",
    "updated": "2023-08-29 08:24:16.563Z",
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
          "min": 40,
          "max": 40,
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
            "Nyaa",
            "AnimeBytes",
            "AniDex",
            "RuTracker",
            "AnimeTosho"
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
      },
      {
        "system": false,
        "id": "scgskbr2",
        "name": "files",
        "type": "json",
        "required": true,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "yllvndrm",
        "name": "dualAudio",
        "type": "bool",
        "required": false,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "g2ikws7s",
        "name": "releaseGroup",
        "type": "text",
        "required": true,
        "unique": false,
        "options": {
          "min": 1,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "indexes": [
      "CREATE UNIQUE INDEX `idx_K2zQ0nH` ON `torrents` (`infoHash`)"
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
  const collection = dao.findCollectionByNameOrId("oiwizhmushn5qqh");

  return dao.deleteCollection(collection);
})
