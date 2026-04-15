import { Page } from '@playwright/test'

export class OrderLookupPage {

    constructor(private page: Page) {}

    async searchOrder(orderNumber: string): Promise<void> {
        await this.page.getByTestId('search-order-id').fill(orderNumber)
        await this.page.getByTestId('search-order-button').click()
    }
}