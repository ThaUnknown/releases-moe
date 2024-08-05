/// <reference path="../pb_data/types.d.ts" />

routerAdd('GET', '/api/listIDs', c => {
  const result = arrayOf(new DynamicModel({ alID: 0 }))
  $app.dao().db().newQuery('SELECT alID FROM entries').all(result)

  return c.string(200, result.map(r => r.alID).join(','))
})
