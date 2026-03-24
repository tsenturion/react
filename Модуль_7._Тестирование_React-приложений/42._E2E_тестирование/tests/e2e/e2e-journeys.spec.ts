import { expect, test } from '@playwright/test';

test('route and auth journey keeps intended destination', async ({ page }) => {
  await page.goto('/route-journeys?screen=catalog');

  await page.getByRole('link', { name: 'Открыть защищённый релизный экран' }).click();
  await expect(page).toHaveURL(/\/auth\/login\?intent=/);

  await page.getByLabel('Имя в сессии').fill('Надежда QA');
  await page.getByLabel('Роль в сессии').selectOption('release-manager');
  await page.getByRole('button', { name: 'Войти и продолжить' }).click();

  await expect(page).toHaveURL(/\/workspace\/release$/);
  await expect(page.getByRole('status')).toContainText('Protected route reached');
});

test('form journey reaches review screen', async ({ page }) => {
  await page.goto('/form-journeys');

  await page.getByLabel('Название релизного сценария').fill('Release review route smoke');
  await page.getByLabel('Ответственный поток').fill('qa-core');
  await page
    .getByLabel('Примечание для review screen')
    .fill('Проверить переход на review route и видимую summary карточку.');
  await page.getByRole('button', { name: 'Отправить на review screen' }).click();

  await expect(page).toHaveURL(/\/submission-review$/);
  await expect(page.getByRole('status')).toContainText('Review screen готов');
  await expect(page.getByText('qa-core')).toBeVisible();
});

test('data journey recovers after retry', async ({ page }) => {
  await page.goto('/data-journeys');

  await page.getByLabel('Профиль очереди').selectOption('flaky');
  await page.getByRole('button', { name: 'Загрузить очередь' }).click();

  await expect(page.getByRole('alert')).toContainText(
    'Транспортный слой не подтвердил очередь с первой попытки.',
  );

  await page.getByRole('button', { name: 'Повторить загрузку' }).click();

  await expect(page.getByRole('status')).toContainText('Очередь восстановлена');
  await expect(page.getByText('Auth redirect regression pack')).toBeVisible();
});
