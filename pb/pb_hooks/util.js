module.exports = {
  copy: obj => JSON.parse(JSON.stringify(obj)),
  anilistData: id => {
    try {
      const res = $http.send({
        url: 'https://graphql.anilist.co',
        method: 'POST',
        data: { query: `query{Media(id:${id}){title{english,romaji}coverImage{large}}}` },
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      })
      const title = res.json.data.Media.title
      const poster = res.json.data.Media.coverImage.large || ''
      return {
        title: title.english || title.romaji,
        poster
      }
    } catch (e) {
      console.log(e.toString())
      return id
    }
  }
}
