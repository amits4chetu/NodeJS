const axios = require('axios');

const KEY = '6a0ead4bce35c8f7842d5eb3d22af956';

var GEO_CODE_URL = ''

module.exports.setGeoCodeURL = (address) => {
    address = encodeURIComponent(address);
    GEO_CODE_URL = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}`;

}

module.exports.getWeatherData = (callback) => {

    axios.get(GEO_CODE_URL).then((response) => {

        if(response.data.status === 'ZERO_RESULTS') {

            callback('Unable to get the coordinates!');
    
        }

        address = response.data.results[0].formatted_address,
        lat = response.data.results[0].geometry.location.lat,
        lng = response.data.results[0].geometry.location.lng
        
        var forecastAPIURL = `https://api.darksky.net/forecast/${KEY}/${lat},${lng}`

        axios.get(forecastAPIURL).then((response) => {
        
            var currentWeather  = response.data.currently;
            var dailyWeather = response.data.daily;
            callback({
                weatherData : {
                    address,
                    currentWeather,
                    dailyWeather
                }
                    });
    
        }).catch((errorMessage) => {

            if(errorMessage.errno === "ENOTFOUND") {
        
                callback('Could not connect to the google servers...');
        
            }
            else {
        
                callback(errorMessage.message);
        
            }
        
        })

    });

}