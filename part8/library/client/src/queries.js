import { gql } from "@apollo/client"

export const ALL_AUTHORS = gql`
  query getAllAuthors {
    allAuthors {
      name
      born
      bookCount
    }
  }
`

export const ALL_BOOKS = gql`
  query getAllBooks {
    allBooks {
      title
      published
      author {
        name
        born
        bookCount
      }
    }
  }
`

export const BOOKS_BY_GENRE = gql`
  query getBooksByGenre($genre: String!) {
    booksByGenre(genre: $genre) {
      title
      published
      author {
        name
      }
    }
  }
`

export const ALL_GENRES = gql`
  query getAllGenres {
    allGenres
  }
`

export const RECOMMENDATIONS = gql`
  query getRecommendations {
    recommendations {
      title
      published
      author {
        name
      }
    }
  }
`

export const USER_DETAILS = gql`
  query getUserDetails {
    me {
      username
      favoriteGenre
    }
  }
`

export const ADD_BOOK = gql`
  mutation addBook(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      title
      author {
        name
        born
        bookCount
      }
      published
      genres
    }
  }
`

export const EDIT_AUTHOR = gql`
  mutation editAuthor($name: String!, $born: Int!) {
    editAuthor(name: $name, setBornTo: $born) {
      name
      born
    }
  }
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`
