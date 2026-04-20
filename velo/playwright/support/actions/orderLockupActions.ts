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
    
  const orderInput = page.getByTestId('search-order-id')
  const searchButton = page.getByTestId('search-order-button')

  return {

    elements: {
      orderInput,
      searchButton
    },

    /**
     * Abre a página de consulta de pedidos
     * Navega para a home, valida o heading e clica no link "Consultar Pedido"
     */
    async open() {
      await page.goto('/')
      const heading = page.getByTestId('hero-section').getByRole('heading')
      await expect(heading).toContainText('Velô Sprint')

      await page.getByRole('link', { name: 'Consultar Pedido' }).click()
      await expect(page.getByRole('heading')).toContainText('Consultar Pedido')
    },

    /**
     * Pesquisa um pedido pelo número
     * @param orderNumber - Número do pedido a ser pesquisado
     */
    async searchOrder(orderNumber: string) {
      await orderInput.fill(orderNumber)
      await searchButton.click()
    },

    /**
     * Valida os detalhes completos de um pedido
     * Verifica número, status, cor, rodas, dados do cliente e informações de pagamento
     * @param order - Objeto contendo os dados esperados do pedido
     */
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

    /**
     * Valida o badge de status do pedido
     * Verifica as classes CSS e ícone correspondentes ao status (APROVADO, REPROVADO ou EM_ANALISE)
     * @param status - Status do pedido a ser validado
     */
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

    /**
     * Valida a mensagem de erro quando um pedido não é encontrado
     * Verifica o heading "Pedido não encontrado" e mensagem de orientação
     */
    async validateOrderNotFound() {
      await expect(page.locator('#root')).toMatchAriaSnapshot(`
            - img
            - heading "Pedido não encontrado" [level=3]
            - paragraph: Verifique o número do pedido e tente novamente
            `)
    },
  }
}
