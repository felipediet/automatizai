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

export class OrderLookupPage {

    private readonly searchInput
    private readonly searchButton

    constructor(private page: Page) {
        this.searchInput = page.getByTestId('search-order-id')
        this.searchButton = page.getByTestId('search-order-button')
    }

    /**
    * Navega até a página de consulta de pedidos a partir da landing page.
    * Valida o acesso à home e o redirecionamento correto para a página de consulta.
    */
    async navigateToOrderLookup() {

        //Checkpoint 2: Acessar a página de consulta de pedidos
        await this.page.getByRole('link', { name: 'Consultar Pedido' }).click()
        await expect(this.page.getByRole('heading')).toContainText('Consultar Pedido')
    }


    /**
    * Preenche o campo de busca com o número do pedido e aciona a pesquisa.
    * @param orderNumber - Número do pedido no formato VLO-XXXXXX
    */
    async searchOrder(orderNumber: string) {
        await this.searchInput.fill(orderNumber)
        await this.searchButton.click()
    }

    /**
    * Valida o resultado completo de um pedido:
    * estrutura acessível via AriaSnapshot e badge de status (cor e ícone).
    * @param order - Objeto com os dados esperados do pedido
    */
    async validateOrderDetails(order: OrderData) {
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
    }

    /**
    * Valida o badge de status de um pedido:
    * classes CSS de cor de fundo, cor de texto e ícone SVG correspondente.
    * @param status - Status esperado: 'APROVADO' | 'REPROVADO' | 'EM_ANALISE'
    */
    async validateStatusBadge(status: OrderStatus) {

        const STATUS_CONFIG: Record<OrderStatus, { bgClass: string; textClass: string; iconClass: string }> = {
            APROVADO: { bgClass: 'bg-green-100', textClass: 'text-green-700', iconClass: 'lucide-circle-check-big' },
            REPROVADO: { bgClass: 'bg-red-100', textClass: 'text-red-700', iconClass: 'lucide-circle-x' },
            EM_ANALISE: { bgClass: 'bg-amber-100', textClass: 'text-amber-700', iconClass: 'lucide-clock1' },
        }

        const { bgClass, textClass, iconClass } = STATUS_CONFIG[status]
        const statusBadge = this.page.getByRole('status').filter({ hasText: status })

        await expect(statusBadge).toContainClass(bgClass)
        await expect(statusBadge).toContainClass(textClass)
        await expect(statusBadge.locator('svg')).toContainClass(iconClass)
    }

    /**
     * Valida a mensagem exibida quando um pedido não é encontrado.
     * Verifica a estrutura acessível com título e mensagem orientativa ao usuário.
     */
    async validateOrderNotFound(){
        await expect(this.page.locator('#root')).toMatchAriaSnapshot(`
            - img
            - heading "Pedido não encontrado" [level=3]
            - paragraph: Verifique o número do pedido e tente novamente
            `)
    }
}