const nowCard = $('.now-card')
const tonightCard = $('.tonight-card')
const todayGrid = $('.today-grid')

function getHourlyTime(unix) {
  const newDate = new Date(unix * 1000);
  const hour = newDate.getHours()
  hour > 12 ? time = `${hour - 12} pm` : time  = `${hour} am`
  return(time)
}

// append information inside now card
function fillNowCard(data) {
  console.log()
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
      <img src="https://placehold.co/48" />
      <small>${data.precip}</small>
    </div>

    <div class="quick-weather-card-visual">
      <img src="https://placehold.co/48" />
      <small>${data.wind}</small>
    </div>
  </div>`
  )
}

function fillTonightCard(data) {
  console.log(data)
  tonightCard.append(
    `<div class="flex-between">
    <p>${data.temp}</p>
    <p class="gray-text">Temp</p>
  </div>

  <div class="flex-between">
    <p>${data.feelsLike}</p>
    <p class="gray-text">Feels Like</p>
  </div>

  <div class="flex-around">
    <div class="quick-weather-card-visual">
      <img src="https://placehold.co/48" />
      <small>${data.precip}</small>
    </div>

    <div class="quick-weather-card-visual">
      <img src="https://placehold.co/48" />
      <small>${data.wind}</small>
    </div>
  </div>`
  )
}

// append information inside today card
function fillTodayCard(data) {
  console.log(data)
  let barColor

  for (i = 0; i < 9; i++) {
    i % 2 !== 0 ? barColor = '' : barColor = 'alt-element'
    todayGrid.append(
      `<div class="temp-graph-element">
      <div>
        <small>${data[i].temperature}°</small>
        <div class="temp-graph-bar ${barColor}" style="height: ${(data[i].temperature + 20) / 140}px"></div>
        <small class="bold-small">${getHourlyTime(hour.dt)}</small>
      </div>
    
      <div class="flex-col">
        <img src="https://placehold.co/20" />
        <small>10%</small>
      </div>
    
      <div class="flex-col">
        <img src="https://placehold.co/20" />
        <small>10 mph NW</small>
      </div>
    </div>`
    )
  }
}

async function getApiKey() {
  const res = await fetch(`../public/assets/apiKey.json`)
  const data = await res.json()
  return data.API_KEY
}

async function fillCards() {
  const apiKey = await getApiKey()
  const res = await fetch(`https://api.openweathermap.org/data/3.0/onecall?units=imperial&lat=33.44&lon=-94.04&appid=${apiKey}`)
  // const res = await fetch('../public/assets/testData.json')
  const data = await res.json()
  console.log(data)
  fillNowCard(data.current)
  fillTodayCard(data[0])
  fillTonightCard(data[1][0])
}
fillCards()



