import { useState } from 'react'
const Blog = ({ blog, increaseBlogLikes, deleteBlog }) => {
  const [blogDetailsVisible, setBlogDetailsVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const spanStyle = {
    display: 'block',
  }

  const handleBlogLike = () => {
    increaseBlogLikes(blog)
  }

  const handleBlogDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      deleteBlog(blog)
    }
  }

  const isBlogDetailsVisible = () => {
    return blogDetailsVisible
  }

  const expandBlogDetails = () => {
    setBlogDetailsVisible(!blogDetailsVisible)
  }

  const isBlogCreator = () => {
    return (
      blog.user &&
      blog.user.username ===
        JSON.parse(window.localStorage.getItem('loggedBlogListUser')).username
    )
  }

  return (
    <>
      {!isBlogDetailsVisible() && (
        <div data-testid="blog-details" className="blog-details">
          <span>
            {blog.title} {blog.author}
          </span>
          <button
            type="button"
            data-testid="blog-expand"
            className="blog-expand"
            onClick={expandBlogDetails}
          >
            view
          </button>
        </div>
      )}
      {isBlogDetailsVisible() && (
        <div
          data-testid="blog-details"
          className="blog-details"
          style={blogStyle}
        >
          <span style={spanStyle}>
            {blog.title}
            <button type="button" onClick={expandBlogDetails}>
              hide
            </button>
          </span>
          <span style={spanStyle}>{blog.url}</span>
          <span style={spanStyle} className="blog-likes">
            likes {blog.likes}{' '}
            <button type="button" onClick={handleBlogLike}>
              like
            </button>
          </span>
          <span style={spanStyle}>{blog.user ? blog.user.name : ''}</span>
          {isBlogCreator() && (
            <button
              data-testid="blog-remove"
              type="button"
              onClick={handleBlogDelete}
            >
              remove
            </button>
          )}
        </div>
      )}
    </>
  )
}

export default Blog
