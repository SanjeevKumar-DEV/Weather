// Inital get request formation to get lat long for the searched city 
var paramSeparator = '&';
var apiKeyParamName = 'appid=';
var apiKey = 'fc7a00aa9baea8ce97290c366a750d22';
var parentRequestUrl = 'https://api.openweathermap.org/data/2.5/';
var cityLatLongRequestURI = 'weather?';
var cityParamName = 'q=';
var cityParamValue = 'Patna';

var cityLatLongRequestURL = parentRequestUrl + cityLatLongRequestURI + cityParamName + cityParamValue + paramSeparator + apiKeyParamName + apiKey;

var cityResponseLat = '';
var cityResponseLong = '';

// Second request formation to make call for weather data
var weatherRequestURI = 'onecall?';
var weatherRequestLatParamName = 'lat=';
var weatherRequestLongParamName = 'lon=';
var weatherUnitsParamName = 'units=';
var weatherUnitsParamValue = 'imperial';

var weatherRequestURL = parentRequestUrl + weatherRequestURI;

// Request to get weather data for initial load for last searched city 

function createAndRenderWeatherApp(event) {
    console.log(cityLatLongRequestURL);
    var displayContent = $('#response');
    function getWeatherData() {
        var requestUrl = cityLatLongRequestURL;
        fetch(requestUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);
                cityResponseLat = data.coord.lat;
                cityResponseLong = data.coord.lon;
                weatherRequestURL += weatherRequestLatParamName + cityResponseLat + paramSeparator + weatherRequestLongParamName + cityResponseLong + paramSeparator + weatherUnitsParamName + weatherUnitsParamValue + paramSeparator + apiKeyParamName + apiKey;
                console.log(weatherRequestURL);
                requestUrl = weatherRequestURL;
                fetch(requestUrl).then(function (response) {
                    return response.json();
                }).then(function (data) {
                    console.log(data);
                    displayWeatherDataInCurrentContainer(data, cityParamValue);
                });
            });

    };
    getWeatherData();
};

// UV Index Classification 

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
    var todayDate = " \(" + moment().format('L') + "\) ";
    var imageIcon = $('<img>');
    var imageURL = 'http://openweathermap.org/img/w/' + data.current.weather[0].icon + ".png"
    imageIcon.attr('src', imageURL);
    var citNameAndWeather = $('#cityNameTimeWeather');
    citNameAndWeather.text(city + todayDate);
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
    console.log(typeof (data.current.uvi));
}



// Create time scheduler on the fly at when initial page load finished. 
$(document).ready(function (event) {
    createAndRenderWeatherApp();
});

$('#search').on('click', function(event) {
    event.preventDefault();
    cityParamValue = $('#searchField').val();
    cityLatLongRequestURL = parentRequestUrl + cityLatLongRequestURI + cityParamName + cityParamValue + paramSeparator + apiKeyParamName + apiKey;
    weatherRequestURL = parentRequestUrl + weatherRequestURI;
    createAndRenderWeatherApp();
});