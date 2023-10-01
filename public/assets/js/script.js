const nowCard = $('.now-card')
const tonightCard = $('.tonight-card')
const hourlyCard = $('.hourly-card')
const hourlyGrid = $('.today-grid')
const searchForm = $('.search-form')
let countriesData = []
let favoriteLocation
let currentLocation

// modal handlers
const openModal = (id) => $(`#${id}`).addClass('open')
const closeModal = (id) => $(`#${id}`).removeClass('open')

// get and set list of countries and country codes
async function getCountries() {
  const res = await fetch('https://countriesnow.space/api/v0.1/countries')
  const countryData = await res.json()
  await countryData.data.forEach(obj => {
    countriesData.push({
      country: obj.country,
      code: obj.iso2
    })
  })
}

// get query from window.location.href
async function getQuery() {
  const paramString = window.location.href.split('?')[1]
  if (paramString) {
    const queryStrings = paramString.split('&')
    let queryObj = {}
    queryStrings.forEach(string => queryObj[ string.split('=')[0] ] = ( string.split('=')[1] ))
    return queryObj
  } else {
    return ''
  }
}

// get favorite location from local storage
function getFavoriteLocation() {
  const storage = getFromStorage('Favorite Location')
  if(storage) favoriteLocation = storage[0]
}

// get apiUrl according to query object
async function getApiString(query) {
  let apiUrl
  if (query) {
    query.city !== undefined 
      ? apiUrl = `/api/weather/city/${query.city}` 
      : apiUrl = `/api/weather/zip/${query.zip}/country/${query.country}`
    return apiUrl

  } else if (favoriteLocation) {
    favoriteLocation.zip === undefined 
      ? apiUrl = `/api/weather/city/${favoriteLocation.city}` 
      : apiUrl = `/api/weather/zip/${favoriteLocation.zip}/country/${favoriteLocation.country}`
    return apiUrl

  } else {
    return 
  }
}

// get weather with apiUrl
async function getWeather(apiUrl) {
  const res = await fetch(apiUrl)
  const data = await res.json()
  return data
}

// get time with am and pm from unix argument
function getHourlyTime(unix) {
  const newDate = new Date(unix * 1000);
  const hour = newDate.getHours()
  hour > 12 ? time = `${hour - 12} pm` : time  = `${hour} am`
  if (hour === 0) time = `12 pm`
  return(time)
}

// append weather data inside now card
function fillNowCard(data) {
  nowCard.children('.loader').remove()
  let description
  data.pop !== undefined ? description = `${data.pop * 100}%` : description = data.weather[0].description
  nowCard.append(
    `<div class="flex-between">
    <p>${Math.round(data.temp)}°</p>
    <p class="gray-text">Temp</p>
  </div>

  <div class="flex-between">
    <p>${Math.round(data.feels_like)}°</p>
    <p class="gray-text">Feels Like</p>
  </div>

  <div class="flex-around">
    <div class="quick-weather-card-visual">
      <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" class="openweather-icon"/>
      <small>${description}</small>
    </div>

    <div class="quick-weather-card-visual">
      <img src="./assets/icons/wind.svg" />
      <small>${Math.round(data.wind_speed)} mph</small>
    </div>
  </div>`
  )
}

// append weather data inside tonight card
function fillTonightCard(data) {
  tonightCard.children('.loader').remove()
  let description
  data.pop > 0 ? description = `${data.pop * 100}%` : description = data.weather[0].description
  tonightCard.append(
    `<div class="flex-between">
    <p>${Math.round(data.temp.night)}°</p>
    <p class="gray-text">Temp</p>
  </div>

  <div class="flex-between">
    <p>${Math.round(data.feels_like.night)}°</p>
    <p class="gray-text">Feels Like</p>
  </div>

  <div class="flex-around">
    <div class="quick-weather-card-visual">
      <img src="https://openweathermap.org/img/wn/${data.weather[0].icon.split('d')[0]}n@2x.png" class="openweather-icon"/>
      <small>${description}</small>
    </div>

    <div class="quick-weather-card-visual">
      <img src="./assets/icons/wind.svg" />
      <small>${Math.round(data.wind_speed)} mph</small>
    </div>
  </div>`
  )
}

// append weather data inside hourly card
function fillHourlyCard(dataArg) {
  hourlyCard.children('.loader').remove()
  let barColor
  let windOpacity
  for (i = 0; i < 9; i++) {
    let data = dataArg[i*2]
    i % 2 !== 0 ? barColor = '' : barColor = 'alt-element'
    if (data.wind_speed < 8) windOpacity = 0.2
    if (data.wind_speed > 7) windOpacity = 0.7
    if (data.wind_speed > 18) windOpacity = 1

    hourlyGrid.append(
      `<div class="temp-graph-element">
      <div>
        <small>${Math.round(data.temp)}°</small>
        <div class="temp-graph-bar ${barColor}" style="height: ${ Math.round( ((data.temp + 20) / 140) * 100 ) }px"></div>
        <div class="temp-graph-line"></div>
        <small class="bold-small">${getHourlyTime(data.dt)}</small>
      </div>
    
      <div class="flex-col">
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" class="openweather-icon"/>
        <small>${Math.round(data.pop * 100)}%</small>
      </div>
    
      <div class="flex-col">
        <img src="./assets/icons/wind.svg" style="opacity:${windOpacity}"/>
        <small>${(Math.round(data.wind_speed))} mph</small>
      </div>
    </div>`
    )
  }
}

// reusable function to get from local storage
  // pass in name of file
  // return an array with data (if it exists), empty array if no storage
function getFromStorage(localFileName) {
  const storage = JSON.parse(localStorage.getItem(localFileName))
  let storageReturn
  storage ? storageReturn = storage : storageReturn = []
  return storageReturn
}

// reusable functino to store in local storage
  // localFileName = name of file, data = data being put in storage, replacing = boolean (true if replacing what is in storage, false if adding to storage)
function saveToStorage(localFileName, data, replacing) {
  const history = getFromStorage(localFileName)
  replacing 
    ? localStorage.setItem(localFileName, JSON.stringify([data]))
    : localStorage.setItem(localFileName, JSON.stringify([data, ...history]))
}

// call functions to display weather inside cards
async function displayWeather(data) {
  fillNowCard(data.weather.current)
  fillTonightCard(data.weather.daily[0])
  fillHourlyCard(data.weather.hourly)
}

// if the current location matches the favorite location, show a star icon
// if not, show a button to set location as favorite
// called on page load and if user sets a location as their favorite
function renderFavoriteElement() {
  const favoriteElement = $('.favorite-wrapper')
  favoriteElement.children().remove()
  if (favoriteLocation && 
    currentLocation.city === favoriteLocation.city && 
    currentLocation.state === favoriteLocation.state && 
    currentLocation.country === favoriteLocation.country) {

    favoriteElement.append(`<img src="./assets/icons/star.svg" class="favorite-icon"/>`)

  } else {
    favoriteElement.append(`<button class="button favorite-button" onClick="setFavorite()">Set as Favorite</button>`)
  }
}

// if user has search history, show 5 most recent in search modal
function displaySearchHistory() {
  const history = getFromStorage('Search History')
  let historyLink
  // if there are more than 5 searches in history
  if (history.length > 4) {
    for (i = 0; i < 5; i++) {
      history[i].zip 
        ? historyLink = `/?zip=${history[i].zip}&country=${history[i].country}`
        : historyLink = `/?city=${history[i].city}`
  
      $('.search-history-wrapper').append(
        `<a href=${historyLink} class="history-link button">${history[i].city}, ${history[i].state}, ${history[i].country}</a>`
      )
    }
  // if there are fewer than 5 searches in history
  } else {
    history.forEach(search => {
      search.zip 
        ? historyLink = `/?zip=${search.zip}&country=${search.country}`
        : historyLink = `/?city=${search.city}`
      
      $('.search-history-wrapper').append(
        `<a href=${historyLink} class="history-link">${search.city}, ${search.state}, ${search.country}</a>`
      )
    })
  }
}

// function called when a new search is called
  // updates href with updated params
async function newSearch(search) {
  let apiUrl
  let href

  if (search.city) {
    apiUrl = `/api/geo/city/${search.city}` 
    href = `/?city=${search.city}`
  } else {
    apiUrl = `/api/geo/zip/${search.zip}/country/${search.country}`
    href = `/?zip=${search.zip}&country=${search.country}`
  }

  const res = await fetch(apiUrl)
  const data = await res.json()
  saveToStorage('Search History', {city: data.city, state: data.state, country: data.country, zip: search.zip}, false) // false for replacing, save to storage is adding on , not replacing
  window.location.href = href
}

// function for when user clicks on the first search button
  // if they entered a city, a new search happens with the city name
  // if they entered a zip code (containing any numbers), updateSearchForm is called to add country select field to form
    // country is required for a zip api call to OpenWeather Geocoder
function searchButtonHandler() {
  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
  const input = $('#search-input').val().toLowerCase()
  const splitInput = input.split('')
  let isZip = false
  splitInput.forEach((value) => {
    if (jQuery.inArray(value, numbers) !== -1) isZip = true
  })
  isZip ? updateSearchForm(input) : newSearch({city: input})
}

$('#search-button').on('click', (e) => {
  e.preventDefault()
  searchButtonHandler()
})

// called if user searches a zip code
  // appends the select form with all countries and country codes as options
  // removes previous search button
  // appends new search button and declares slick listner
function updateSearchForm(zip) {
  // remove search button
  searchForm.children('div').eq('0').children('button').remove()
  // append dropdown and new search button
  searchForm.append(`
    <div class="search-wrapper">
      <select placeholder="select country" class='country-select'>
        <option value="US">United States</option>
      </select>
      <button id="search-zip-button">Search</button>
    </div>`)

  const countrySelect = $('.country-select')
  // add options for dropdown
  countriesData.forEach(country => {
    countrySelect.append(`<option value="${country.code}">${country.country}</option>`)
  })

  // update href with url for search by zip and country
  $('#search-zip-button').on('click', (e) => {
    e.preventDefault()
    newSearch({zip: zip, country: countrySelect.val()})
  })
}

// sets currentLocation variable on page load
  // required to check if favorite location matches current location
function setCurrentLocation(geo, zip) {
  $('#city-title').text(`${geo.city}, ${geo.state}, ${geo.country}`)
  currentLocation = {
    city: geo.city,
    state: geo.state,
    country: geo.country,
    zip: zip
  }
}

// when user clicks 'set as favorite' button
  // save location as favorite to local storage
  // updates favoriteLocation variable with getFavorite Location
  // updates button to star icon with renderFavoriteElement
function setFavorite() {
  saveToStorage('Favorite Location', currentLocation, true)
  getFavoriteLocation()
  renderFavoriteElement()
}

// start function called on page load
async function start(){
  getCountries()
  getFavoriteLocation()
  displaySearchHistory()

  const query = await getQuery()
  const apiUrl = await getApiString(query)

  if (apiUrl) {
    const weather = await getWeather(apiUrl)
    setCurrentLocation(weather.geo, query.zip)
    displayWeather(weather)
    console.log('here1')
    renderFavoriteElement()
    console.log('here2')

  } else {
    $('.close-icon').remove()
    openModal('search-modal')
    $('.loader').remove()
  }
}

start()


