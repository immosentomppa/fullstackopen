import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { createSelector } from '@reduxjs/toolkit';
import { setNotification } from '../reducers/notificationReducer';

const AnecdoteList = () => {

  const dispatch = useDispatch()

  // use createSelector to avoid console warning about creating a new array every time
  const anecdotes = useSelector(createSelector(
    state => state.anecdotes,
    state => state.filter,
    (anecdotes, filter) => {
      let filtered = anecdotes
      if (filter) {
        filtered = anecdotes.filter(anecdote =>
          anecdote.content.toLowerCase().includes(filter.toLowerCase())
        ).sort((a, b) => b.votes - a.votes)
      }
      return [...filtered].sort((a, b) => b.votes - a.votes)
    }
  ))

  const vote = (anecdote) => {
    dispatch(voteAnecdote(anecdote))
    dispatch(setNotification(`you voted '${anecdote.content}'`, 10))
  }

  return (
    <div>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}
export default AnecdoteList