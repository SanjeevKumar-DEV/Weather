// Inital get request formation to get lat long for the searched city 
var paramSeparator = '&';
var apiKeyParamName = 'appid=';
var apiKey = 'fc7a00aa9baea8ce97290c366a750d22';
var parentRequestUrl = 'https://api.openweathermap.org/data/2.5/';
var cityLatLongRequestURI = 'weather?';
var cityParamName = 'q=';
var cityParamValue = 'Sydney';

var cityLatLongRequestURL = '';

var cityResponseLat = '';
var cityResponseLong = '';

// Second request formation to make call for weather data
var weatherRequestURI = 'onecall?';
var weatherRequestLatParamName = 'lat=';
var weatherRequestLongParamName = 'lon=';
var weatherUnitsParamName = 'units=';
var weatherUnitsParamValue = 'imperial';

var weatherRequestURL = '';

var historicalSearches = [];
var firstTimeLoad = true;
var historicalSearchesContainer = $('.historicalSearches');

if (JSON.parse(localStorage.getItem('historicalSearches')) === null) {
    localStorage.setItem('historicalSearches', JSON.stringify(historicalSearches));
}
else 
{
    // Load historical searches from local storage on first load
    historicalSearches = JSON.parse(localStorage.getItem('historicalSearches'));
    if (historicalSearches[0] !== null & historicalSearches.length > 0) {
        cityParamValue = historicalSearches[0];
        $('#searchField').val(cityParamValue);
        for (var i = (historicalSearches.length - 1); i >= 0; i--) {
            var newItemAddedInSearch = $('<input>');
            newItemAddedInSearch.attr('value', historicalSearches[i]);
            newItemAddedInSearch.attr('type', 'button');
            newItemAddedInSearch.attr('class', 'col-12 leftPanelButtonDesign historicalSearchListerner');
            // newItemAddedInSearch.prop('disabled', false);
            var lineSeparator = $('<section>');
            lineSeparator.attr('class', 'row lineSeparator');
            historicalSearchesContainer.prepend(lineSeparator);
            historicalSearchesContainer.prepend(newItemAddedInSearch);
        }
    }
}

// Request to get weather data for initial load for last searched city 

function createAndRenderWeatherApp(event) {
    cityLatLongRequestURL = parentRequestUrl + cityLatLongRequestURI + cityParamName + cityParamValue + paramSeparator + apiKeyParamName + apiKey;
    function getWeatherData() {
        var requestUrl = cityLatLongRequestURL;
        var proceedAfterFirstCall = true;
        fetch(requestUrl)
            .then(function (response) {
                if (response.status === 200) {
                    return response.json();
                }
                else {
                    proceedAfterFirstCall = false;
                    return [];
                }
            })
            .then(function (data) {
                if (proceedAfterFirstCall) {
                    cityResponseLat = data.coord.lat;
                    cityResponseLong = data.coord.lon;
                    weatherRequestURL = parentRequestUrl + weatherRequestURI + weatherRequestLatParamName + cityResponseLat + paramSeparator + weatherRequestLongParamName + cityResponseLong + paramSeparator + weatherUnitsParamName + weatherUnitsParamValue + paramSeparator + apiKeyParamName + apiKey;
                    requestUrl = weatherRequestURL;
                    fetch(requestUrl).then(function (response) {
                        return response.json();
                    }).then(function (data) {
                        displayWeatherDataInCurrentContainer(data, cityParamValue);
                        displayForecastForNextFiveDays(data);
                        if (!firstTimeLoad) {
                            historicalSearches.unshift(cityParamValue);
                            localStorage.setItem('historicalSearches', JSON.stringify(historicalSearches));
                            addToSearchHistoryUI();
                            console.log(data);
                        }
                        else {
                            firstTimeLoad = false;
                        }
                    });
                }
                else {
                    var errorText = 'Enter correct city.';
                    $('#searchField').val(errorText);
                }
            });
    };
    getWeatherData();
    cityLatLongRequestURL = '';
    weatherRequestURL = '';
};

// UV Index Classification 

function addToSearchHistoryUI() {
    // historicalSearches
    var newItemAddedInSearch = $('<input>');
    newItemAddedInSearch.attr('value', cityParamValue);
    newItemAddedInSearch.attr('type', 'button');
    newItemAddedInSearch.attr('class', 'col-12 leftPanelButtonDesign historicalSearchListerner');
    // newItemAddedInSearch.prop('disabled', false);
    var lineSeparator = $('<section>');
    lineSeparator.attr('class', 'row lineSeparator');
    historicalSearchesContainer.prepend(lineSeparator);
    historicalSearchesContainer.prepend(newItemAddedInSearch);
}
// uvIndex lookup for severity
var uvIndex = {
    minimal: { min: 0, max: 2.5 },
    low: { min: 2.5, max: 5.5 },
    moderate: { min: 5.5, max: 7.5 },
    high: { min: 7.5, max: 10.5 },
    very_high: { min: 10.5, max: 100 }
};

// display current weather data in top current container 

function displayWeatherDataInCurrentContainer(data, city) {
    city = city.charAt(0).toUpperCase() + city.slice(1);
    // var todayDate = " \(" + moment().format('L') + "\) ";
    var todayDate = new Date(data.current.dt * 1000);
    var imageIcon = $('<img>');
    var imageURL = 'http://openweathermap.org/img/w/' + data.current.weather[0].icon + ".png"
    imageIcon.attr('src', imageURL);
    var citNameAndWeather = $('#cityNameTimeWeather');
    citNameAndWeather.text(city + ' ' + todayDate.getDate() + '/' + (todayDate.getMonth() + 1) + '/' + todayDate.getFullYear());
    citNameAndWeather.append(imageIcon);
    var temp = 'Temp: ' + data.current.temp + '\xB0' + 'F';
    $('#temp').text(temp);
    var wind = 'Wind: ' + data.current.wind_speed + ' MPH';
    $('#wind').text(wind);
    var humidity = 'Humidity: ' + data.current.humidity + ' %'
    $('#humidity').text(humidity);
    var uvIndexContainer = $('#uvIndex');
    uvIndexContainer.text('UV Index: ');
    var uvIndexValue = data.current.uvi;
    var uvIndexValueAndColour = $('<span>')
    uvIndexValueAndColour.attr('id', 'uvIndexValueAndColour')
    uvIndexValueAndColour.attr('style', 'width:40px; height:30px; color:white;');
    uvIndexContainer.append(uvIndexValueAndColour);
    if (uvIndexValue >= uvIndex.minimal.min & uvIndexValue <= uvIndex.minimal.max) {
        uvIndexValueAndColour.attr('class', 'uvIndexMinimal');
    }
    else if (uvIndexValue > uvIndex.low.min & uvIndexValue <= uvIndex.low.max) {
        uvIndexValueAndColour.attr('class', 'uvIndexLow');
    }
    else if (uvIndexValue > uvIndex.moderate.min & uvIndexValue <= uvIndex.moderate.max) {
        uvIndexValueAndColour.attr('class', 'uvIndexModerate');
    }
    else if (uvIndexValue > uvIndex.high.min & uvIndexValue <= uvIndex.high.max) {
        uvIndexValueAndColour.attr('class', 'uvIndexHigh');
    }
    else if (uvIndexValue > uvIndex.very_high.min & uvIndexValue <= uvIndex.very_high.max) {
        uvIndexValueAndColour.attr('class', 'uvIndexVeryHigh');
    }
    uvIndexValueAndColour.text(uvIndexValue);
}


// Display forecast for 5 days in future 
function displayForecastForNextFiveDays(data) {
    $('#forecastDisplay').empty();
    for (var i = 1; i <= 5; i++) {
        var forecastWeatherCard = $('<div>');
        forecastWeatherCard.attr('class', 'col-2 weatherCard');
        forecastWeatherCard.attr('style', 'background-color: navy; color:white');

        var date = new Date(data.daily[i].dt * 1000);
        var forecastDate = $('<div>');
        forecastDate.attr('id', 'forecastDate' + i);
        forecastDate.text(date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear());
        forecastWeatherCard.append(forecastDate);

        var imageIcon = $('<img>');
        var imageURL = 'http://openweathermap.org/img/w/' + data.daily[i].weather[0].icon + ".png"
        imageIcon.attr('src', imageURL);
        imageIcon.attr('id', 'forcastWeatherCondition' + i);
        forecastWeatherCard.append(imageIcon);

        var temp = 'Temp: ' + data.daily[i].temp.day + '\xB0' + 'F';
        var forecastTemp = $('<div>');
        forecastTemp.text(temp);
        forecastWeatherCard.append(forecastTemp);

        var wind = 'Wind: ' + data.daily[i].wind_speed + ' MPH';
        var forecastWind = $('<div>');
        forecastWind.text(wind);
        forecastWeatherCard.append(forecastWind);

        var humidity = 'Humidity: ' + data.daily[i].humidity + ' %'
        var forecastHumidity = $('<div>');
        forecastHumidity.text(humidity);
        forecastWeatherCard.append(forecastHumidity);
        $('#forecastDisplay').append(forecastWeatherCard);
    }
}

// Create time scheduler on the fly at when initial page load finished. 
$(document).ready(function (event) {
    createAndRenderWeatherApp();
});

$('#search').on('click', function (event) {
    event.preventDefault();
    cityParamValue = $('#searchField').val();
    createAndRenderWeatherApp();
});

$(document).on('click', '.historicalSearchListerner', function (event) {
    console.log(event.target.value);
    var city = event.target.value;
    event.preventDefault();
    cityParamValue = city;
    $('#searchField').val(city);
    createAndRenderWeatherApp();
});

