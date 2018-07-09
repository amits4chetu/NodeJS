$("input[type='submit']").click(function(e){

    e.preventDefault();

    var location = $('#location').val();
    
    if(location == '' || location == null) {

        swal("Error", "Please provide an address!", "error");

    }
    else {
        
        $.ajax({

            url: '/weather-data',
            data: {location:location},
            dataType:'JSON',

            beforeSend: function() {
                $('.loading').show();
            },

            success: function(data) {
                
                if(data.status == 500) {

                    swal("Error", data.message, "error");

                }
                else if (data.status == 200) {

                    $('#curr-day').text(data.message.currentWeather.day);
                    $('#curr-date').text(data.message.currentWeather.date);
                    $('#curr-temp').html(Math.round(parseFloat(data.message.currentWeather.maxTemp)) + '<sup>o</sup>F');
                    $('#curr-temp-icon').text("src", getIcon(data.message.currentWeather.icon));
                    $('.location').text(data.message.currentWeather.address);
                    $('#precip').html('<img src="images/icon-umberella.png" alt="">' + data.message.currentWeather.precipitation + '%');
                    $('#wind').html('<img src="images/icon-wind.png" alt="">' + data.message.currentWeather.windSpeed + 'km/h');

                    var counter = 1;

                    for(forecast in data.message.sevenDayForecast) {

                        $('.forecast.mini-'+forecast+' .forecast-header .day').text(data.message.sevenDayForecast[forecast].day);
                        $('.forecast.mini-'+forecast+' .forecast-content .degree').html(Math.round(parseFloat(data.message.sevenDayForecast[forecast].high)) + '<sup>o</sup>F');
                        $('.forecast.mini-'+forecast+' .forecast-content small').html(Math.round(parseFloat(data.message.sevenDayForecast[forecast].low)) + '<sup>o</sup>F');
                        $('.forecast.mini-'+forecast+' .forecast-content .forecast-icon img').attr("src", "images/icons/" + getIcon(data.message.sevenDayForecast[forecast].icon));

                    }

                    swal("Success", "Got the details!", "success");

                }

            },

            complete: function() {
                $('.loading').hide();
            }

        });

    }

});

function getIcon(icon) {

    if (icon == 'clear-day') {
        return 'icon-1.svg';
    }
    else if (icon == 'partly-cloudy-day' || icon == 'partly-cloudy-night') {
        return 'icon-3.svg';
    }
    else if (icon == 'cloudy'){
        return 'icon-5.svg';
    }
    else if (icon == 'rain') {
        return 'icon-12.svg';
    }

}