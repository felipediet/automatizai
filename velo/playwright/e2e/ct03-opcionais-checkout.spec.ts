import { test, expect } from '../support/fixtures'

test.describe('CT03 - Configurador (opcionais) + persistência no checkout', () => {
  test('deve somar opcionais no preço e persistir no /order', async ({ app, page }) => {
    // Arrange
    await app.configurator.open()
    await expect(page.getByRole('heading', { name: 'Velô Sprint' })).toBeVisible()

    // Estado inicial
    await app.configurator.assertTotalPrice('R$ 40.000,00')

    // Passo 1: Precision Park
    await app.configurator.toggleOptional(/Precision Park/i)
    await app.configurator.assertOptionalChecked(/Precision Park/i, true)
    await app.configurator.assertTotalPrice('R$ 45.500,00')

    // Passo 2: Flux Capacitor
    await app.configurator.toggleOptional(/Flux Capacitor/i)
    await app.configurator.assertOptionalChecked(/Flux Capacitor/i, true)
    await app.configurator.assertTotalPrice('R$ 50.500,00')

    // Passo 3: desmarcar e voltar ao base
    await app.configurator.toggleOptional(/Flux Capacitor/i)
    await app.configurator.assertOptionalChecked(/Flux Capacitor/i, false)
    await app.configurator.assertTotalPrice('R$ 45.500,00')

    await app.configurator.toggleOptional(/Precision Park/i)
    await app.configurator.assertOptionalChecked(/Precision Park/i, false)
    await app.configurator.assertTotalPrice('R$ 40.000,00')

    // Passo 4: ir para checkout e validar valores persistidos
    await app.configurator.assembleYourself()
    await expect(page).toHaveURL(/\/order$/)
      await app.checkOut.assertSummaryTotalPrice('R$ 40.000,00')
          await app.checkOut.clickVoltar()
          await expect(page).toHaveURL(/\/configure$/)

    // Passo 5: ir para checkout e validar valores persistidos somente do Precision Park
    await app.configurator.toggleOptional(/Precision Park/i)
    await app.configurator.assertOptionalChecked(/Precision Park/i, true)
    await app.configurator.assertTotalPrice('R$ 45.500,00')
    await app.configurator.assembleYourself()
      await expect(page).toHaveURL(/\/order$/)
      await app.checkOut.assertSummaryTotalPrice('R$ 45.500,00')
          await app.checkOut.clickVoltar()
          await expect(page).toHaveURL(/\/configure$/)
          await app.configurator.toggleOptional(/Precision Park/i)
          await app.configurator.assertOptionalChecked(/Precision Park/i, false)

    // Passo 6: ir para checkout e validar valores persistidos somente do Flux Capacitor
    await app.configurator.toggleOptional(/Flux Capacitor/i)
    await app.configurator.assertOptionalChecked(/Flux Capacitor/i, true)
    await app.configurator.assertTotalPrice('R$ 45.000,00')
    await app.configurator.assembleYourself()
      await expect(page).toHaveURL(/\/order$/)
      await app.checkOut.assertSummaryTotalPrice('R$ 45.000,00')
          await app.checkOut.clickVoltar()
          await expect(page).toHaveURL(/\/configure$/)
          await app.configurator.toggleOptional(/Flux Capacitor/i)
          await app.configurator.assertOptionalChecked(/Flux Capacitor/i, false)

    // Passo 7: Reaplicar opcionais para validar persistência com configuração completa
    await app.configurator.toggleOptional(/Precision Park/i)
    await app.configurator.toggleOptional(/Flux Capacitor/i)
    await app.configurator.assertTotalPrice('R$ 50.500,00')

    // Passo 8: ir para checkout e validar valores persistidos
    await app.configurator.assembleYourself()
    await expect(page).toHaveURL(/\/order$/)

    await app.checkOut.assertOnPage()
    await app.checkOut.assertSummaryTotalPrice('R$ 50.500,00')

  })
})

