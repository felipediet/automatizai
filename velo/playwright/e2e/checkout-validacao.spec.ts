import { test, expect } from '../support/fixtures'

const VALID_DATA = {
  name: 'Fernando',
  surname: 'Papito',
  email: 'papito@velo.dev',
  phone: '(11) 99999-9999',
  cpf: '780.228.290-05',
  store: 'Velô Paulista - Av. Paulista, 1000',
}

test.describe('CT04 - Checkout: Validação de Campos Obrigatórios e Dados Inválidos', () => {
  test.beforeEach(async ({ app }) => {
    await app.checkout.open()
  })

  test('deve exibir erros ao submeter formulário em branco', async ({ app }) => {
    await app.checkout.submit()

    await expect(app.checkout.getFieldError('Nome')).toBeVisible()
    await expect(app.checkout.getFieldError('Sobrenome')).toBeVisible()
    await expect(app.checkout.getFieldError('Email')).toBeVisible()
    await expect(app.checkout.getFieldError('Telefone')).toBeVisible()
    await expect(app.checkout.getFieldError('CPF')).toBeVisible()
    await expect(app.checkout.getFieldError('Loja para Retirada')).toBeVisible()
    await expect(app.checkout.getFieldError('Termos de Uso')).toBeVisible()
  })

  test('deve exibir erro quando Nome ou Sobrenome tiver menos de 2 caracteres', async ({ page, app }) => {
    await page.getByTestId('checkout-name').fill('A')
    await page.getByTestId('checkout-surname').fill('B')
    await app.checkout.submit()

    await expect(app.checkout.getFieldError('Nome').getByText('Nome deve ter pelo menos 2 caracteres')).toBeVisible()
    await expect(app.checkout.getFieldError('Sobrenome').getByText('Sobrenome deve ter pelo menos 2 caracteres')).toBeVisible()
  })

  test('deve exibir erro de Email inválido', async ({ app }) => {
    await app.checkout.disableHtml5Validation()
    await app.checkout.fillPersonalData({ ...VALID_DATA, email: 'clientemail' })
    await app.checkout.submit()

    await expect(app.checkout.getFieldError('Email').getByText('Email inválido')).toBeVisible()
  })

  test('deve exibir erro de CPF inválido quando não preenchido', async ({ app }) => {
    // Nota: react-input-mask completa o campo com '_' atingindo 14 chars se interagirmos
    // O teste valida o cenário do CPF deixado em branco e preenchemos o resto
    await app.checkout.fillPersonalData({ ...VALID_DATA, cpf: '' })
    await app.checkout.submit()

    await expect(app.checkout.getFieldError('CPF').getByText('CPF inválido')).toBeVisible()
  })

  test('deve exibir erro ao não aceitar os Termos de Uso', async ({ page, app }) => {
    await app.checkout.fillPersonalData(VALID_DATA)

    await expect(page.getByTestId('checkout-terms')).not.toBeChecked()
    await app.checkout.submit()

    await expect(app.checkout.getFieldError('Termos de Uso').getByText('Aceite os termos')).toBeVisible()
  })
})
