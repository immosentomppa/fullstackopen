import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer';

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const createNew = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    dispatch(createAnecdote(content))
    dispatch(setNotification(`you created '${content}'`, 10))
  }

  return (
    <form onSubmit={createNew}>
      <div><input name="anecdote" /></div>
      <button>create</button>
    </form>
  )
}
export default AnecdoteForm