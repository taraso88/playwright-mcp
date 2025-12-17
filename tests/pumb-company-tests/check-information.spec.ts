import { test, expect } from '@playwright/test';

const PAGE_URL =
  'https://www.digital.pumb.ua/registration/company/choose/check-information';

test.describe('Крок "Ознайомтесь з інформацією"', () => {
  test('контент, чек-іконки та кнопки + опційний перехід на "Підготуйте необхідні дані"', async ({
    page,
  }) => {
    await page.goto(PAGE_URL);

    // Закриваємо cookies-банер, якщо є кнопка OK
    const cookieOk = page.getByRole('button', {
      name: /погодитись з використанням cookies|ок/i,
    });
    if (await cookieOk.isVisible().catch(() => false)) {
      await cookieOk.click();
    }

    // 1. Кнопки
    const backButton = page.getByRole('button', { name: /повернутись/i });
    const nextButton = page.getByRole('button', { name: /продовжити/i });

    await expect(backButton).toBeVisible();
    await expect(nextButton).toBeVisible();
    await expect(nextButton).toBeDisabled();

    // 2. Блок "Вимоги до компанії"
    const companyBox = page
      .locator('easy-entry-check-information-step .ctx.main')
      .filter({ hasText: 'Вимоги до компанії' });

    await expect(companyBox).toBeVisible();
    await expect(
      companyBox.getByText('Організаційно-правова форма господарювання:', {
        exact: false,
      }),
    ).toBeVisible();

    // 3. Блок "Засновники та КБВ"
    const foundersBox = page
      .locator('easy-entry-check-information-step .ctx.main')
      .filter({ hasText: 'Засновники та КБВ' });

    await expect(foundersBox).toBeVisible();
    await expect(
      foundersBox.getByText('Засновники та КБВ', { exact: false }),
    ).toBeVisible();

    // 4. Блок "Фінансові показники"
    const financialBox = page
      .locator('easy-entry-check-information-step .ctx.main')
      .filter({ hasText: 'Фінансові показники' });

    await expect(financialBox).toBeVisible();
    await expect(
      financialBox.getByText('Фінансові показники', { exact: false }),
    ).toBeVisible();

    // 5. Фінальний блок з попередженням і посиланнями
    const warningBox = page
      .locator('easy-entry-check-information-step')
      .getByText('Якщо ви не відповідаєте якомусь з пунктів', { exact: false });

    await expect(warningBox).toBeVisible();

    const branchLink = page.getByRole('link', {
      name: /відділенні Банку/i,
    });
    const videoLink = page.getByRole('link', {
      name: /відеоверифікацію/i,
    });

    await expect(branchLink).toBeVisible();
    await expect(branchLink).toHaveAttribute('href', /about\.pumb\.ua\/map#138/);

    await expect(videoLink).toBeVisible();
    await expect(videoLink).toHaveAttribute(
      'href',
      /registration\/manager\/set-phone/,
    );

    // 6. Скролимо донизу – кнопка як і раніше disabled
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(nextButton).toBeVisible();
    await expect(nextButton).toBeDisabled();

    // 7. Опційний перехід на prepare-data, якщо у флоу кнопка активується
    if (await nextButton.isEnabled()) {
      await Promise.all([
        page.waitForURL(/registration\/company\/choose\/prepare-data/),
        nextButton.click(),
      ]);
      await expect(page).toHaveURL(
        /registration\/company\/choose\/prepare-data/,
      );
    }
  });
});
