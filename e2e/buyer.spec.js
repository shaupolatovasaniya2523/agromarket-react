import { test, expect } from '@playwright/test';

const email = `e2e+${Date.now()}@agromarket.test`;
const password = 'E2e-Test-Password-123';

test.describe('AgroMarket E2E', () => {

  test('каталог загружается с сервера', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/АгроМаркет/i);

    await expect(
      page.getByTestId('product-card').first()
    ).toBeVisible();
  });


  test('прямая ссылка на внутреннюю страницу не даёт 404', async ({ page }) => {
    const response = await page.goto('/login');

    expect(response.status()).toBe(200);
  });


test('покупатель регистрируется, входит и оформляет заявку', async ({ page }) => {
    await page.goto('/');

    // Переключаем форму на регистрацию
    await page.getByRole('button', {
      name: /нет аккаунта\? регистрация/i,
    }).click();

    await page.getByLabel(/имя/i).fill('E2E Покупатель');

    await page.getByLabel(/e-?mail|почта/i).fill(email);

    await page.getByLabel(/пароль/i).first().fill(password);

    await page.getByRole('button', {
      name: /зарегистрироваться/i,
    }).click();

    // Проверяем авторизацию
    await expect(
      page.getByRole('button', { name: /выйти/i })
    ).toBeVisible();

    // Открываем каталог
    await page.goto('/');

    // Выбираем первый товар
    const product = page.getByTestId('product-card').first();

    await expect(product).toBeVisible();

    // Добавляем товар в заявку
    await product.getByRole('button', {
      name: /в заявку|добавить/i,
    }).click();

    // Переходим к оформлению заявки
    await page.getByRole('button', {
      name: /оформить заявку|моя заявка/i,
    }).click();

    // Проверяем успешное оформление
    await expect(
      page.getByText(/заявка успешно оформлена|заявка создана/i)
    ).toBeVisible();
  });


  test('гость не может открыть административную панель', async ({ page }) => {

    await page.goto('/admin');

    // Проверяем перенаправление на вход
    await expect(page).toHaveURL(/\/login/);

  });

});