const express = require('express')
const hbs = require('hbs');

const fs = require('fs');

const PORT = 4000;

const weather = require('./weather/weather');

var app = express()

/**
 * Registering middleware for static files
 */
app.use(express.static(__dirname + '/assets'))

/**
 * Registering Custom Middleware
 */
app.use((req, res, next) => {

    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;

    console.log(log);
    fs.appendFileSync('server.log', log);

    next();
    
})

/**
 * Registering the viewing engine
 */
app.set('view engine', 'hbs');

/**
 * Registering Partials
 */
hbs.registerPartials(__dirname + '/views/partials');

/**
 * Registering helper functions
 */
hbs.registerHelper('getCompanyName', () => {

    return 'Express Weather App';

})

hbs.registerHelper('getTagLine', () => {

    return 'A weather app in Express.js and Node.js';

})

app.get('/', (req, res) => {

    res.render('home.hbs');

})

app.get('/weather-data', (req, res) => {

    weather.setGeoCodeURL(req.query.location);

    var resultant = {};

    weather.getWeatherData((data) => {
        
        if(data.weatherData == undefined) {
            res.send({
                'status':500,
                'message': data
            });

        }
        else {

            resultant.currentWeather = {

                day: getDayName(new Date(data.weatherData.currentWeather.time * 1000).getDay()),
                address: data.weatherData.address,
                date: new Date(data.weatherData.currentWeather.time * 1000).getDate() +' '+ getMonthName(new Date(data.weatherData.currentWeather.time * 1000).getMonth()),
                maxTemp: data.weatherData.currentWeather.temperature,
                precipitation: data.weatherData.currentWeather.precipIntensity,
                windSpeed: data.weatherData.currentWeather.windSpeed,
                icon: data.weatherData.currentWeather.icon

            }

            // console.log(data.weatherData.dailyWeather.data);
            resultant.sevenDayForecast = {};
            counter = 1;
            for(info in data.weatherData.dailyWeather.data) {
                if(resultant.currentWeather.day != getDayName(new Date(data.weatherData.dailyWeather.data[info].time * 1000).getDay()) && data.weatherData.dailyWeather.data[info].time > data.weatherData.currentWeather.time) {

                    resultant.sevenDayForecast[counter] = {

                        icon: data.weatherData.dailyWeather.data[info].icon,
                        high: data.weatherData.dailyWeather.data[info].temperatureHigh,
                        low: data.weatherData.dailyWeather.data[info].temperatureLow,
                        date: new Date(data.weatherData.dailyWeather.data[info].time * 1000).getDate() +' '+ getMonthName(new Date(data.weatherData.dailyWeather.data[info].time * 1000).getMonth()),
                        day: getDayName(new Date(data.weatherData.dailyWeather.data[info].time * 1000).getDay())

                    }

                    counter++;

                }

            }
            console.log(resultant);
            res.send({
                'status':200,
                'message': resultant
            });

        }

    });

});

/**
 * Registering the port on which the app will listen
 */
app.listen(PORT, () => {

    console.log(`Listening to port: ${PORT}`)

})

var getDayName = (d) => {

    var weekday = new Array(7);
    weekday[0] =  "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

    return weekday[d];

}

var getMonthName = (d) => {

    var month = new Array(12);
    month[0] =  "Jan";
    month[1] = "Feb";
    month[2] = "Mar";
    month[3] = "Apr";
    month[4] = "May";
    month[5] = "Jun";
    month[6] = "July";
    month[7] = "Aug";
    month[8] = "Sept";
    month[9] = "Oct";
    month[10] = "Nov";
    month[11] = "Dec";

    return month[d];

}