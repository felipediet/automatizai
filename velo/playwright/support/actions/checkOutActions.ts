import { Page, expect } from '@playwright/test'

export function createCheckoutActions(page: Page) {



  return {

    elements: {
      heading: page.getByRole('heading', { name: 'Finalizar Pedido' }),
      summaryTotalPrice: page.getByTestId('summary-total-price'),
      paymentCash: page.getByRole('button', { name: 'À Vista' }),
      paymentFinance: page.getByRole('button', { name: 'Financiamento' }),
      successHeading: page.getByRole('heading', { name: 'Pedido Aprovado!' }),
      submitButton: page.getByTestId('checkout-submit'),
      form: page.locator('form'),
      nameInput: page.getByTestId('checkout-name'),
      lastnameInput: page.getByTestId('checkout-lastname'),
      emailInput: page.getByTestId('checkout-email'),
      phoneInput: page.getByTestId('checkout-phone'),
      documentInput: page.getByTestId('checkout-document'),
      storeSelect: page.getByTestId('checkout-store'),
      terms: page.getByTestId('checkout-terms'),
      alerts: {
        name: page.getByTestId('error-name'),
        lastname: page.getByTestId('error-lastname'),
        email: page.getByTestId('error-email'),
        phone: page.getByTestId('error-phone'),
        document: page.getByTestId('error-document'),
        store: page.getByTestId('error-store'),
        terms: page.getByTestId('error-terms')
      }
    },
    
    async open() {
      await page.goto('/order')
      await this.expectLoaded()
    },

    async expectLoaded() {
      await expect(this.elements.heading).toBeVisible()
    },

    async expectSummaryTotal(price: string) {
      await expect(this.elements.summaryTotalPrice).toHaveText(price)
    },

    async submit() {
      await this.elements.submitButton.click()
    },

    async disableHtml5Validation() {
      await this.elements.form.evaluate((form: HTMLFormElement) => form.setAttribute('novalidate', 'true'))
    },

    async fillCustomerData(data: { name: string, lastname: string, email: string, phone: string, document: string, store: string }) {
      await this.elements.nameInput.fill(data.name)
      await this.elements.lastnameInput.fill(data.lastname)
      await this.elements.emailInput.fill(data.email)
      await this.elements.phoneInput.fill(data.phone)
      await this.elements.documentInput.fill(data.document)
      await this.elements.storeSelect.click()
      await page.getByRole('option', { name: data.store }).click()
    },

    getFieldError(fieldLabel: string) {
      const fieldMap: Record<string, any> = {
        'Nome': this.elements.alerts.name,
        'Sobrenome': this.elements.alerts.lastname,
        'Email': this.elements.alerts.email,
        'Telefone': this.elements.alerts.phone,
        'CPF': this.elements.alerts.document,
        'Loja para Retirada': this.elements.alerts.store,
        'Termos de Uso': this.elements.alerts.terms
      }
      return fieldMap[fieldLabel]
    },

    async selectStore(store: string) {
      await this.elements.storeSelect.click()
      await page.getByRole('option', { name: store }).click()
    },

    async acceptTerms() {
      await this.elements.terms.check()
    },

    async selectPaymentCash() {
      await this.elements.paymentCash.click()
    },

        async selectPaymentFinance() {
      await this.elements.paymentFinance.click()
    },

    async expectOrderApproved() {
      await expect(this.elements.successHeading).toBeVisible()
    }

    
  }
}

