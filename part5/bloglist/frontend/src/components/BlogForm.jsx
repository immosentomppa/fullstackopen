import { useState } from 'react'

const BlogForm = ({ createBlog }) => {

  const handleSubmit = (event) => {
    event.preventDefault()
    createBlog({
      title: blogTitle,
      author: blogAuthor,
      url: blogUrl
    })
    setBlogTitle('')
    setBlogAuthor('')
    setBlogUrl('')
  }

  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogUrl, setBlogUrl] = useState('')

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <div>title: <input data-testid="blog-title" name="title" value={blogTitle} onChange={({ target }) => setBlogTitle(target.value)} /></div>
        <div>author: <input data-testid="blog-author" name="author" value={blogAuthor} onChange={({ target }) => setBlogAuthor(target.value)}/></div>
        <div>url: <input data-testid="blog-url" name="url" value={blogUrl} onChange={({ target }) => setBlogUrl(target.value)}/></div>
        <button className="blog-submit" type="submit">create</button>
      </form>
    </>
  )
}

export default BlogForm