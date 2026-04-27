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

    async open() {
      await page.goto('/configure')
    },

    async selectColor(colorName: string) {
      await page.getByRole('button', { name: colorName }).click()
    },

    async selectWheels(wheelsName: string | RegExp) {
      await page.getByRole('button', { name: wheelsName }).click()
    },

    async toggleOptional(optionalName: string | RegExp) {
      await page.getByRole('checkbox', { name: optionalName }).click()
    },

    async assertTotalPrice(price: string) {
      await expect(totalPrice).toBeVisible()
      await expect(totalPrice).toHaveText(price)
    },

    async assertPreviewSrc(src: string) {
      await expect(previewImageByAltPrefix).toHaveAttribute('src', src)
    },

    async assertPreviewAccessibleName(name: string | RegExp) {
      await expect(previewImageByAccessibleName).toHaveAccessibleName(name)
    },

    async assertColorButtonVisible(colorName: string) {
      await expect(page.getByRole('button', { name: colorName })).toBeVisible()
    },

    async assertWheelsButtonVisible(wheelsName: string | RegExp) {
      await expect(page.getByRole('button', { name: wheelsName })).toBeVisible()
    },

    async assertOptionalChecked(optionalName: string | RegExp, checked: boolean) {
      const checkbox = page.getByRole('checkbox', { name: optionalName })
      if (checked) {
        await expect(checkbox).toBeChecked()
        return
      }
      await expect(checkbox).not.toBeChecked()
    },

    async assertTextVisible(text: string) {
      await expect(page.getByText(text)).toBeVisible()
    },

    async assembleYourself() {
      await page.getByRole('button', { name: 'Monte o Seu' }).click()
    },

    
  }
}
