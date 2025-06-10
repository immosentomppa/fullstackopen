import axios from 'axios'
const baseUrl = '/api/notes'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request
    .then(response => response.data)
    .catch(error => {
        console.log('fail')
    })
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request
    .then(response => response.data)
    .catch(error => {
        console.log('fail')
    })
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request
    .then(response => response.data)
    .catch(error => {
        console.log('fail')
    })
}


export default { getAll, create, update }