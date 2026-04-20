import { test, expect } from '@playwright/test';

test.describe('CT02 - Configuração do veículo e cálculo de preço base', () => {
  test('deve manter preço ao trocar cor, somar com roda Sport e voltar com Aero', async ({ page }) => {
    await page.goto('/configure');

    const configuratorHeading = page.getByRole('heading', { name: 'Velô Sprint' });
    const previewImage = page.getByRole('img', {
      name: /Velô Sprint - .* with .* wheels/i,
    });

    await expect(configuratorHeading).toBeVisible();
    await expect(page.getByText('Preço de Venda')).toBeVisible();
    await expect(page.getByText('R$ 40.000,00')).toBeVisible();
    await expect(previewImage).toHaveAccessibleName(/glacier-blue with aero wheels/i);

    await page.getByRole('button', { name: 'Midnight Black' }).click();

    await expect(page.getByRole('button', { name: 'Midnight Black' })).toBeVisible();
    await expect(previewImage).toHaveAccessibleName(/midnight-black with aero wheels/i);
    await expect(page.getByText('R$ 40.000,00')).toBeVisible();

    await page.getByRole('button', { name: /Sport Wheels/i }).click();

    await expect(page.getByRole('button', { name: /Sport Wheels/i })).toBeVisible();
    await expect(previewImage).toHaveAccessibleName(/midnight-black with sport wheels/i);
    await expect(page.getByText('R$ 42.000,00')).toBeVisible();

    await page.getByRole('button', { name: /Aero Wheels/i }).click();

    await expect(page.getByRole('button', { name: /Aero Wheels/i })).toBeVisible();
    await expect(previewImage).toHaveAccessibleName(/midnight-black with aero wheels/i);
    await expect(page.getByText('R$ 40.000,00')).toBeVisible();
  });

  test('deve calcular preço cumulativo com Sport, Precision Park e Flux Capacitor', async ({ page }) => {
    await page.goto('/configure');

    const configuratorHeading = page.getByRole('heading', { name: 'Velô Sprint' });
    const previewImage = page.getByRole('img', {
      name: /Velô Sprint - .* with .* wheels/i,
    });

    await expect(configuratorHeading).toBeVisible();
    await expect(page.getByText('Preço de Venda')).toBeVisible();
    await expect(page.getByText('R$ 40.000,00')).toBeVisible();
    await expect(previewImage).toHaveAccessibleName(/with aero wheels/i);

    await page.getByRole('button', { name: /Sport Wheels/i }).click();

    await expect(page.getByRole('button', { name: /Sport Wheels/i })).toBeVisible();
    await expect(previewImage).toHaveAccessibleName(/with sport wheels/i);
    await expect(page.getByText('R$ 42.000,00')).toBeVisible();

    await page.getByRole('checkbox', { name: /Precision Park/i }).click();

    await expect(page.getByRole('checkbox', { name: /Precision Park/i })).toBeChecked();
    await expect(page.getByText('R$ 47.500,00')).toBeVisible();

    await page.getByRole('checkbox', { name: /Flux Capacitor/i }).click();

    await expect(page.getByRole('checkbox', { name: /Flux Capacitor/i })).toBeChecked();
    await expect(page.getByText('R$ 52.500,00')).toBeVisible();

    await page.getByRole('checkbox', { name: /Flux Capacitor/i }).click();

    await expect(page.getByRole('checkbox', { name: /Flux Capacitor/i })).not.toBeChecked();
    await expect(page.getByText('R$ 47.500,00')).toBeVisible();

    await page.getByRole('checkbox', { name: /Precision Park/i }).click();

    await expect(page.getByRole('checkbox', { name: /Precision Park/i })).not.toBeChecked();
    await expect(page.getByText('R$ 42.000,00')).toBeVisible();

    await page.getByRole('button', { name: /Aero Wheels/i }).click();

    await expect(page.getByRole('button', { name: /Aero Wheels/i })).toBeVisible();
    await expect(previewImage).toHaveAccessibleName(/with aero wheels/i);
    await expect(page.getByText('R$ 40.000,00')).toBeVisible();
  });
});