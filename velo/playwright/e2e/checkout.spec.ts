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
  test.beforeEach(async ({ app }) => {
    await app.checkout.open()
  })

  test.describe('Validações de Campos Obrigatórios', () => {
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


})
