const { Router } = require('express');
const router = Router();
const { Character } = require('../db.js');



const getCharactersDBInfo =  () => {

  return Character.findAll({
    includes: {
      model: Character,
      attributes: ['id','name','description','thumbnail','comics','series','stories'],
      through: {
        attributes: []
      }
    }
  }) 
}

const getDBInfoSortedZA = async () => {

  const dbCharacters = await getCharactersDBInfo()
  dbCharacters.sort((a, b) =>{
    if(a.name > b.name){
      return -1
    }
    if(b.name > a.name  ) {
      return 1
    }
    return 0

  }) 

  return dbCharacters

}

const getADBInfoSortedAZ = async () => {

  const dbCharacters = await getCharactersDBInfo()
  dbCharacters.sort((a, b) =>{
    if(a.name > b.name){
      return 1
    }
    if(b.name > a.name  ) {
      return -1
    }
    return 0

  })

  return dbCharacters

}

router.get('/characters', async (req, res) => {

  const name = req.query.name
  let characters = await getCharactersDBInfo()

  if(name){
    let characterName = await characters.filter(character =>
        character.name.toLowerCase().includes(name.toLowerCase()))

    characterName.length ?
     res.status(200).send(characterName) :
     res.status(404).send('No existe ese personaje')
  } else {
    res.status(200).send(characters)
  }
})

router.get('/characters/:type', async (req, res) => {

  const { type } = req.params
  
  if(type === 'desc'){
    let charactersZA = await getDBInfoSortedZA()
    res.status(200).send(charactersZA)
  } else if( type === 'asc'){
    let charactersAZ = await getADBInfoSortedAZ()
    res.status(200).send(charactersAZ)
  } else{
    res.status(404).send('opcion inválida')
  }
  
})

router.get('/characters/id/:id', async (req, res) =>{
  
  const { id } = req.params
  
  await Character.findOne({
    where: {
      id,
    }
  })
  .then((character) => {
    res.status(200).json(character)
  })
  .catch((error) => res.status(404).send(error))
  
})                       
                      
module.exports = router;