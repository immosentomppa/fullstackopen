import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationType, setNotificationType] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort((a, b) => b.likes - a.likes))
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogListUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const createBlog = async newBlog => {

    await blogService.create(newBlog)
    const updatedBlogs = await blogService.getAll()
    setBlogs(updatedBlogs.sort((a, b) => b.likes - a.likes))
    setNotificationMessage(
      `a new blog ${newBlog.title} by ${newBlog.author} added`
    )
    setNotificationType('success')
    blogFormRef.current.toggleVisibility()
    setTimeout(() => {
      setNotificationMessage(null)
      setNotificationType(null)
    }, 3000)
  }

  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials)

      window.localStorage.setItem(
        'loggedBlogListUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
    } catch (exception) {
      setNotificationMessage(
        'wrong username or password'
      )
      setNotificationType('error')
      setTimeout(() => {
        setNotificationMessage(null)
        setNotificationType(null)
      }, 3000)
    }
  }

  const increaseBlogLikes = async (blog) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1
    }
    await blogService.update(blog.id, updatedBlog)
    const updatedBlogs = await blogService.getAll()
    setBlogs(updatedBlogs.sort((a, b) => b.likes - a.likes))
    setNotificationMessage(
      `blog ${blog.title} by ${blog.author} liked`
    )
    setNotificationType('success')
    setTimeout(() => {
      setNotificationMessage(null)
      setNotificationType(null)
    }, 3000)
  }

  const deleteBlog = async (blog) => {
    await blogService.deleteBlog(blog.id)
    const updatedBlogs = await blogService.getAll()
    setBlogs(updatedBlogs.sort((a, b) => b.likes - a.likes))
    setNotificationMessage(
      `blog ${blog.title} deleted`
    )
    setNotificationType('success')
    setTimeout(() => {
      setNotificationMessage(null)
      setNotificationType(null)
    }
    , 3000)
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogListUser')
    setUser(null)
  }

  return (
    <div>
      {user === null ?
        <>
          <h2>Log in to application</h2>
          <Notification message={notificationMessage} type={notificationType} />
            <LoginForm
              handleLogin={handleLogin}
            />
        </>:
        <>
          <h2>blogs</h2>
          <Notification message={notificationMessage} type={notificationType} />
          <span>{user.name} logged-in</span><button data-testid="logout-button" onClick={() => { handleLogout() }}>logout</button>
          <Togglable buttonLabel='create new' ref={blogFormRef}>
            <BlogForm
              createBlog={createBlog}
            />
          </Togglable>
          {blogs.map(blog =>
            <Blog
              key={blog.id}
              blog={blog}
              increaseBlogLikes={increaseBlogLikes}
              deleteBlog={deleteBlog}
            />
          )}
        </>
      }
    </div>
  )
}

export default App