import { Page, expect } from '@playwright/test'

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

const STATUS_CONFIG: Record<OrderStatus, { bgClass: string; textClass: string; iconClass: string }> = {
    APROVADO:   { bgClass: 'bg-green-100', textClass: 'text-green-700', iconClass: 'lucide-circle-check-big' },
    REPROVADO:  { bgClass: 'bg-red-100',   textClass: 'text-red-700',   iconClass: 'lucide-circle-x'         },
    EM_ANALISE: { bgClass: 'bg-amber-100', textClass: 'text-amber-700', iconClass: 'lucide-clock1'           },
}

export class OrderLookupPage {

    private readonly searchInput
    private readonly searchButton

    constructor(private page: Page) {
        this.searchInput = page.getByTestId('search-order-id')
        this.searchButton = page.getByTestId('search-order-button')
    }

    async searchOrder(orderNumber: string): Promise<void> {
        await this.searchInput.fill(orderNumber)
        await this.searchButton.click()
    }

    async assertOrderResult(order: OrderData): Promise<void> {
        await expect(this.page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
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
        await this.assertStatusBadge(order.status)
    }

    async assertStatusBadge(status: OrderStatus): Promise<void> {
        const { bgClass, textClass, iconClass } = STATUS_CONFIG[status]
        const statusBadge = this.page.getByRole('status').filter({ hasText: status })

        await expect(statusBadge).toContainClass(bgClass)
        await expect(statusBadge).toContainClass(textClass)
        await expect(statusBadge.locator('svg')).toContainClass(iconClass)
    }
}