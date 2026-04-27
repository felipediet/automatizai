import { expect, Page } from '@playwright/test'

export function createConfiguratorActions(page: Page) {
  const totalPrice = page.getByTestId('total-price')
  const previewImageByAltPrefix = page.locator('img[alt^="Velô Sprint"]')
  const previewImageByAccessibleName = page.getByRole('img', {
    name: /Velô Sprint - .* with .* wheels/i,
  })

  return {
    elements: {
      totalPrice,
      previewImageByAltPrefix,
      previewImageByAccessibleName,
    },

    /**
     * Navega para a página do configurador
     */
    async open() {
      await page.goto('/configure')
    },

    /**
     * Seleciona uma opção de cor pelo nome
     * @param colorName - O nome da cor a ser selecionada
     */
    async selectColor(colorName: string) {
      await page.getByRole('button', { name: colorName }).click()
    },

    /**
     * Seleciona opção de rodas pelo nome ou padrão
     * @param wheelsName - O nome ou padrão regex das rodas a serem selecionadas
     */
    async selectWheels(wheelsName: string | RegExp) {
      await page.getByRole('button', { name: wheelsName }).click()
    },

    /**
     * Alterna um checkbox de recurso opcional
     * @param optionalName - O nome ou padrão regex do recurso opcional
     */
    async toggleOptional(optionalName: string | RegExp) {
      await page.getByRole('checkbox', { name: optionalName }).click()
    },

    /**
     * Verifica que o preço total é visível e corresponde ao valor esperado
     * @param price - O texto do preço esperado
     */
    async assertTotalPrice(price: string) {
      await expect(totalPrice).toBeVisible()
      await expect(totalPrice).toHaveText(price)
    },

    /**
     * Verifica que a imagem de visualização possui a origem esperada
     * @param src - A URL de origem da imagem esperada
     */
    async assertPreviewSrc(src: string) {
      await expect(previewImageByAltPrefix).toHaveAttribute('src', src)
    },

    /**
     * Verifica que a imagem de visualização possui o nome acessível esperado
     * @param name - O nome acessível esperado ou padrão regex
     */
    async assertPreviewAccessibleName(name: string | RegExp) {
      await expect(previewImageByAccessibleName).toHaveAccessibleName(name)
    },

    /**
     * Verifica que um botão de cor é visível
     * @param colorName - O nome do botão de cor
     */
    async assertColorButtonVisible(colorName: string) {
      await expect(page.getByRole('button', { name: colorName })).toBeVisible()
    },

    /**
     * Verifica que um botão de rodas é visível
     * @param wheelsName - O nome ou padrão regex do botão de rodas
     */
    async assertWheelsButtonVisible(wheelsName: string | RegExp) {
      await expect(page.getByRole('button', { name: wheelsName })).toBeVisible()
    },

    /**
     * Verifica se um checkbox de recurso opcional está marcado ou desmarcado
     * @param optionalName - O nome ou padrão regex do recurso opcional
     * @param checked - Se o checkbox deve estar marcado true para marcado ou false para desmarcado
     */
    async assertOptionalChecked(optionalName: string | RegExp, checked: boolean) {
      const checkbox = page.getByRole('checkbox', { name: optionalName })
      if (checked) {
        await expect(checkbox).toBeChecked()
        return
      }
      await expect(checkbox).not.toBeChecked()
    },

    /**
     * Verifica que um texto é visível na página
     * @param text - O texto a encontrar e verificar visibilidade
     */
    async assertTextVisible(text: string) {
      await expect(page.getByText(text)).toBeVisible()
    },

    /**
     * Clica no botão "Monte o Seu"
     */
    async assembleYourself() {
      await page.getByRole('button', { name: 'Monte o Seu' }).click()
    },


  }
}
