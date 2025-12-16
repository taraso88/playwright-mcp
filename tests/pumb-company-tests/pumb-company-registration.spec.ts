import { test, expect, Page } from '@playwright/test';

const COMPANY_URL = 'https://www.digital.pumb.ua/registration/company/choose';

test.describe('ПУМБ Реєстрація юридичної особи', () => {
  let page: Page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    page.setDefaultTimeout(30000);
  });

  test('TC_PUMB_CO_001: Відображення головної сторінки реєстрації юр. особи', async () => {
    await page.goto(COMPANY_URL);
    await page.waitForLoadState('networkidle');

    // Основний заголовок флоу (текст може бути в однині/множині, тому перевіряємо частину фрази)
    const mainTitle = page.getByText(/ВІДКРИВАЄМО РАХУНОК ДЛЯ ЮРИДИЧН/i);
    await expect(mainTitle).toBeVisible();

    // Підзаголовок / пояснення
    const subtitle = page.locator('text=Оберіть спосіб відкриття рахунку');
    await expect(subtitle).toBeVisible();
  });

  test('TC_PUMB_CO_002: Варіанти способу відкриття рахунку', async () => {
    await page.goto(COMPANY_URL);
    await page.waitForLoadState('networkidle');

    // Ліва картка: "Самостійно" (онлайн‑процес) — працюємо з усією лінк‑карткою
    const selfOption = page.getByRole('link', {
      name: /Самостійно[\s\S]*Онлайн-процес/i,
    });
    await expect(selfOption).toBeVisible();

    // Вимога для самостійного відкриття рахунку (усередині тієї ж картки)
    await expect(selfOption.getByText('Застосунок Дія', { exact: false })).toBeVisible();
    await expect(selfOption.getByText('ID-карткою', { exact: false })).toBeVisible();
    await expect(selfOption.getByText('закордонним паспортом', { exact: false })).toBeVisible();

    // Права картка: "З менеджером" (відеоверифікація)
    const managerOption = page.getByRole('link', {
      name: /З менеджером[\s\S]*Відеоверифікація/i,
    });
    await expect(managerOption).toBeVisible();

    // Вимоги для відкриття рахунку з менеджером (усередині правої картки)
    await expect(managerOption.getByText('Камера на телефоні', { exact: false })).toBeVisible();
    await expect(managerOption.getByText('Скан-копії документів', { exact: false })).toBeVisible();
    await expect(managerOption.getByText('Кваліфікований електронний підпис', { exact: false })).toBeVisible();
  });

  test('TC_PUMB_CO_006: Адаптивність сторінки для юр. осіб', async () => {
    const viewports = [
      { width: 1920, height: 1080, name: 'Desktop' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 375, height: 667, name: 'Mobile' },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(COMPANY_URL);
      await page.waitForLoadState('networkidle');

      const mainTitle = page.locator('text=ВІДКРИВАЄМО РАХУНОК ДЛЯ ЮРИДИЧНОЇ ОСОБИ');
      await expect(mainTitle).toBeVisible();

      const phoneNumber = page.locator('text=0 800 501 275');
      await expect(phoneNumber).toBeVisible();
    }
  });

  test('TC_PUMB_CO_007: Наявність кнопки "Повернутись"', async () => {
    await page.goto(COMPANY_URL);
    await page.waitForLoadState('networkidle');

    const backButton = page.locator('text=Повернутись');
    await expect(backButton).toBeVisible();
    await expect(backButton).toBeEnabled();
  });
});
