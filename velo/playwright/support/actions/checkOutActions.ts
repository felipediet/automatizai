import { Page, expect } from '@playwright/test'

export function createCheckoutActions(page: Page) {
  return {
    async open() {
      await page.goto('/order')
      await this.expectLoaded()
    },

    async expectLoaded() {
      await expect(page.getByRole('heading', { name: 'Finalizar Pedido' })).toBeVisible()
    },

    async expectSummaryTotal(price: string) {
      await expect(page.getByTestId('summary-total-price')).toHaveText(price)
    },

    async submit() {
      await page.getByTestId('checkout-submit').click()
    },

    async disableHtml5Validation() {
      await page.locator('form').evaluate((form: HTMLFormElement) => form.setAttribute('novalidate', 'true'))
    },

    async fillPersonalData(data: { name: string, surname: string, email: string, phone: string, cpf: string, store: string }) {
      await page.getByTestId('checkout-name').fill(data.name)
      await page.getByTestId('checkout-surname').fill(data.surname)
      await page.getByTestId('checkout-email').fill(data.email)
      await page.getByTestId('checkout-phone').fill(data.phone)
      await page.getByTestId('checkout-cpf').fill(data.cpf)
      await page.getByTestId('checkout-store').click()
      await page.getByRole('option', { name: data.store }).click()
    },

    getFieldError(fieldLabel: string) {
      if (fieldLabel === 'Termos de Uso') {
        return page.locator('//label[@for="terms"]/following-sibling::p')
      }
      return page.locator(`//label[text()="${fieldLabel}"]/..//p`)
    }
  }
}
