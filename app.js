
// http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
// https://api.open-meteo.com/v1/forecast?latitude=51.92&longitude=4.48&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,shortwave_radiation_sum&timezone=Europe%2FBerlin

let city = "London"

let myChart;

let init = 0;
let rank = 0;
let maxRank = 0;

//################### Application for one city

const apiCall = async () => {

  // Fetch coordinates data for given city

  const apiKey = "598ac9d7fb5d9179cbfc7e09826b85df";
  const endpointGeo = new URL(`http://api.openweathermap.org/geo/1.0/direct?`);
  console.log("city in geo fetch: ",city)
  endpointGeo.searchParams.set("q",city);
  endpointGeo.searchParams.set("appid",apiKey);
  endpointGeo.searchParams.set("limit",5);
  console.log("endpointGeo :",endpointGeo.toString());

  const responseGeo = await fetch(endpointGeo);
  console.log(responseGeo);
  const dataGeo = await responseGeo.json();
  console.log("dataGeo",dataGeo);

  maxRank = dataGeo.length; console.log(maxRank);
  rank = rank % maxRank; console.log(rank);

  // Fetch weather data for given coordinates

  const coordinates = { "latitute" : dataGeo[rank].lat, "longitute" : dataGeo[rank].lon};
  const endpointMeteo = new URL(`https://api.open-meteo.com/v1/forecast?latitude=${coordinates.latitute}&longitude=${coordinates.longitute}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,shortwave_radiation_sum&timezone=Europe%2FBerlin&past_days=92`)
  
  const responseMeteo = await fetch(endpointMeteo);
  console.log(responseMeteo);
  const dataMeteo = await responseMeteo.json();
  console.log(dataMeteo);

  // Table with last 3 months temperatures

  const dates = dataMeteo.daily.time;
  const temperaturesMax = dataMeteo.daily.temperature_2m_max;
  const temperaturesMin = dataMeteo.daily.temperature_2m_min;
  const precipitation = dataMeteo.daily.precipitation_sum;

  const table = document.createElement('table');

  const headerRow = document.createElement('tr');

  const dateHeader = document.createElement('th');
  dateHeader.textContent = 'Date';
  headerRow.appendChild(dateHeader);

  const temperatureHeaderMax = document.createElement('th');
  temperatureHeaderMax.textContent = 'Max temperature (°C)';
  headerRow.appendChild(temperatureHeaderMax);

  const temperatureHeaderMin = document.createElement('th');
  temperatureHeaderMin.textContent = 'Min temperature (°C)';
  headerRow.appendChild(temperatureHeaderMin);

  table.appendChild(headerRow);

  const rep = (temperature) => {
      return Number.parseFloat(temperature).toFixed(1);
    }

  for (let i = 0; i < dates.length; i++) {
      const row = document.createElement('tr');
      const dateCell = document.createElement('td');
      dateCell.textContent = dates[i];
      row.appendChild(dateCell);

      const temperatureMaxCell = document.createElement('td');
      temperatureMaxCell.textContent = rep(temperaturesMax[i]);
      row.appendChild(temperatureMaxCell);

      const temperatureMinCell = document.createElement('td');
      temperatureMinCell.textContent = rep(temperaturesMin[i]);
      row.appendChild(temperatureMinCell);

      table.appendChild(row);
  }
  document.body.appendChild(table);

  // chart for temperatures

  if(init > 0){myChart.destroy();}

  const ctx = document.getElementById('myChart');

  const labels = dates;

  const datapoints = {"data_1": temperaturesMax, "data_2" : temperaturesMin, "data_3" : precipitation};

  const data = {
      labels: labels,
      datasets: [
          {
          label: 'Max temperature (°C)',
          data: datapoints.data_1,
          borderColor: "#FF6D4D",
          backgroundColor: "#FF6D4D",
          fill: false,
          cubicInterpolationMode: 'monotone',
          tension: 0.4
          },
          {
              label: 'Min temperature (°C)',
              data: datapoints.data_2,
              borderColor: "#4DB9FF",
              backgroundColor: "#4DB9FF",
              fill: false,
              cubicInterpolationMode: 'monotone',
              tension: 0.4
          },
          {
            type: 'bar',
            label: 'Precipication (mm)',
            backgroundColor: "#DFF2FF",
            fill: true,
            data: datapoints.data_3
        }
      ]
  };

  const chartTitle = dataGeo[rank].country === 'US'? `Weather chart for ${dataGeo[rank].name} (${dataGeo[rank].state}, ${dataGeo[rank].country})` : `Weather chart for ${dataGeo[rank].name} (${dataGeo[rank].country})`;

  const config = {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: chartTitle
          },
        },
        interaction: {
          intersect: false,
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Value'
            },
            suggestedMin: -10,
            suggestedMax: 30
          }
        }
      },
    };

  myChart = new Chart(ctx, config);

}

apiCall();

const button = document.getElementById('button1');
const input = document.getElementById('input');
const nextCity = document.getElementById('button2');

button.addEventListener('click', function() {
  rank = 0;
  init += 1;
  city = input.value;
  console.log('city : ',city);
  apiCall();
});

input.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    button.click();
  }
});

nextCity.addEventListener('click', function() {
  rank += 1;
  init += 1;
  apiCall();
});


