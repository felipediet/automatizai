import { test, expect } from '@playwright/test'

test.describe('CT02 - Configuração do Veículo (Cores e Rodas) e Cálculo do Preço Base', () => {
  test('deve manter preço ao trocar cor e ajustar ao trocar rodas', async ({ page }) => {
    await page.goto('/')

    await page.getByTestId('hero-cta-primary').click()
    await expect(page).toHaveURL(/\/configure$/)

    const priceContainer = page.getByText('Preço de Venda').locator('..')

    await expect(priceContainer).toContainText('R$ 40.000,00')

    const midnight = page.getByRole('button', { name: /Midnight Black/i })
    const lunar = page.getByRole('button', { name: /Lunar White/i })

    if (await midnight.count()) {
      await midnight.first().click()
    } else if (await lunar.count()) {
      await lunar.first().click()
    } else {
      // Fallback: clicar na primeira opção de cor disponível
      await page.getByRole('heading', { name: 'Cor' }).locator('..').getByRole('button').first().click()
    }

    await expect(priceContainer).toContainText('R$ 40.000,00')

    await page.getByRole('button', { name: /Sport Wheels/i }).click()
    await expect(priceContainer).toContainText('R$ 42.000,00')

    await page.getByRole('button', { name: /Aero Wheels/i }).click()
    await expect(priceContainer).toContainText('R$ 40.000,00')
  })
})

