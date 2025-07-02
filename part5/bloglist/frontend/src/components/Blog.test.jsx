import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let container
  const blog = {
    title: 'artificially rendered blog',
    author: 'John Doe',
    url: 'https://example.com',
    likes: 0,
  }
  beforeEach(() => {
    container = render(
      <Blog blog={blog} />
    ).container
  })

  test('render only blog title and author by default', () => {
    const title = screen.queryByText('artificially rendered blog')
    const author = screen.queryByText('John Doe')
    const url = screen.queryByText('https://example.com')
    expect(title).toBeDefined()
    expect(author).toBeDefined()
    expect(url).toBe(null)
  })

  test('render blog url and likes when view button is clicked', async () => {
    const user = userEvent.setup()
    const viewButton = container.querySelector('.blog-expand')
    await user.click(viewButton)
    const url = screen.queryByText('https://example.com')
    const likes = container.querySelector('.blog-likes')
    expect(url).toBeDefined()
    expect(likes).toHaveTextContent('likes 0')
  })

  test('if the like button is clicked twice, the event handler is called twice', async () => {
    const mockHandler = vi.fn()
    container = render(
      <Blog blog={blog} increaseBlogLikes={mockHandler} />
    ).container
    
    const user = userEvent.setup()
    const viewButton = container.querySelector('.blog-expand')
    await user.click(viewButton)
    const likeButton = container.querySelector('.blog-likes button')
    await user.click(likeButton)
    await user.click(likeButton)
    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})