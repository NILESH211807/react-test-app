import { test, expect } from '@playwright/test';

test('login', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    await page.getByRole('textbox', { name: 'Enter Email' }).click();
    await page.getByRole('textbox', { name: 'Enter Email' }).fill('user@gmail.com');
    await page.getByRole('textbox', { name: 'Enter Password' }).click();
    await page.getByRole('textbox', { name: 'Enter Password' }).fill('123456');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByRole('heading', { name: 'Login Success' })).toBeVisible();
})
