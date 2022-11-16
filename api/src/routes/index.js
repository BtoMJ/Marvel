const { Router } = require('express');
// const axios = require('axios')
const router = Router();
const { Country, TouristACT } = require('../db.js');


// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');



// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
//axios.get('https://restcountries.eu/rest/v2/all')


// const getApiInfo = async () => {

//   const apiCountry = await axios.get('https://restcountries.eu/rest/v2/all')
//   const apiInfo = await apiCountry.data.map((info) => {
//     return {
//         id: info.alpha3Code,
//         name: info.name,
//         capital: info.capital,
//         continent: info.region,
//         subregion: info.subregion,
//         flag: info.flag,
//         population: info.population,
//         area: info.area,
//     }
//   })
//   return apiInfo

// }

///////////// ME TRAE LOS PAISES DE LA BD ///////////////
const getCountriesDBInfo =  () => {

  return Country.findAll({
    includes: {
      model: Country,
      attributes: ['id','name','capital','continent','subregion','flag','population','area'],
      through: {
        attributes: []
      }
    }
  }) 

}

///////////// ME TRAE LAS ACTIVIDADES DE LA BD ///////////////
const getActivitiesDBInfo = async () => {

  return await TouristACT.findAll({
    includes: {
      model: TouristACT,
      attributes: ['name', 'duration', 'difficulty', 'season'],
      through: {
        attributes: []
      }
    }
  }) 
}


///////////// ORDENA LOS PAISES Z - A ///////////////
const getDBInfoSortedZA = async () => {

  const dbCountries = await getCountriesDBInfo()
  dbCountries.sort((a, b) =>{
    if(a.name > b.name){
      return -1
    }
    if(b.name > a.name  ) {
      return 1
    }
    return 0

  }) 

  return dbCountries

}

///////////// ORDENA LOS PAISES A - Z ///////////////
const getADBInfoSortedAZ = async () => {

  const dbCountries = await getCountriesDBInfo()
  dbCountries.sort((a, b) =>{
    if(a.name > b.name){
      return 1
    }
    if(b.name > a.name  ) {
      return -1
    }
    return 0

  })

  return dbCountries

}

const getDBInfoSortedPopulationAZ = async () => {

  const dbPopulationAZ = await getCountriesDBInfo()
  dbPopulationAZ.sort((a, b) =>{
    if(a.population > b.population){
      return 1
    }
    if(b.population > a.population  ) {
      return -1
    }
    return 0

  })

  return dbPopulationAZ

}

const getDBInfoSortedPopulationZA = async () => {

  const dbPopulationZA = await getCountriesDBInfo()
  dbPopulationZA.sort((a, b) =>{
    if(a.population > b.population){
      return -1
    }
    if(b.population > a.population  ) {
      return 1
    }
    return 0

  })

  return dbPopulationZA

}

router.get('/countries/population/:type', async (req, res) => {

  const { type } = req.params
  if(type === 'desc'){
    let countriesPopulation = await getDBInfoSortedPopulationZA()
    res.status(200).send(countriesPopulation)
  } else if( type === 'asc'){
    let countriesPopulation = await getDBInfoSortedPopulationAZ()
    res.status(200).send(countriesPopulation)
  } else{
    res.status(404).send('opcion inválida')
  }
  
})

router.get('/countries', async (req, res) => {

  const name = req.query.name
  let countries = await getCountriesDBInfo()

  if(name){
    let countryName = await countries.filter(country =>
     country.name.toLowerCase().includes(name.toLowerCase()))

     countryName.length ?
     res.status(200).send(countryName) :
     res.status(404).send('No existe ese país')
  } else {
    res.status(200).send(countries)
  }
})

///////////// RENDERIZA LOS PAISES Z -A Ó A - Z ///////////////
router.get('/countries/:type', async (req, res) => {

  const { type } = req.params
  if(type === 'desc'){
    let countriesZA = await getDBInfoSortedZA()
    res.status(200).send(countriesZA)
  } else if( type === 'asc'){
    let countriesAZ = await getADBInfoSortedAZ()
    res.status(200).send(countriesAZ)
  } else{
    res.status(404).send('opcion inválida')
  }
  
})

router.get('/countries/:id', async (req, res) =>{
  
  const { id } = req.query
  
  Country.findOne({
    where: {
      id: id.toUpperCase()
    }
  })
  .then((country) => {
    
    res.status(200).json  ( country )
  })
  .catch((error) => res.status(404).send(error))
  
})

router.post('/activity', async (req, res) => {
  
  const { name, difficulty, duration, season, countries} = req.body
  
  try{
    
    let [act, created] = await TouristACT.findOrCreate({
      where: {
        name: name,
        difficulty: difficulty,
        duration: duration,
        season: season,
      }})
      
      await act.setCountries(countries)
      return res.status(200).json(act)
      
    } catch (error) {
      console.log(error)
    }
  })
  
router.get('/activities', async (req, res) => {
  
  const { name } = req.query
  const act = await getActivitiesDBInfo(TouristACT)
  
  if(name){

    TouristACT.findOne({
      where: {
        name: name
      }
    })
    .then((act) => {
      res.send( act )
    })
    .catch((error) => res.status(404).send(error))




  } else {
    res.status(200).json(act)
    }
})
    
router.get('/activities/:id', async (req, res) => {
  
  const { id } = req.params;
  try{
    const country = await Country.findByPk(id.toUpperCase())
    const activities = await country.getTouristACTs();
    
    const result = activities.map(t => t.toJSON())
    res.status(200).json(result)
    
  } catch(err){
    console.log(err)
  }
  
})
    
                                 
                      
module.exports = router;








// const getAllCountries = async () => {

//   const apiInfo = await getApiInfo()
//   const dbInfo = await getDBInfo()
//   const allInfo = apiInfo.concat(dbInfo)
//   return allInfo

// }