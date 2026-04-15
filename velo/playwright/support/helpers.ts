import { Page } from '@playwright/test'

export function generateOrderCode(): string {
  const prefix = 'VLO-';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 7; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return prefix + code;
}


export async function searchOrder(page: Page, orderNumber: string): Promise<void> {
  await page.getByTestId('search-order-id').fill(orderNumber)
  await page.getByTestId('search-order-button').click()
}