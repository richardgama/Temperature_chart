
// http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
// https://api.open-meteo.com/v1/forecast?latitude=51.92&longitude=4.48&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,shortwave_radiation_sum&timezone=Europe%2FBerlin

const city = "Prague"

const apiCall = async () => {

    // Fetch coordinates data for given city

    // const cityName = "Paris";
    // const apiKey = "";
    // const endpointGeo = new URL(`http://api.openweathermap.org/geo/1.0/direct?`);
    // endpointGeo.searchParams.set("q",cityName);
    // endpointGeo.searchParams.set("appid",apiKey);
    // console.log(endpointGeo.toString());

    // const responseGeo = await fetch(endpointGeo);
    // console.log(responseGeo);
    // const dataGeo = await responseGeo.json();
    // console.log(dataGeo);

    // Fetch weather data for given coordinates

    const coordinates = { "latitute" : 50.075, "longitute" : 14.437};
    const endpointMeteo = new URL(`https://api.open-meteo.com/v1/forecast?latitude=${coordinates.latitute}&longitude=${coordinates.longitute}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,shortwave_radiation_sum&timezone=Europe%2FBerlin&past_days=92`)
    
    const responseMeteo = await fetch(endpointMeteo);
    console.log(responseMeteo);
    const dataMeteo = await responseMeteo.json();
    console.log(dataMeteo);

    // Table with last 3 months temperatures

    const dates = dataMeteo.daily.time;
    const temperaturesMax = dataMeteo.daily.temperature_2m_max;
    const temperaturesMin = dataMeteo.daily.temperature_2m_min;

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

    const ctx = document.getElementById('myChart');

    const DATA_COUNT = temperaturesMax.length;
    const labels = dates;
    // for (let i = 0; i < DATA_COUNT; ++i) {
    //     labels.push(i.toString());
    // }

    const datapoints = {"data_1": temperaturesMax, "data_2" : temperaturesMin};

    const data = {
        labels: labels,
        datasets: [
            {
            label: 'Max temperature',
            data: datapoints.data_1,
            borderColor: "#FF6D4D",
            fill: false,
            cubicInterpolationMode: 'monotone',
            tension: 0.4
            },
            {
                label: 'Min temperature',
                data: datapoints.data_2,
                borderColor: "#4DB9FF",
                fill: false,
                cubicInterpolationMode: 'monotone',
                tension: 0.4
            }
        ]
};

    const config = {
        type: 'line',
        data: data,
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: `Weather chart for ${city}`
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
              suggestedMin: -15,
              suggestedMax: 25
            }
          }
        },
      };

    new Chart(ctx, config);

}

apiCall();
