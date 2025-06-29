const lodash = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  return [blogs.reduce((max, blog) => (blog.likes > max.likes ? blog : max), blogs[0])]
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const countsByAuthor = lodash.countBy(blogs, 'author')
  const authors = lodash.map(countsByAuthor, (blogs, author) => ({ author, blogs }))

  return lodash.maxBy(authors, 'blogs')
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  const likesByAuthor = lodash.groupBy(blogs, 'author')
  const authors = lodash.map(likesByAuthor, (blogs, author) => ({
    author,
    likes: blogs.reduce((sum, blog) => sum + blog.likes, 0)
  }))
  return lodash.maxBy(authors, 'likes')
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}