import { test, expect } from '@playwright/test';

const PAGE_URL =
  'https://www.digital.pumb.ua/registration/company/choose/check-information';

test.describe('Крок "Ознайомтесь з інформацією"', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE_URL);

    // Закриваємо cookies-банер, якщо є кнопка OK
    const cookieOk = page.getByRole('button', {
      name: /погодитись з використанням cookies|ок/i,
    });
    if (await cookieOk.isVisible().catch(() => false)) {
      await cookieOk.click();
    }
  });

  test('кнопки "Повернутись" та "Продовжити" присутні та візуально коректні', async ({ page }) => {
    const backButton = page.getByRole('button', { name: /повернутись/i });
    const nextButton = page.getByRole('button', { name: /продовжити/i });

    await expect(backButton).toBeVisible();
    await expect(nextButton).toBeVisible();
    await expect(nextButton).toBeDisabled();
  });

  test('список вимог відображається з чек-іконками і текстами', async ({ page }) => {
    const requirementsBox = page
      .locator('easy-entry-check-information-step .ctx.main')
      .filter({ hasText: 'Вимоги до компанії' });

    await expect(requirementsBox).toBeVisible();

    const items = requirementsBox.locator('mill-icon[name="normal:check"]');
    await expect(items).toHaveCount(4);

    await expect(
      requirementsBox.getByText('Організаційно-правова форма господарювання:', {
        exact: false,
      }),
    ).toBeVisible();
  });

  test(
    'кнопка "Продовжити" залишається неактивною навіть після скролу',
    async ({ page }) => {
      const nextButton = page.getByRole('button', { name: /продовжити/i });

      // спочатку кнопка неактивна
      await expect(nextButton).toBeDisabled();

      // скролимо сторінку донизу – перевіряємо, що кнопка як і раніше видима і disabled
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await expect(nextButton).toBeVisible();
      await expect(nextButton).toBeDisabled();
    },
  );
});
