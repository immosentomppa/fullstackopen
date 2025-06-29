const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response, next) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

// 4.17, 4.19
blogsRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body

    if (!body.title || !body.url) {
      return response.status(400).json({ error: 'title and URL are required' })
    }
    if (!body.likes) {
      body.likes = 0
    }

    const user = request.user

    if (!user) {
      return response.status(401).json({ error: 'userId missing or not valid' })
    }

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(blog)
  }
  catch (error) {
    next(error)
  }
})

// 4.13
blogsRouter.delete('/:id', async (request, response, next) => {
  try {

    const blog = await Blog.findById(request.params.id)
    if (!blog) {
      return response.status(404).json({ error: 'blog not found' })
    }

    const user = request.user
    if (!user) {
      return response.status(400).json({ error: 'userId missing or not valid' })
    }

    if (blog.user && blog.user.toString() !== user.id) {
      return response.status(403).json({ error: 'only the creator can delete this blog' })
    }

    user.blogs = user.blogs.filter(b => b.toString() !== request.params.id)
    await user.save()

    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

// 4.14
blogsRouter.put('/:id', async (request, response, next) => {
  try {
    const { title, author, url, likes } = request.body
    let blog = await Blog.findById(request.params.id)
    if (!blog) {
      return response.status(404).end()
    }
    blog.title = title
    blog.author = author
    blog.url = url
    blog.likes = likes
    const updatedBlog = await blog.save()
    response.json(updatedBlog)
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter