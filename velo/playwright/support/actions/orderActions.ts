import { expect, Page } from '@playwright/test'

export function createOrderActions(page: Page) {
  const summaryTotalPrice = page.getByTestId('summary-total-price')
  const heading = page.getByRole('heading', { name: 'Finalizar Pedido' })
  const voltar = page.getByRole('button').filter({ hasText: /^$/ })

  return {
    elements: {
      summaryTotalPrice,
      heading,
    },

    async open() {
      await page.goto('/order')
    },

    async assertOnPage() {
      await expect(heading).toBeVisible()
    },

    async assertSummaryTotalPrice(price: string) {
      await expect(summaryTotalPrice).toBeVisible()
      await expect(summaryTotalPrice).toHaveText(price)
    },

    async clickVoltar() {
      await voltar.click()
    }
  }
}

