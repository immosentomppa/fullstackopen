const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')

const Blog = require('../models/blog');
const User = require('../models/user')

const api = supertest(app)


// 4.8
describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })
  test('correct amount of blogs are returned as JSON', async () => {
    console.log('entered test')
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    console.log('response body:', response.body)
    assert.strictEqual(response.body.length, helper.initialBlogs.length)

  })

// 4.9
  test('blogs have an id field instead of _id', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    response.body.forEach(blog => {
      assert.ok(blog.id, 'Blog does not have an id field')
      assert.strictEqual(typeof blog.id, 'string', 'id is not a string')
      assert.strictEqual(typeof blog._id, 'undefined', '_id should not be present')
    })
  })
})

describe('when a blog is added', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})

    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('salainen', 10)
    const user = new User({ username: 'root', passwordHash })
    await user.save()
    await helper.insertBlogsToDb(user)
  })
  // 4.10, 4.23
  test('it is added if valid, the total number is increased, and the new blog is found', async () => {
    const newBlog = {
        title: "New Blog",
        author: "New Author",
        url: "http://example.com",
        likes: 2,
    }

    const usersAtStart = await helper.usersInDb()
    const user = usersAtStart[0]
    const jwtToken = helper.createJwtToken(user)

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const contents = blogsAtEnd.map(n => n.title)
    assert(contents.includes('New Blog'))
  })

  // 4.11, 4.23
  test('amount of likes defaults to 0 if not defined', async () => {
    const newBlog = {
        title: "New Blog Without Likes",
        author: "New Author2",
        url: "http://example.com",
    }

    const usersAtStart = await helper.usersInDb()
    const user = usersAtStart[0]
    const jwtToken = helper.createJwtToken(user)

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const contents = blogsAtEnd.find(n => n.title === 'New Blog Without Likes')
    assert(contents.likes === 0)
  })

  // 4.12
  test('backend responds with 400 if title or URL is missing', async () => {
    const newBlogWithoutTitle = {
        author: "New Author2",
        url: "http://example.com",
        likes: 0
    }
    const newBlougWithoutUrl = {
      title: "New Blog Without URL",
      author: "New Author2",
      likes: 0
    }

    await api
      .post('/api/blogs')
      .send(newBlogWithoutTitle)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    await api
      .post('/api/blogs')
      .send(newBlougWithoutUrl)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })
})


describe('a single blog can be successsfully', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('salainen', 10)
    const user = new User({ username: 'root', passwordHash: passwordHash })
    await user.save()

    const secondPasswordHash = await bcrypt.hash('salainen', 10)
    const secondUser = new User({ username: 'normal', passwordHash: secondPasswordHash })
    await secondUser.save()

    await Blog.deleteMany({})
    await helper.insertBlogsToDb(user)
  })

  // 4.13, 4.23
  test('deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    const usersAtStart = await helper.usersInDb()
    const blogCreator = usersAtStart[0]

    const jwtToken = helper.createJwtToken(blogCreator)

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

    const contents = blogsAtEnd.map(n => n.title)
    assert(!contents.includes(blogToDelete.title))
  })

  // 4.14
  test('updated', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    blogToUpdate.likes = 42
    blogToUpdate.title = "Updated Title"
    blogToUpdate.author = "Updated Author"
    blogToUpdate.url = "http://updated-url.com"

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const contents = blogsAtEnd.map(n => n.title)
    assert(contents.includes(blogToUpdate.title))
  })
})

describe('on user creation', () => {
  // 4.16
  test('error is given if the user is invalid', async () => {
    const invalidUser = {
      username: "us",
      name: "Invalid User",
      password: "pw"
    }

    await api
      .post(`/api/users`)
      .send(invalidUser)
      .expect(400)
    const usersAtEnd = await helper.usersInDb()
    const usernames = usersAtEnd.map(u => u.username)
    assert(!usernames.includes(invalidUser.username))
  })
})

test('creating a new blog fails with status code 401 if token is not provided', async () => {
  const newBlog = {
    title: "unauthorized blog",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
    .expect('Content-Type', /application\/json/)
  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  const contents = blogsAtEnd.map(n => n.title)
  assert(!contents.includes(newBlog.title))
})
    

after(async () => {
  await mongoose.connection.close()
})