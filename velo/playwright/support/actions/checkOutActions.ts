import { expect, Page } from '@playwright/test'

export function createCheckOutActions(page: Page) {
  const summaryTotalPrice = page.getByTestId('summary-total-price')
  const heading = page.getByRole('heading', { name: 'Finalizar Pedido' })
  const backButtonByTestId = page.getByTestId('order-back-button')
  const backButtonByRole = page.getByRole('button', { name: /voltar/i })

  return {
    elements: {
      summaryTotalPrice,
      heading,
      backButtonByTestId,
      backButtonByRole,
    },

    /**
     * Navega para a página de pedido
     */
    async open() {
      await page.goto('/order')
    },

    /**
     * Verifica se está na página de pedido validando a visibilidade do título
     */
    async assertOnPage() {
      await expect(page).toHaveURL(/\/order$/)
      await expect(heading).toBeVisible()
    },

    /**
     * Valida o preço total do resumo do pedido
     * @param price - O preço esperado a ser verificado
     */
    async assertSummaryTotalPrice(price: string) {
      await expect(summaryTotalPrice).toBeVisible()
      await expect(summaryTotalPrice).toHaveText(price)
    },

    /**
     * Clica no botão voltar para retornar à página anterior
     */
    async clickVoltar() {
      if (await backButtonByTestId.count()) {
        await backButtonByTestId.first().click()
        return
      }
      await backButtonByRole.click()
    }
  }
}

