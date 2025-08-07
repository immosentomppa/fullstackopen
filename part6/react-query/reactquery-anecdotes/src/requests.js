import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = async () => {
  return axios.get(baseUrl).then(res => res.data)
}
export const createAnecdote = async newAnecdote => {
  return axios.post(baseUrl, newAnecdote).then(res => res.data)
}

export const voteAnecdote = async updatedAnecdote => {
  return axios.put(`${baseUrl}/${updatedAnecdote.id}`, updatedAnecdote).then(res => res.data)
}