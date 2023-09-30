const nowCard = $('.now-card')
const tonightCard = $('.tonight-card')
const hourlyCard = $('.hourly-card')
const hourlyGrid = $('.today-grid')
const searchForm = $('.search-form')
let countriesData = []

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
  const queryStrings = window.location.href.split('?')[1].split('&')
  let queryObj = {}
  queryStrings.forEach(string => queryObj[ string.split('=')[0] ] = ( string.split('=')[1] ))
  return queryObj
}

// get apiUrl according to query object
async function getApiString(query) {
  let apiUrl
  query.city !== undefined ? apiUrl = `/api/weather/city/${query.city}` : apiUrl = `/api/weather/zip/${query.zip}/country/${query.country}`
  return apiUrl
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

// append information inside now card
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
      <img src="./assets/icons/wind.png" />
      <small>${Math.round(data.wind_speed)} mph</small>
    </div>
  </div>`
  )
}

// append information inside tonight card
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
      <img src="./assets/icons/wind.png" />
      <small>${Math.round(data.wind_speed)} mph</small>
    </div>
  </div>`
  )
}

// append information inside hourly card
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
        <small class="bold-small">${getHourlyTime(data.dt)}</small>
      </div>
    
      <div class="flex-col">
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" class="openweather-icon"/>
        <small>${Math.round(data.pop * 100)}%</small>
      </div>
    
      <div class="flex-col">
        <img src="./assets/icons/wind.png" style="opacity:${windOpacity}"/>
        <small>${(Math.round(data.wind_speed))} mph</small>
      </div>
    </div>`
    )
  }
}

function getFromStorage(localFileName) {
  const storage = JSON.parse(localStorage.getItem(localFileName))
  let previousSearches
  storage ? previousSearches = storage : previousSearches = []
  return previousSearches
}

function saveToStorage(localFileName, data) {
  const history = getFromStorage(localFileName)
  localStorage.setItem(localFileName, JSON.stringify([data, ...history]))
}

async function displayQuickWeather(data) {
  fillNowCard(data.weather.current)
  fillTonightCard(data.weather.daily[0])
  fillHourlyCard(data.weather.hourly)
  $('#city-title').text(`${data.geo.city}, ${data.geo.state}, ${data.geo.country}`)
}

async function newSearch(search) {
  let apiUrl
  search.city ? apiUrl = `/api/geo/city/${search.city}` : apiUrl = `/api/geo/zip/${search.zip}/country/${country}`
  const res = await fetch(apiUrl)
  const data = await res.json()
  saveToStorage('Search History', {city: data.city, state: data.state, country: data.country, zip: search.zip})
}

function searchButtonHandler() {
  const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
  const input = $('#search-input').val().toLowerCase()
  const splitInput = input.split('')
  let isZip = true
  splitInput.forEach((letter) => {
    if (jQuery.inArray(letter, alphabet) !== -1) isZip = false
  })
  isZip ? updateSearchForm(input) : newSearch({city: input})  //window.location.href = `/?city=${input}`
}

$('#search-button').on('click', (e) => {
  e.preventDefault()
  searchButtonHandler()
})

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
    window.location.href = `/?zip=${zip}&country=${countrySelect.val()}`
  })
}

async function start(){
  getCountries()
  const query = await getQuery()
  const apiUrl = await getApiString(query)
  const weather = await getWeather(apiUrl)
  displayQuickWeather(weather)
}

start()


