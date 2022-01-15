const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date-day');
const dayname = document.getElementById('date-dayname');
const timezone = document.getElementById('location');


const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('ss');
const currentTempEl = document.getElementById('weather-container');
const currentWeatherItemsEl = document.getElementById('today-info');

const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const API_KEY = '744e3680ea2dcfc585347ccd0ec18f1e';

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 24 ? hour % 23 : hour
    const minutes = time.getMinutes();

    timeEl.innerHTML = (hoursIn12HrFormat < 10 ? '0' + hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (minutes < 10 ? '0' + minutes : minutes)

    dayname.innerHTML = days[day]

    dateEl.innerHTML = date + ' ' + months[month]

}, 1000);

getWeatherData()
function getWeatherData() {
    navigator.geolocation.getCurrentPosition((success) => {

        let { latitude, longitude } = success.coords;

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {
            console.log(data)
            showWeatherData(data);
        })
    })
}

function showWeatherData(data) {
    let { humidity, pressure, sunrise, sunset, wind_speed } = data.current;

    timezone.innerHTML = data.timezone;
    // countryEl.innerHTML = data.lat + 'N ' + data.lon + 'E';

    currentWeatherItemsEl.innerHTML =
        `
            <div class="precipitation">
                <span class="title">Precipitaciones</span>
                <span class="value">${pressure} %</span>
                <div class="clear"></div>
            </div>
            <div class="humidity">
                <span class="title">Humedad</span>
                <span class="value">${humidity} %</span>
                <div class="clear"></div>
            </div>
            <div class="wind">
                <span class="title">Viento</span>
                <span class="value">${wind_speed} km/h</span>
                <div class="clear"></div>
            </div>
        `;

    


        // <div class="weather-item">
        //         <div>Sunrise</div>
        //         <div>${window.moment(sunrise * 1000).format('HH:mm a')}</div>
        //     </div>
        //     <div class="weather-item">
        //         <div>Sunset</div>
        //         <div>${window.moment(sunset * 1000).format('HH:mm a')}</div>
        //     </div>

        moment.lang('es', {
            months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
            monthsShort: 'Enero._Feb._Mar_Abr._May_Jun_Jul._Ago_Sept._Oct._Nov._Dec.'.split('_'),
            weekdays: 'Domingo_Lunes_Martes_Miercoles_Jueves_Viernes_Sabado'.split('_'),
            weekdaysShort: 'Dom._Lun._Mar._Mier._Jue._Vier._Sab.'.split('_'),
            weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sa'.split('_')
        });
        
        let otherDayForcast = ''
        data.daily.forEach((day, idx) => {
            
            if (idx == 0) {
                currentTempEl.innerHTML = 
                `
                    <img src="http://openweathermap.org/img/wn//${day.weather[0].icon}@4x.png" alt="weather icon" class="weather-icon">
                    <h1 class="weather-temp">
                        ${day.temp.day}°C
                    </h1>
                    <h3 class="weather-desc">
                        ${day.temp.night}°C
                    </h3>
                `;
            } else if (idx == 1) {
                otherDayForcast = 
                `
                    <li class="active">
                        <img src="http://openweathermap.org/img/wn//${day.weather[0].icon}.png" alt="weather icon" class="weather-icon">
                        <span class="day-name">
                            ${window.moment(day.dt*1000).format('ddd')}
                        </span>
                        <span class="day-temp">${day.temp.day}°C</span>
                        <span class="night-temp">${day.temp.night}°C</span>
                    </li>
                `;
            } else {
                otherDayForcast += 
                `
                    <li>
                        <img src="http://openweathermap.org/img/wn//${day.weather[0].icon}.png" alt="weather icon" class="weather-icon">
                        <span class="day-name">
                            ${window.moment(day.dt*1000).format('ddd')}
                        </span>
                        <span class="day-temp">${day.temp.day}°C</span>
                        <span class="night-temp">${day.temp.night}°C</span>
                    </li>
                `
            }
        })
    weatherForecastEl.innerHTML = otherDayForcast;
}