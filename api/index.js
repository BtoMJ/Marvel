const server = require('./src/app.js');
const { conn, Character } = require('./src/db.js');
const axios = require('axios')

const {API_KEY} = process.env

conn.sync({ 
  force: true 
})
  .then(async () => {

    const apiMarvelCharacters = await axios.get(`https://gateway.marvel.com:443/v1/public/characters${API_KEY}`)
    let apiCharacters = apiMarvelCharacters.data.data.results

    apiCharacters = apiCharacters?.map(character => {
      return {
        id: character.id,
        name: character.name,
        description: character.description,
        thumbnail: `${character.thumbnail.path}` + `.${character.thumbnail.extension}`,
        comics: character.comics.items,
        series: character.series.items,
        stories: character.stories.items,
      }
    })

  await Character.bulkCreate(apiCharacters)

  console.log('Base de datos conectada correctamente')
  server.listen(3001, () => {
  console.log('Escuchando puerto 3001'); // eslint-disable-line no-console
  });
});
