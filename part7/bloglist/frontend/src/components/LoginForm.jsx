import { useState } from 'react'

const LoginForm = ({ handleLogin }) => {
  const handleSubmit = (event) => {
    event.preventDefault()
    handleLogin({
      username: username,
      password: password,
    })

    setUsername('')
    setPassword('')
  }
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  return (
    <form onSubmit={handleSubmit}>
      <div>
        username{' '}
        <input
          type="text"
          value={username}
          data-testid="username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password{' '}
        <input
          type="password"
          value={password}
          data-testid="password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button className="login-button" type="submit">
        login
      </button>
    </form>
  )
}

export default LoginForm
