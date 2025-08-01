import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api'

const getAll = () => {
    const request = axios.get(`${baseUrl}/all`)
    return request
    .then(response => response.data)
}

const getByName = (name) => {
    const request = axios.get(`${baseUrl}/name/${name}`)
    return request
    .then(response => response.data)
}

const getWeather = (lat, lon, api_key) => {
    const request = axios.get(`https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`)
    return request
    .then(response => response.data)
}


export default { getAll, getByName, getWeather }