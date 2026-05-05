import { deleteOrderByCPFDocument, deleteOrderByNumber } from '../support/database/orderRepository'
import { test, expect } from '../support/fixtures'

const VALID_DATA = {
  name: 'Fernando',
  lastname: 'Papito',
  email: 'papito@velo.dev',
  phone: '(11) 99999-9999',
  document: '780.228.290-05',
  store: 'Velô Paulista - Av. Paulista, 1000',
}

test.describe('Checkout', () => {


  test.describe('Validações de Campos Obrigatórios', () => {

    test.beforeEach(async ({ app }) => {
      await app.checkout.open()
    })


    test('deve exibir erros ao submeter formulário em branco', async ({ app }) => {
      await app.checkout.submit()

      await expect(app.checkout.elements.alerts.name).toBeVisible()
      await expect(app.checkout.elements.alerts.lastname).toBeVisible()
      await expect(app.checkout.elements.alerts.email).toBeVisible()
      await expect(app.checkout.elements.alerts.phone).toBeVisible()
      await expect(app.checkout.elements.alerts.document).toBeVisible()
      await expect(app.checkout.elements.alerts.store).toBeVisible()
      await expect(app.checkout.elements.alerts.terms).toBeVisible()
    })

    test('deve exibir erro quando Nome ou Sobrenome tiver menos de 2 caracteres', async ({ app }) => {
      const DATA = {
        name: 'F',
        lastname: 'P',
        email: 'papito@velo.dev',
        phone: '(11) 99999-9999',
        document: '780.228.290-05',
        store: 'Velô Paulista - Av. Paulista, 1000',
      }
      
      await app.checkout.fillCustomerData({ ...DATA, name: 'F', lastname: 'P' })
      await app.checkout.acceptTerms()

      await app.checkout.submit()

      await expect(app.checkout.elements.alerts.name).toHaveText('Nome deve ter pelo menos 2 caracteres')
      await expect(app.checkout.elements.alerts.lastname).toHaveText('Sobrenome deve ter pelo menos 2 caracteres')
    })

    test('deve exibir erro de Email inválido', async ({ app }) => {
      await app.checkout.disableHtml5Validation()
      await app.checkout.fillCustomerData({ ...VALID_DATA, email: 'clientemail' })
      await app.checkout.acceptTerms()
      await app.checkout.submit()

      await expect(app.checkout.elements.alerts.email).toHaveText('Email inválido')
    })

    test('deve exibir erro de CPF inválido quando não preenchido', async ({ app }) => {
      // Nota: react-input-mask completa o campo com '_' atingindo 14 chars se interagirmos
      // O teste valida o cenário do CPF deixado em branco e preenchemos o resto
      await app.checkout.fillCustomerData({ ...VALID_DATA, document: '' })
      await app.checkout.acceptTerms()
      await app.checkout.submit()

      await expect(app.checkout.elements.alerts.document).toHaveText('CPF inválido')
    })

    test('deve exibir erro ao não aceitar os Termos de Uso', async ({ app }) => {
      await app.checkout.fillCustomerData(VALID_DATA)

      await expect(app.checkout.elements.terms).not.toBeChecked()
      await app.checkout.submit()

      await expect(app.checkout.elements.alerts.terms).toHaveText('Aceite os termos')
    })

  })

  test.describe('Pagamento e confirmação', () => {

    test('deve criar um pedido com sucesso para pagamento à vista', async ({ page, app }) => {
      const CHECKOUT_CASH_DATA = {
        name: 'Bruce',
        lastname: 'Wayne',
        email: 'bruce.wayne@waynecorp.com',
        phone: '(11) 97777-6666',
        document: '780.228.290-05',
        store: 'Velô Paulista - Av. Paulista, 1000',
        totalPrice: 'R$ 40.000,00',
        color: 'Glacier Blue',
        wheels: 'Aero Wheels'
      }

      // Cleanup - API
      await deleteOrderByCPFDocument(CHECKOUT_CASH_DATA.document)

      // Arrange - Landing Page
      await page.goto('/')
      await page.getByRole('link', { name: 'Configure Agora' }).click()

      // Arrange - Configurator
      await app.configurator.selectColor(CHECKOUT_CASH_DATA.color)
      await app.configurator.selectWheels(CHECKOUT_CASH_DATA.wheels)
      await app.configurator.expectPrice(CHECKOUT_CASH_DATA.totalPrice)
      await app.configurator.finishConfigurator()

      // Act - Checkout
      await app.checkout.expectLoaded()
      await app.checkout.fillCustomerData(CHECKOUT_CASH_DATA)
      await app.checkout.selectPaymentCash()
      
      await app.checkout.expectSummaryTotal(CHECKOUT_CASH_DATA.totalPrice)
      await expect(app.checkout.elements.paymentCash).toContainText(CHECKOUT_CASH_DATA.totalPrice)
      await app.checkout.acceptTerms()
      await app.checkout.submit()

      // Assert
      await app.checkout.expectOrderApproved()

      // Cleanup - API
      const orderNumber = await page.getByTestId('order-id').innerText()
        console.log(`Order number for cleanup: ${orderNumber}`)
      await deleteOrderByNumber(orderNumber)
    })

  })

})