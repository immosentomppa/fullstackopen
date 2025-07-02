const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')
describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'etunimi sukunimi',
        username: 'kayttajanimi',
        password: 'salainen'
      }
    })
    await request.post('/api/users', {
      data: {
        name: 'etunimi sukunimi',
        username: 'kayttajanimi2',
        password: 'salainen'
      }
    })
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByTestId('username')).toBeVisible()
    await expect(page.getByTestId('password')).toBeVisible()
    await expect(page.getByRole('button', {class: 'login-button' })).toBeVisible()
  })
  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'kayttajanimi', 'salainen')
      await expect(page.getByText('etunimi sukunimi logged-in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByTestId('username').fill("kayttajanimi")
      await page.getByTestId('password').fill("wrong")
      await page.getByRole('button', { name: 'login' }).click()

      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('wrong username or password')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

      await expect(page.getByText('etunimi sukunimi logged in')).not.toBeVisible()
    })
  })
  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.goto('/')
      await loginWith(page, 'kayttajanimi', 'salainen')
      await expect(page.getByText('etunimi sukunimi logged-in')).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'A blog created by playwright')
      await createBlog(page, 'Second blog created by playwright')
      await createBlog(page, 'Third blog created by playwright')
      await expect(page.getByTestId('blog-details').getByText('A blog created by playwright Playwright Author')).toBeVisible()
      await expect(page.getByTestId('blog-details').getByText('Second blog created by playwright Playwright Author')).toBeVisible()
      await expect(page.getByTestId('blog-details').getByText('Third blog created by playwright Playwright Author')).toBeVisible()
    })
    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'A blog created by playwright')
        await createBlog(page, 'Second blog created by playwright')
        await createBlog(page, 'Third blog created by playwright')
      })

      test('a blog can be liked when expanded', async ({ page }) => {
        const firstBlog = page.locator('.blog-details').first()

        await firstBlog.getByTestId('blog-expand').click()
        await firstBlog.locator('.blog-likes button').click()
        await expect(firstBlog.locator('.blog-likes')).toContainText('likes 1')

        await firstBlog.locator('.blog-likes button').click()
        await expect(firstBlog.locator('.blog-likes')).toContainText('likes 2')
      })

      test('a blog can be deleted by the creator', async ({ page }) => {
        const firstBlog = page.locator('.blog-details').first()
        const expandButton = firstBlog.getByTestId('blog-expand')
        await expandButton.click()
        
        const deleteButton = firstBlog.getByTestId('blog-remove')
        page.once('dialog', dialog => dialog.accept())
        await deleteButton.click()

        await page.getByTestId('blog-details').getByText('A blog created by playwright Playwright Author').waitFor({ state: 'hidden' })
        
        await expect(page.getByText('A blog created by playwright Playwright Author')).not.toBeVisible()
        await expect(page.getByText('Second blog created by playwright Playwright Author')).toBeVisible()
        await expect(page.getByText('Third blog created by playwright Playwright Author')).toBeVisible()
      })

      test('a blog cannot be deleted by another user', async ({ page }) => {
        page.getByTestId('logout-button').click()
        await page.getByTestId('username').waitFor({ state: 'visible' })
        await loginWith(page, 'kayttajanimi2', 'salainen')

        const firstBlog = page.getByTestId('blog-details').first()
        const expandButton = firstBlog.getByTestId('blog-expand')
        await expandButton.click()

        const deleteButton = firstBlog.getByTestId('blog-remove')
        await expect(deleteButton).toHaveCount(0)
      })
      test('blogs are ordered by likes', async ({ page }) => {
        const firstBlog = page.getByTestId('blog-details').getByText('A blog created by playwright').locator('..')
        const secondBlog = page.getByTestId('blog-details').getByText('Second blog created by playwright').locator('..')
        const thirdBlog = page.getByTestId('blog-details').getByText('Third blog created by playwright').locator('..')
        await firstBlog.getByTestId('blog-expand').click()
        await secondBlog.getByTestId('blog-expand').click()
        await thirdBlog.getByTestId('blog-expand').click()
        await expect(firstBlog.locator('.blog-likes')).toContainText('likes 0')
        await expect(secondBlog.locator('.blog-likes')).toContainText('likes 0')
        await expect(thirdBlog.locator('.blog-likes')).toContainText('likes 0')

        const firstLikeButton = firstBlog.locator('.blog-likes button')
        const secondLikeButton = secondBlog.locator('.blog-likes button')
        const thirdLikeButton = thirdBlog.locator('.blog-likes button')

        // wait for the blog's likes to be updated on each click
        const successDiv = page.locator('.success')
        await thirdLikeButton.click()
        await successDiv.waitFor({ state: 'visible' })
        await expect(successDiv).toContainText('liked')
        await successDiv.waitFor({ state: 'hidden' })

        await thirdLikeButton.click()
        await successDiv.waitFor({ state: 'visible' })
        await expect(successDiv).toContainText('liked')
        await successDiv.waitFor({ state: 'hidden' })
        
        await thirdLikeButton.click()
        await successDiv.waitFor({ state: 'visible' })
        await expect(successDiv).toContainText('liked')
        await successDiv.waitFor({ state: 'hidden' })

        await secondLikeButton.click()
        await successDiv.waitFor({ state: 'visible' })
        await expect(successDiv).toContainText('liked')
        await successDiv.waitFor({ state: 'hidden' })

        await secondLikeButton.click()
        await successDiv.waitFor({ state: 'visible' })
        await expect(successDiv).toContainText('liked')
        await successDiv.waitFor({ state: 'hidden' })
        
        await firstLikeButton.click()
        await successDiv.waitFor({ state: 'visible' })
        await expect(successDiv).toContainText('liked')
        await successDiv.waitFor({ state: 'hidden' })

        const blogs = await page.locator('.blog-details').all()
        expect(await blogs[0].textContent()).toContain('Third blog created by playwright')
        expect(await blogs[1].textContent()).toContain('Second blog created by playwright')
        expect(await blogs[2].textContent()).toContain('A blog created by playwright')
      })
    })
  })
})