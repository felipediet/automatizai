import { test, expect } from '@playwright/test';

test.describe('Configurador - Regras de preço dinâmico por cor, rodas e opcionais', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/configure');
  });
  
  test('deve manter R$ 40.000,00 ao trocar cor e atualizar apenas o preview', async ({ page }) => {

    const priceElement = page.getByTestId('total-price')
    const previewImage = page.locator('img[alt^="Velô Sprint"]');

    await expect(priceElement).toBeVisible();
    await expect(priceElement).toHaveText('R$ 40.000,00');

    await page.getByRole('button', { name: 'Midnight Black' }).click();
    await expect(priceElement).toHaveText('R$ 40.000,00');
  
    await expect(previewImage).toHaveAttribute('src', '/src/assets/midnight-black-aero-wheels.png');
  });


  test('deve somar +R$ 2.000,00 com Sport Wheels e voltar ao preço base com Aero Wheels', async ({ page }) => {

    const priceElement = page.getByTestId('total-price')
    const previewImage = page.locator('img[alt^="Velô Sprint"]');

    await expect(priceElement).toBeVisible();
    await expect(priceElement).toHaveText('R$ 40.000,00');

    await page.getByRole('button', { name: /Sport Wheels/ }).click();
    await expect(priceElement).toHaveText('R$ 42.000,00');
  
    await expect(previewImage).toHaveAttribute('src', '/src/assets/glacier-blue-sport-wheels.png');

    await page.getByRole('button', { name: /Aero Wheels/ }).click();
    await expect(priceElement).toHaveText('R$ 40.000,00');

    await expect(previewImage).toHaveAttribute('src', '/src/assets/glacier-blue-aero-wheels.png');
  });

  
  test('deve validar fluxo integrado: cor sem impacto no preço, Sport incrementa e Aero reverte', async ({ page }) => {
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


  test('deve calcular preço cumulativo até R$ 52.500,00 e reverter ao estado base', async ({ page }) => {
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