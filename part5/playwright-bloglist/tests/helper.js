const loginWith = async (page, username, password)  => {
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, content) => {
  await page.getByRole('button', { name: 'create new' }).click()
  await page.getByTestId('blog-title').fill(content)
  await page.getByTestId('blog-author').fill('Playwright Author')
  await page.getByTestId('blog-url').fill('http://playwright.example.com')
  await page.getByRole('button', { name: 'create' }).click()
  await page.getByTestId('blog-details').getByText(content).waitFor()
}

export { loginWith, createBlog }