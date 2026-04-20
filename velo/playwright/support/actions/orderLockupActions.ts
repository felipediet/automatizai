import { expect, Page } from '@playwright/test'

export type OrderStatus = 'APROVADO' | 'REPROVADO' | 'EM_ANALISE'

export type OrderData = {
  number: string
  status: OrderStatus
  color: string
  wheels: string
  customer: {
    name: string
    email: string
  }
  payment: string
}

export function createOrderLockupActions(page: Page) {
  const searchInput = page.getByTestId('search-order-id')
  const searchButton = page.getByTestId('search-order-button')

  return {
    async open() {
      await page.goto('/')
      const heading = page.getByTestId('hero-section').getByRole('heading')
      await expect(heading).toContainText('Velô Sprint')

      await page.getByRole('link', { name: 'Consultar Pedido' }).click()
      await expect(page.getByRole('heading')).toContainText('Consultar Pedido')
    },

    async searchOrder(orderNumber: string) {
      await searchInput.fill(orderNumber)
      await searchButton.click()
    },

    async validateOrderDetails(order: OrderData) {
      await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
            - img
            - paragraph: Pedido
            - paragraph: ${order.number}
            - status:
                - img
                - text: ${order.status}
            - img "Velô Sprint"
            - paragraph: Modelo
            - paragraph: Velô Sprint
            - paragraph: Cor
            - paragraph: ${order.color}
            - paragraph: Interior
            - paragraph: cream
            - paragraph: Rodas
            - paragraph: ${order.wheels}
            - heading "Dados do Cliente" [level=4]
            - paragraph: Nome
            - paragraph: ${order.customer.name}
            - paragraph: Email
            - paragraph: ${order.customer.email}
            - paragraph: Loja de Retirada
            - paragraph
            - paragraph: Data do Pedido
            - paragraph: /\\d+\\/\\d+\\/\\d+/
            - heading "Pagamento" [level=4]
            - paragraph: ${order.payment}
            - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
            `)
    },

    async validateStatusBadge(status: OrderStatus) {
      const STATUS_CONFIG: Record<OrderStatus, { bgClass: string; textClass: string; iconClass: string }> = {
        APROVADO: { bgClass: 'bg-green-100', textClass: 'text-green-700', iconClass: 'lucide-circle-check-big' },
        REPROVADO: { bgClass: 'bg-red-100', textClass: 'text-red-700', iconClass: 'lucide-circle-x' },
        EM_ANALISE: { bgClass: 'bg-amber-100', textClass: 'text-amber-700', iconClass: 'lucide-clock1' },
      }

      const { bgClass, textClass, iconClass } = STATUS_CONFIG[status]
      const statusBadge = page.getByRole('status').filter({ hasText: status })

      await expect(statusBadge).toContainClass(bgClass)
      await expect(statusBadge).toContainClass(textClass)
      await expect(statusBadge.locator('svg')).toContainClass(iconClass)
    },

    async validateOrderNotFound() {
      await expect(page.locator('#root')).toMatchAriaSnapshot(`
            - img
            - heading "Pedido não encontrado" [level=3]
            - paragraph: Verifique o número do pedido e tente novamente
            `)
    },
  }
}
