import { useState } from "react"
import { useQuery } from "@apollo/client"
import { ALL_AUTHORS } from "./queries"
import { useApolloClient } from "@apollo/client"

import Authors from "./components/Authors"
import Books from "./components/Books"
import NewBook from "./components/NewBook"
import LoginForm from "./components/LoginForm"
import Notify from "./components/Notify"
import Recommendations from "./components/Recommendations"

const App = () => {
  // 8.1 - 8.22 in library server+client
  const [page, setPage] = useState("authors")
  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(null)
  const authors = useQuery(ALL_AUTHORS)
  const client = useApolloClient()

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  if (authors.loading) {
    return <div>loading...</div>
  }

  return (
    <div>
      <div>
        <Notify errorMessage={errorMessage} />
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token && (
          <>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={() => setPage("recommendations")}>
              recommend
            </button>
            <button onClick={logout}>logout</button>
          </>
        )}
        {!token && <button onClick={() => setPage("login")}>login</button>}
      </div>
      <Notify errorMessage={errorMessage} />
      <Authors authors={authors} show={page === "authors"} />

      <Books show={page === "books"} />

      <NewBook show={page === "add"} />
      <LoginForm
        show={page === "login" && !token}
        setError={setErrorMessage}
        setToken={setToken}
        setPage={setPage}
      />
      <Recommendations show={page === "recommendations"} token={token} />
    </div>
  )
}

export default App
