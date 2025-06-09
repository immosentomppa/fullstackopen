import { useState, useEffect } from 'react'
import apiService from './services/api'
import Filter from './components/Filter'
import Countries from './components/Countries'
import Weather from './components/Weather'
const weather_api_key = import.meta.env.VITE_OPENWEATHER_KEY

function App() {

  // 2.18 - 2.20
  const [countries, setCountries] = useState([])
  const [countriesFilter, setCountriesFilter] = useState('')
  const [countriesToShow, setCountriesToShow] = useState([])
  const [weatherData, setWeatherData] = useState(null)

  useEffect(() => {
    apiService
      .getAll()
      .then(countries => {
        setCountries(countries)
        console.log('Countries fetched:', countries)
      })
  }, [])


  const handleCountriesFilterChange = (event) => {
    const countrySearch = event.target.value.toLowerCase()
    const matchingCountries = countries.filter(country => country.name.common.toLowerCase().includes(countrySearch))
    if (matchingCountries.length === 1) {
      apiService.
      getByName(matchingCountries[0].name.common)
        .then(countriesResponse => {
          setCountriesToShow([countriesResponse])
        })
      apiService
        .getWeather(matchingCountries[0].latlng[0], matchingCountries[0].latlng[1], weather_api_key)
        .then(weatherResponse => {
          setWeatherData(weatherResponse)
        })
    } else {
      apiService
        .getAll()
        .then(countriesResponse => {
          const matchingCountries = countriesResponse.filter(country => country.name.common.toLowerCase().includes(event.target.value))
          setCountriesToShow(matchingCountries)
          setWeatherData(null)
        })
    }
    setCountriesFilter(event.target.value)
  }

  const handleShowCountryClick = (countryName) => {
    apiService.
    getByName(countryName)
      .then(countriesResponse => {
        setCountriesToShow([countriesResponse])
        setCountriesFilter(countriesResponse.name.common)
      })
    apiService
      .getWeather(countriesToShow[0].latlng[0], countriesToShow[0].latlng[1], weather_api_key)
      .then(weatherResponse => {
        setWeatherData(weatherResponse)
      })
  }

  return (
    <div>
      <Filter 
        countriesFilter={countriesFilter}
        handleCountriesFilterChange={handleCountriesFilterChange}
      />
      <Countries
        countriesToShow={countriesToShow}
        handleShowCountryClick={handleShowCountryClick}
      />
      <Weather
        weatherData={weatherData} />
    </div>
  )
}

export default App
