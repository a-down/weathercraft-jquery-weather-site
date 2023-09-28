const apiKey = process.env.API_KEY
const todayGrid = $('.today-grid')


// append information inside today card
function fillTodayCard(data) {
  console.log(data)
  let barColor

  for (i = 0; i < 9; i++) {
    console.log(i)
    i % 2 !== 0 ? barColor = '' : barColor = 'alt-element'
    todayGrid.append(
      `<div class="temp-graph-element">
      <div>
        <small>${data[i].temperature}°</small>
        <div class="temp-graph-bar ${barColor}" style="height: ${(data[i].temperature + 20) / 140}px"></div>
        <small class="bold-small">${data[i].time}</small>
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

async function fillCards() {
  const res = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=33.44&lon=-94.04&exclude=hourly,daily&appid=${apiKey}`)
  const data = await res.json()
  fillTodayCard(data)
}
fillCards()



