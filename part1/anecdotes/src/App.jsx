import { useState } from 'react'

const Button = ({ onClick, text }) => (
  <button onClick={onClick}>
    {text}
  </button>
)
const MostVotesAnecdote = ({ anecdotes, points }) => {
  const maxPoints = Math.max(...points)
  const index = points.indexOf(maxPoints)
  return (
    <>
      <p>{anecdotes[index]}</p>
      <p>has {maxPoints} votes</p>
    </>
  )
}
const Votes = ({ amount }) => (
  <div>
    has {amount} votes
  </div>
)

const App = () => {
  // 1.12 - 1.14
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const points = new Array(anecdotes.length).fill(0)
  const [currentPoints, setCurrentPoints] = useState(points)
  const currentPointsCopy = [...currentPoints]
  currentPointsCopy[selected] += 1

  return (
    <div>
      <h2>Anecdote of the day</h2>
      {anecdotes[selected]}
      <div>
        <Votes amount={currentPoints[selected]} />
        <Button onClick={() => setCurrentPoints([...currentPointsCopy])} text="vote" />
        <Button onClick={() => setSelected(Math.floor(Math.random() * anecdotes.length))} text="next anecdote" />
        <h2>Anecdote with most votes</h2>
        <MostVotesAnecdote anecdotes={anecdotes} points={currentPoints} />
      </div>
    </div>
  )
}

export default App
