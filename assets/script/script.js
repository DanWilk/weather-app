var searchTermEl = document.querySelector('#city');
var formEl = document.querySelector('#user-form');
var currentDataEl = document.querySelector('#current-weather');
var dailyForecastEl = document.querySelector('#daily-forecast');
var buttonAreaEl = document.querySelector('#saved-buttons');
var searchCity = '';
var searchHistoryArr = [];


var formHandler = function(event) {
    event.preventDefault();

    searchCity = searchTermEl.value.trim();
    if (searchCity){
        getCityWeather(searchCity)

        createButtons();
    } else {
        alert('Please enter a city.')
    }
}

var getCityWeather= function(city) {
    var citySearchApi = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=17280c8e8dae0e1d09e9bae05716a0bb';
    
    fetch(citySearchApi).then(function(response){
        if (response.ok){
            response.json().then(function(data) {
                var cityLon = data.coord.lon;
                var cityLat = data.coord.lat;

                var weatherResultApi = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + cityLat + '&lon=' + cityLon + '&exclude=minutely,hourly,alerts&units=imperial&appid=17280c8e8dae0e1d09e9bae05716a0bb'
                fetch(weatherResultApi).then(function(response) {
                    response.json().then(function(result) {
                        currentDataEl.innerHTML = '';
                        dailyForecastEl.innerHTML = '';
                    
                        var currentDay = moment().format('M/D/YYYY');
                        var currentUvi = result.current.uvi;
                        var currentTemp = result.current.temp;
                        var currentWind = result.current.wind_speed;
                        var currentHumid = result.current.humidity;
                        var currentIcon = result.current.weather[0].icon;
                    
                        var currentCity = document.createElement('h2')
                        currentCity.innerHTML = searchCity + ' ' + currentDay + "<img src='http://openweathermap.org/img/wn/" + currentIcon + "@2x.png'></img>";

                        var currentInfo = document.createElement('ul')
                        currentInfo.innerHTML = '<li class="p-2">temp: ' + currentTemp + ' f</li><li class="p-2">Wind:' + currentWind + 'MPH</li><li class="p-2">Humidity: ' + currentHumid + '%</li><li class="p-2">UV Index: <span id="uvi" >'+ currentUvi + '</span></li>';
                        currentInfo.classList.add('list-unstyled');


                        currentDataEl.appendChild(currentCity);
                        currentDataEl.appendChild(currentInfo);

                        var uviSpanEl = document.querySelector('#uvi');
                        if (currentUvi < 3) {
                            uviSpanEl.setAttribute('class', 'bg-success rounded p-1');
                        } else if (currentUvi >= 3 && currentUvi < 7) {
                            uviSpanEl.setAttribute('class', 'bg-warning rounded p-1');
                        } else {
                            uviSpanEl.setAttribute('class', 'bg-danger rounded p-1 ');
                        };
                    
                        for (i = 0; i < 5; i++) {
                        var dailyTemp = result.daily[i].temp.max;
                        var dailyIcon = result.daily[i].weather[0].icon;
                        var dailyWind = result.daily[i].wind_speed;
                        var dailyHumid = result.daily[i].humidity;

                        var cardHolderEl = document.createElement('div');
                        cardHolderEl.classList = 'col-12 col-md-6 col-xl-2';

                        var dailyCardEl = document.createElement('div');
                        dailyCardEl.classList = 'card  bg-card-color';

                        var cardHeaderEl = document.createElement('h4');
                        cardHeaderEl.classList = 'card-title text-light';
                        cardHeaderEl.textContent = moment().add((i + 1), 'd').format('M/D/YYYY');

                        var cardListEl = document.createElement('ul');
                        cardListEl.classList = 'list-group-flush list-unstyled p-1 text-light';
                        cardListEl.innerHTML = "<li><img src='http://openweathermap.org/img/wn/" + dailyIcon + "@2x.png'></li><li class='p-1'>Temp: " + dailyTemp + " f</li><li class='p-1'>wind: " + dailyWind + " MPH</li><li class='p-1'>Humidity: " + dailyHumid + "%</li>"
                    
                        dailyCardEl.appendChild(cardHeaderEl);
                        dailyCardEl.appendChild(cardListEl);
                        cardHolderEl.appendChild(dailyCardEl);
                        dailyForecastEl.appendChild(cardHolderEl);

                        }

                    
                        searchTermEl.value = '';

                    })
                })
        
            })
        } else {
            alert('Error city not found');
        }
    });
}

var createButtons = function() {
    var newButton = document.createElement('button');
    newButton.classList = 'btn butt-search';
    newButton.setAttribute('type', 'button');
    newButton.textContent = searchCity;
    newButton.value = searchCity;


    buttonAreaEl.appendChild(newButton);

    var searchHistory = document.querySelectorAll('.butt-search');
    var tempArr = [];
    
    for (i = 0; i < searchHistory.length; i++) {
        var buttonValue = searchHistory[i].value
        var tempObject = {
            'ser' : buttonValue
        }

        tempArr.push(tempObject);
    };
    searchHistoryArr = tempArr;
    localStorage.setItem('search-buttons', JSON.stringify(searchHistoryArr));
    console.log(searchHistoryArr);
}

var buttonHandler = function(event) {
    var buttonClicked = event.target;
    var buttonVal = buttonClicked.value.trim();
    searchCity = buttonVal;
    getCityWeather(searchCity)
}

var getSearchButtons = function() {
    searchHistoryArr = localStorage.getItem('search-buttons');
    if (searchHistoryArr === null) {
        searchHistoryArr = [];
         return false;
    } else {
    
    searchHistoryArr = JSON.parse(searchHistoryArr);
    console.log(searchHistoryArr)
    
        for (i = 0; i < searchHistoryArr.length; i++) {
            searchCity = searchHistoryArr[i].ser;
        
            var newButton = document.createElement('button');
            newButton.classList = 'btn butt-search';
            newButton.setAttribute('type', 'button');
            newButton.textContent = searchCity;
            newButton.value = searchCity;
        
        
            buttonAreaEl.appendChild(newButton);
        
     
        };

        getCityWeather(searchCity)
    }
}

formEl.addEventListener('submit', formHandler);
buttonAreaEl.addEventListener('click', buttonHandler);

getSearchButtons();
