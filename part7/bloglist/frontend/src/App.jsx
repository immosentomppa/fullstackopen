import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import { useDispatch } from 'react-redux'
import { setNotification } from './reducers/notificationReducer'

import './index.css'

const App = () => {
  // 7.9, 7.10
  const dispatch = useDispatch()
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService
      .getAll()
      .then((blogs) => setBlogs(blogs.sort((a, b) => b.likes - a.likes)))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogListUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const createBlog = async (newBlog) => {
    await blogService.create(newBlog)
    const updatedBlogs = await blogService.getAll()
    setBlogs(updatedBlogs.sort((a, b) => b.likes - a.likes))
    blogFormRef.current.toggleVisibility()
    dispatch(setNotification(`you created '${newBlog.title}'`, 'success', 5))
  }

  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials)

      window.localStorage.setItem('loggedBlogListUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
    } catch (exception) {
      dispatch(setNotification('wrong username or password', 'error', 5))
    }
  }

  const increaseBlogLikes = async (blog) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
    }
    await blogService.update(blog.id, updatedBlog)
    const updatedBlogs = await blogService.getAll()
    setBlogs(updatedBlogs.sort((a, b) => b.likes - a.likes))
    dispatch(
      setNotification(
        `blog ${blog.title} by ${blog.author} liked`,
        'success',
        5
      )
    )
  }

  const deleteBlog = async (blog) => {
    await blogService.deleteBlog(blog.id)
    const updatedBlogs = await blogService.getAll()
    setBlogs(updatedBlogs.sort((a, b) => b.likes - a.likes))
    dispatch(setNotification(`blog ${blog.title} deleted`, 'success', 5))
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogListUser')
    setUser(null)
  }

  return (
    <div>
      {user === null ? (
        <>
          <h2>Log in to application</h2>
          <Notification />
          <LoginForm handleLogin={handleLogin} />
        </>
      ) : (
        <>
          <h2>blogs</h2>
          <Notification />
          <span>{user.name} logged-in</span>
          <button
            data-testid="logout-button"
            onClick={() => {
              handleLogout()
            }}
          >
            logout
          </button>
          <Togglable buttonLabel="create new" ref={blogFormRef}>
            <BlogForm createBlog={createBlog} />
          </Togglable>
          {blogs.map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              increaseBlogLikes={increaseBlogLikes}
              deleteBlog={deleteBlog}
            />
          ))}
        </>
      )}
    </div>
  )
}

export default App
