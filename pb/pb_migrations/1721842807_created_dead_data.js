/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "uynljignfze0qas",
    "created": "2024-07-24 17:40:07.422Z",
    "updated": "2024-07-24 17:40:07.422Z",
    "name": "dead_data",
    "type": "view",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "jkftdnf8",
        "name": "releaseGroup",
        "type": "text",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": 1,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "xfpqtdxt",
        "name": "infoHash",
        "type": "text",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": 10,
          "max": 40,
          "pattern": "[0-9a-f]+|<redacted>"
        }
      },
      {
        "system": false,
        "id": "1qsk9vzq",
        "name": "tracker",
        "type": "select",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "Nyaa",
            "AnimeBytes",
            "AniDex",
            "RuTracker",
            "AnimeTosho",
            "BeyondHD",
            "Other"
          ]
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
      "query": "SELECT t.id, t.releaseGroup, t.infoHash, t.tracker\nFROM torrents t\nLEFT JOIN (\n    SELECT DISTINCT json_each.value AS trs\n    FROM entries, json_each(entries.trs)\n) e ON t.id = e.trs\nWHERE e.trs IS NULL;"
    }
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("uynljignfze0qas");

  return dao.deleteCollection(collection);
})
