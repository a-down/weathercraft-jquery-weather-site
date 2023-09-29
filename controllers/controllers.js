const router = require('express').Router();
const apiKey = process.env.API_KEY

async function getGeo(req) {
  try {
    let apiUrl
    (req.city) 
      ? apiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${req.city}&limit=1&appid=${apiKey}` 
      : apiUrl = `http://api.openweathermap.org/geo/1.0/zip?zip=${req.zip},${req.zipCountry}&appid=${apiKey}`
  
    const geo = await fetch(apiUrl)
    const geoData = await geo.json()
    let returnData
    (req.city) ? returnData = geoData[0] : returnData = geoData
    return {
      lat: returnData.lat, 
      lon: returnData.lon, 
      city: returnData.name, 
      state: returnData.state,
      country: returnData.country
    }

  } catch (err) {
    if( process.env.NODE_ENV === "development") console.log(err)
    throw err
  }
}

async function getState(req) {
  try {
    let apiUrl = `http://api.openweathermap.org/geo/1.0/reverse?lat=${req.lat}&lon=${req.lon}&limit=1&appid=${apiKey}`
    
    const geo = await fetch(apiUrl)
    const geoData = await geo.json()

    let returnData
    (req.city) ? returnData = geoData[0] : returnData = geoData
    return {
      lat: returnData.lat, 
      lon: returnData.lon, 
      city: returnData.name, 
      state: returnData.state,
      country: returnData.country
    }

  } catch (err) {
    if( process.env.NODE_ENV === "development") console.log(err)
    throw err
  }
}

async function getWeather(req) {
  try {
    let apiUrl = `https://api.openweathermap.org/data/3.0/onecall?exclude=minutely&units=imperial&lat=${req.lat}&lon=${req.lon}&appid=${apiKey}`
    const weather = await fetch(apiUrl)
    return weatherData = await weather.json()

  } catch (err) {
    if( process.env.NODE_ENV === "development") console.log(err)
    throw err
  }
}

module.exports = {
  getGeo,
  getWeather,
  getState
}