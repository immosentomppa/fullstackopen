import { useState } from 'react'


const Button = ({ onClick, text }) => (
  <button onClick={onClick}>
    {text}
  </button>
)
const StatisticLine = ({ text, value, showPercentage }) => {
  if (showPercentage) {
    return (
      <>
        <td>{text}</td><td>{value} %</td>
      </>
    )
  }
  return (
    <>
      <td>{text}</td><td>{value}</td>
    </>
  )
}


const Statistics = ({ good, neutral, bad }) => {
  return (
    <>
    <table>
      <tbody>
        <tr>
          <StatisticLine text="good" value={good} showPercentage={false} />
        </tr>
        <tr>
          <StatisticLine text="neutral" value={neutral} showPercentage={false} />
        </tr>
        <tr>
          <StatisticLine text="bad" value={bad} showPercentage={false} />
        </tr>
        <tr>
          <StatisticLine text="all" value={good+neutral+bad} showPercentage={false} />
        </tr>
        <tr>
          <StatisticLine text="average" value={(good*1+neutral*0+bad*(-1))/(good+neutral+bad)} showPercentage={false} />
        </tr>
        <tr>
          <StatisticLine text="positive" value={(good/(good+neutral+bad))*100} showPercentage={true} />
        </tr>
      </tbody>
    </table>
    </>
  )
}

const App = () => {
  // save clicks of each button to its own state
  // 1.6 - 1.11
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h2>give feedback</h2>
      <>
        <Button onClick={() => setGood(good + 1)} text='good'/>
        <Button onClick={() => setNeutral(neutral + 1)} text='neutral'/>
        <Button onClick={() => setBad(bad + 1)} text='bad'/>
      </>
      <h2>statistics</h2>
      <>
        <Statistics good={good} neutral={neutral} bad={bad}/>
      </>
    </div>
  )
}

export default App