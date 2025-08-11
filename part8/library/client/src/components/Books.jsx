import { ALL_BOOKS, ALL_GENRES, BOOKS_BY_GENRE } from "../queries"
import { useState } from "react"
import { useQuery } from "@apollo/client"

const Books = ({ show }) => {
  const books = useQuery(ALL_BOOKS)
  const genres = useQuery(ALL_GENRES)

  const [selectedGenre, setSelectedGenre] = useState(null)

  const { data: booksByGenre, refetch } = useQuery(BOOKS_BY_GENRE, {
    variables: { genre: selectedGenre },
    skip: !selectedGenre,
  })
  if (books.loading) {
    return <div>loading...</div>
  }

  if (!show) {
    return null
  }

  const handleGenreClick = (genre) => {
    setSelectedGenre(genre)
    refetch({ genre })
  }

  return (
    <div>
      <h2>books</h2>
      {selectedGenre && (
        <span>
          in genre <b>{selectedGenre}</b>
        </span>
      )}
      {!selectedGenre && <b>in all genres</b>}
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {selectedGenre &&
            booksByGenre &&
            booksByGenre.booksByGenre.map((book) => (
              <tr key={book.title}>
                <td>{book.title}</td>
                <td>{book.author.name}</td>
                <td>{book.published}</td>
              </tr>
            ))}
          {!selectedGenre &&
            books.data.allBooks.map((a) => (
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            ))}
        </tbody>
      </table>
      {genres && (
        <div>
          {genres.data.allGenres.map((genre) => (
            <button key={genre} onClick={() => handleGenreClick(genre)}>
              {genre}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default Books
