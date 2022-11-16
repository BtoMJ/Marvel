const server = require('./src/app.js');
const { conn, Character } = require('./src/db.js');
const axios = require('axios')

const {API_KEY} = process.env


// Syncing all the models at once.
conn.sync({ 
  force: true 
})
  .then(async () => {

    const apiMarvelCharacters = await axios.get(`https://gateway.marvel.com:443/v1/public/characters${API_KEY}`)
    console.log(apiMarvelCharacters.data.data.results);
    let apiCharacters = apiMarvelCharacters.data.data.results

    // console.log(apiCharacters);

    apiCharacters = apiCharacters?.map(character => {
        console.log(character.comics)
      return {
        id: character.id,
        name: character.name,
        description: character.description,
        thumbnail: `${character.thumbnail.path}` + `.${character.thumbnail.extension}`,
        // comics: [{"resourceURI": "http://gateway.marvel.com/v1/public/comics/21366",
        // "name": "Avengers: The Initiative (2007) #14"}],
        comics: character.comics.items,
        series: character.series.items,
        stories: character.stories.items,
      }
    })

//   console.log(apiCharacters)
  await Character.bulkCreate(apiCharacters)

  console.log('Base de datos conectada correctamente')
  server.listen(3001, () => {
  console.log('Escuchando puerto 3001'); // eslint-disable-line no-console
  });
});
