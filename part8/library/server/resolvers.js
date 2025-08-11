const Author = require("./models/author")
const Book = require("./models/book")

const resolvers = {
  Query: {
    bookCount: async () => (await Book.find({})).length,
    authorCount: async () => (await Author.find({})).length,
    allBooks: async (root, args) => {
      let filter = {}

      if (args.genre) {
        filter.genres = { $in: [args.genre] }
      }

      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        if (!author) {
          return []
        }
        filter.author = author._id
      }
      return Book.find(filter).populate("author")
    },
    allAuthors: async (root, args) => {
      if (!args.name) {
        const authors = await Author.find({})
        return authors.map((author) => author.toJSON())
      }
      const author = await Author.findOne({ name: args.name })
      return Book.find({ author: author }).length
    },
    me: (root, args, context) => {
      return context.currentUser
    },
    allGenres: async () => {
      const books = await Book.find({})
      const genres = books.map((book) => book.genres).flat()
      return Array.from(new Set(genres))
    },
    booksByGenre: async (root, args) => {
      const books = await Book.find({ genres: { $in: [args.genre] } }).populate(
        "author"
      )
      return books
    },
    recommendations: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        })
      }
      const books = await Book.find({
        genres: { $in: [currentUser.favoriteGenre] },
      }).populate("author")
      return books
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        })
      }

      let author = await Author.findOne({ name: args.author })
      if (!author) {
        author = new Author({
          name: args.author,
          born: null,
        })
        try {
          await author.save()
        } catch (error) {
          throw new GraphQLError(`Author validation failed: ${error}`, {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.author,
              error,
            },
          })
        }
      }
      const book = new Book({ ...args, author: author._id })
      try {
        await book.save()
      } catch (error) {
        throw new GraphQLError(`Book validation failed: ${error}`, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.title,
            error,
          },
        })
      }

      return book.populate("author")
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        })
      }

      const author = await Author.find({ name: args.name })
      if (!author) {
        return null
      }
      const updatedAuthor = { ...author, born: args.setBornTo }
      return Author.findOneAndUpdate({ name: args.name }, updatedAuthor, {
        new: true,
      })
    },
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      })

      return user.save().catch((error) => {
        throw new GraphQLError(`Creating the user failed: ${error}`, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.username,
            error,
          },
        })
      })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== "secret") {
        throw new GraphQLError("wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
  },
  Author: {
    bookCount: async (root) => {
      return Book.countDocuments({ author: root._id })
    },
  },
}

module.exports = resolvers
