migrate((db) => {
  const collection = new Collection({
    "id": "3fhw2mfr9zrgodj",
    "created": "2023-08-29 08:24:16.562Z",
    "updated": "2023-08-29 08:24:16.562Z",
    "name": "hooks",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "j8mewfur",
        "name": "collection",
        "type": "text",
        "required": true,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "4xcxcfuv",
        "name": "event",
        "type": "select",
        "required": true,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "insert",
            "update",
            "delete"
          ]
        }
      },
      {
        "system": false,
        "id": "u3bmgjpb",
        "name": "action_type",
        "type": "select",
        "required": true,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "command",
            "post"
          ]
        }
      },
      {
        "system": false,
        "id": "kayyu1l3",
        "name": "action",
        "type": "text",
        "required": true,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "zkengev8",
        "name": "action_params",
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
        "id": "balsaeka",
        "name": "expands",
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
        "id": "emgxgcok",
        "name": "disabled",
        "type": "bool",
        "required": false,
        "unique": false,
        "options": {}
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
  const collection = dao.findCollectionByNameOrId("3fhw2mfr9zrgodj");

  return dao.deleteCollection(collection);
})
