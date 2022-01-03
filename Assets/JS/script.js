// Inital get request formation to get lat long for the searched city 
var paramSeparator = '&';
var apiKeyParamName = 'appid=';
var apiKey = 'fc7a00aa9baea8ce97290c366a750d22';
var parentRequestUrl = 'https://api.openweathermap.org/data/2.5/';
var cityLatLongRequestURI = 'weather?';
var cityParamName = 'q=';
var cityParamValue = 'berlin';

var cityLatLongRequestURL = parentRequestUrl + cityLatLongRequestURI + cityParamName + cityParamValue + paramSeparator + apiKeyParamName + apiKey;

var cityResponseLat = '';
var cityResponseLong = '';

// Second request formation to make call for weather data
var weatherRequestURI = 'onecall?';
var weatherRequestLatParamName = 'lat=';
var weatherRequestLongParamName = 'lon=';

var weatherRequestURL = parentRequestUrl + weatherRequestURI;

// Request to get weather data for initial load for last searched city 

function createAndRenderWeatherAppOnFirstLoad(event) {
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
                weatherRequestURL += weatherRequestLatParamName + cityResponseLat + paramSeparator + weatherRequestLongParamName + cityResponseLong + paramSeparator + apiKeyParamName + apiKey;
                console.log(weatherRequestURL);
                requestUrl = weatherRequestURL;
                fetch(requestUrl).then(function (response) {
                    return response.json();
                }).then(function (data) {
                    console.log(data);
                });
            });

    };
    getWeatherData();
};

// Create time scheduler on the fly at when initial page load finished. 
$(document).ready(function (event) {
    createAndRenderWeatherAppOnFirstLoad();
});