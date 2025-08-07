import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<Blog />', () => {
  test('correct details are received when creating a new blog', async () => {
    const mockHandler = vi.fn()
    const container = render(<BlogForm createBlog={mockHandler} />).container
    screen.debug()
    const blogTitle = container.querySelector('input[name="title"]')
    const blogAuthor = container.querySelector('input[name="author"]')
    const blogUrl = container.querySelector('input[name="url"]')
    const submitButton = container.querySelector('.blog-submit')

    await userEvent.type(blogTitle, 'Test Blog Title')
    await userEvent.type(blogAuthor, 'Test Author')
    await userEvent.type(blogUrl, 'https://testblog.com')
    await userEvent.click(submitButton)
    expect(mockHandler.mock.calls).toHaveLength(1)
    expect(mockHandler.mock.calls[0][0].title).toBe('Test Blog Title')
    expect(mockHandler.mock.calls[0][0].author).toBe('Test Author')
    expect(mockHandler.mock.calls[0][0].url).toBe('https://testblog.com')
  })
})
