import { expect, test } from '@playwright/test';

test('component behavior journey', async ({ page }) => {
  await page.goto('/component-behavior');

  await expect(page.getByRole('button', { name: 'Сохранить сценарий' })).toBeDisabled();

  await page.getByLabel('Есть воспроизводимые шаги').check();
  await page.getByRole('button', { name: 'Сохранить сценарий' }).click();

  await expect(page.getByRole('status')).toContainText(
    'Сценарий сохранён для regression pack.',
  );
});

test('integration release journey', async ({ page }) => {
  await page.goto('/integration-workflow');

  await page.getByRole('radio', { name: 'critical' }).check();
  await page.getByRole('checkbox', { name: 'Сценарий зависит от сети' }).check();
  await page.getByRole('button', { name: 'integration' }).click();
  await page.getByRole('button', { name: 'e2e' }).click();
  await page.getByRole('button', { name: 'Подтвердить релиз' }).click();

  await expect(page.getByText(/Релиз подтверждён/i)).toBeVisible();
});
