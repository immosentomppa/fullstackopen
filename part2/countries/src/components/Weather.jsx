const Weather = ({weatherData}) => {
    if (!weatherData) {
        return null
    }
    console.log(weatherData)
    return (
        <>
            <h2>Weather in {weatherData.name}</h2>
            <div>Temperature {weatherData.main.temp} Celsius</div>
            <img src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}/>
            <div>Wind {weatherData.wind.speed} m/s</div>
        </>
    )
}

export default Weather