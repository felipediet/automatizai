import { test, expect } from '../support/fixtures'

test.describe('Configurador - Regras de preço dinâmico por cor, rodas e opcionais', () => {

  test.beforeEach(async ({ app }) => {
    await app.configurator.open()
  })
  
  test('deve manter R$ 40.000,00 ao trocar cor e atualizar apenas o preview', async ({ app }) => {
    await app.configurator.assertTotalPrice('R$ 40.000,00')

    await app.configurator.selectColor('Midnight Black')
    await app.configurator.assertTotalPrice('R$ 40.000,00')

    await app.configurator.assertPreviewSrc('/src/assets/midnight-black-aero-wheels.png')
  })


  test('deve somar + R$ 2.000,00 com Sport Wheels e voltar ao preço base com Aero Wheels', async ({ app }) => {
    await app.configurator.assertTotalPrice('R$ 40.000,00')

    await app.configurator.selectWheels(/Sport Wheels/)
    await app.configurator.assertTotalPrice('R$ 42.000,00')
    await app.configurator.assertPreviewSrc('/src/assets/glacier-blue-sport-wheels.png')

    await app.configurator.selectWheels(/Aero Wheels/)
    await app.configurator.assertTotalPrice('R$ 40.000,00')
    await app.configurator.assertPreviewSrc('/src/assets/glacier-blue-aero-wheels.png')
  })

  
  test('deve validar fluxo integrado: cor sem impacto no preço, Sport incrementa e Aero reverte', async ({ app, page }) => {
    await app.configurator.open()

    await expect(page.getByRole('heading', { name: 'Velô Sprint' })).toBeVisible()
    await app.configurator.assertTextVisible('Preço de Venda')
    await app.configurator.assertTextVisible('R$ 40.000,00')
    await app.configurator.assertPreviewAccessibleName(/glacier-blue with aero wheels/i)

    await app.configurator.selectColor('Midnight Black')

    await app.configurator.assertColorButtonVisible('Midnight Black')
    await app.configurator.assertPreviewAccessibleName(/midnight-black with aero wheels/i)
    await app.configurator.assertTextVisible('R$ 40.000,00')

    await app.configurator.selectWheels(/Sport Wheels/i)

    await app.configurator.assertWheelsButtonVisible(/Sport Wheels/i)
    await app.configurator.assertPreviewAccessibleName(/midnight-black with sport wheels/i)
    await app.configurator.assertTextVisible('R$ 42.000,00')

    await app.configurator.selectWheels(/Aero Wheels/i)

    await app.configurator.assertWheelsButtonVisible(/Aero Wheels/i)
    await app.configurator.assertPreviewAccessibleName(/midnight-black with aero wheels/i)
    await app.configurator.assertTextVisible('R$ 40.000,00')
  })


  test('deve calcular preço cumulativo até R$ 52.500,00 e reverter ao estado base', async ({ app, page }) => {
    await app.configurator.open()

    await expect(page.getByRole('heading', { name: 'Velô Sprint' })).toBeVisible()
    await app.configurator.assertTextVisible('Preço de Venda')
    await app.configurator.assertTextVisible('R$ 40.000,00')
    await app.configurator.assertPreviewAccessibleName(/with aero wheels/i)

    await app.configurator.selectWheels(/Sport Wheels/i)

    await app.configurator.assertWheelsButtonVisible(/Sport Wheels/i)
    await app.configurator.assertPreviewAccessibleName(/with sport wheels/i)
    await app.configurator.assertTextVisible('R$ 42.000,00')

    await app.configurator.toggleOptional(/Precision Park/i)

    await app.configurator.assertOptionalChecked(/Precision Park/i, true)
    await app.configurator.assertTextVisible('R$ 47.500,00')

    await app.configurator.toggleOptional(/Flux Capacitor/i)

    await app.configurator.assertOptionalChecked(/Flux Capacitor/i, true)
    await app.configurator.assertTextVisible('R$ 52.500,00')

    await app.configurator.toggleOptional(/Flux Capacitor/i)

    await app.configurator.assertOptionalChecked(/Flux Capacitor/i, false)
    await app.configurator.assertTextVisible('R$ 47.500,00')

    await app.configurator.toggleOptional(/Precision Park/i)

    await app.configurator.assertOptionalChecked(/Precision Park/i, false)
    await app.configurator.assertTextVisible('R$ 42.000,00')

    await app.configurator.selectWheels(/Aero Wheels/i)

    await app.configurator.assertWheelsButtonVisible(/Aero Wheels/i)
    await app.configurator.assertPreviewAccessibleName(/with aero wheels/i)
    await app.configurator.assertTextVisible('R$ 40.000,00')
  })
})