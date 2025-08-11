import { RECOMMENDATIONS, USER_DETAILS } from "../queries"
import { useQuery } from "@apollo/client"

const Recommendations = ({ show, token }) => {
  const result = useQuery(RECOMMENDATIONS, {
    skip: !token,
  })

  const userDetails = useQuery(USER_DETAILS, {
    skip: !token,
  })

  if (result.loading) {
    return <div>loading...</div>
  }

  if (!show) {
    return null
  }

  return (
    <div>
      <h2>recommendations</h2>
      {userDetails.data && (
        <span>
          books in your favorite genre{" "}
          <b>{userDetails.data.me.favoriteGenre}</b>
        </span>
      )}
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {result.data.recommendations.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommendations
