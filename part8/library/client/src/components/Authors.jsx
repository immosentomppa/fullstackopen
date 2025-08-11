import { useMutation } from "@apollo/client"
import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries"
import { useState } from "react"
import Select from "react-select"

const Authors = ({ authors, show }) => {
  const authorOptions = authors.data.allAuthors.map((author) => ({
    value: author.name,
    label: author.name,
  }))
  const [selectedAuthor, setSelectedAuthor] = useState(authorOptions[0])
  const [born, setBorn] = useState("")

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {},
  })

  const updateBirthYear = (event) => {
    event.preventDefault()

    editAuthor({
      variables: { name: selectedAuthor.value, born: Number(born) },
    })

    setBorn("")
  }

  if (!show) {
    return null
  }

  return (
    <div>
      <div>
        <h2>authors</h2>
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>born</th>
              <th>books</th>
            </tr>
            {authors.data.allAuthors.map((a) => (
              <tr key={a.name}>
                <td>{a.name}</td>
                <td>{a.born}</td>
                <td>{a.bookCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h2>Set birthyear</h2>
        <form onSubmit={updateBirthYear}>
          <div>
            <Select
              defaultValue={selectedAuthor}
              onChange={setSelectedAuthor}
              options={authorOptions}
            />
          </div>
          <div>
            born{" "}
            <input
              type="number"
              value={born}
              onChange={({ target }) => setBorn(target.value)}
            />
          </div>
          <button type="submit">update author</button>
        </form>
      </div>
    </div>
  )
}

export default Authors
