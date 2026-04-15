import { test, expect } from '@playwright/test'
import { generateOrderCode } from '../support/helpers';
import { OrderLookupPage } from '../support/pages/OrderLoockupPage';


/// AAA - Arrange, Act, Assert

test.describe('Consulta de Pedidos', () => {

    test.beforeAll(async () => {
        console.log('beforeAll: roda uma vez antes de todos os testes.')
    })

    test.beforeEach(async ({ page }) => {
        console.log('beforeEach: roda antes de cada teste.')
        // Arrange
        await page.goto('/')
        
        //Checkpoint 1: Validar acesso a página
        await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint')

        //Checkpoint 2: Acessar a página de consulta de pedidos
        await page.getByRole('link', { name: 'Consultar Pedido' }).click()
        await expect(page.getByRole('heading')).toContainText('Consultar Pedido')
    })

    test.afterEach(async () => {
        console.log('afterEach: roda depois de cada teste.')
    })

    test.afterAll(async () => {
        console.log('afterAll: roda uma vez depois de todos os testes.')
    })

    test('deve consultar um pedido APROVADO', async ({ page }) => {

        //Teste Data
        const order = 'VLO-KLUYJE'

        // Act
        const orderLookupPage = new OrderLookupPage(page);
        await orderLookupPage.searchOrder(order);

        // Assert
            //Verificar se o pedido foi encontrado
            // await expect(page.getByTestId('order-result-id')).toBeVisible({timeout: 10_000})
            // await expect(page.getByTestId('order-result-id')).toContainText(order)
            
            // await expect(page.getByTestId('order-result-status')).toBeVisible({timeout: 10_000})
            // await expect(page.getByTestId('order-result-status')).toContainText('APROVADO')

        //Usando expressão regular para filtrar texto de uma forma mais segura e robusta
        const containerPedido = page.getByRole('paragraph')
            .filter({hasText: /^Pedido$/})
            .locator('..')

        await expect(containerPedido).toContainText(order, {timeout: 10_000})
        await expect(page.getByText('APROVADO')).toBeVisible();

        // await expect(page.getByText('VLO-KLUYJE')).toBeVisible();
        // //await expect(page.getByText('VLO-KLUYJE')).toContainText('VLO-KLUYJE');

        // await expect(page.getByText('APROVADO')).toBeVisible();
        // //await expect(page.getByText('APROVADO')).toContainText('APROVADO');

    })

    test('deve consultar um pedido APROVADO - com AriaSnapshot', async ({ page }) => {

        //Teste Data
        //const order = 'VLO-KLUYJE'

        const order = {
            number: 'VLO-KLUYJE',
            status: 'APROVADO',
            color: 'Lunar White',
            wheels: 'sport Wheels',
            customer: {
                name: 'Felipe Diet',
                email: 'diet@velo.dev'
            },
            payment: 'À Vista'
        }

        // Act
        const orderLookupPage = new OrderLookupPage(page);
        await orderLookupPage.searchOrder(order.number);
 
        // Assert
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
            `);

        const statusBadge = page.getByRole('status').filter({ hasText: `${order.status}` })
        await expect(statusBadge).toContainClass('bg-green-100')
        await expect(statusBadge).toContainClass('text-green-700')

        const iconBadge = statusBadge.locator('svg')
        await expect(iconBadge).toContainClass('lucide-circle-check-big')

    })

    test('deve exibir a mensagem quando o pedido nao é encontrado', async ({ page }) => {
    
        const order = generateOrderCode();
        
        // Act
        const orderLookupPage = new OrderLookupPage(page);
        await orderLookupPage.searchOrder(order);
        

        // Assert
        //Opção 0
        // await expect(page.locator('#root')).toContainText('Pedido não encontrado');
        // await expect(page.locator('#root')).toContainText('Verifique o número do pedido e tente novamente');


        //Opção 1
        //const title = page.getByText('Pedido não encontrado' })

        //Opção 2
        // const title = page.getByRole('heading', { name: 'Pedido não encontrado' })
        // await expect(title).toBeVisible()



        //Opção 1
        //const message = page.getByText('Verifique o número do pedido e tente novamente')
        
        //Opção 2
        // const message = page.locator('p', { hasText: 'Verifique o número do pedido e tente novamente' })
        // await expect(message).toBeVisible()

        // Assert
        await expect(page.locator('#root')).toMatchAriaSnapshot(`
            - img
            - heading "Pedido não encontrado" [level=3]
            - paragraph: Verifique o número do pedido e tente novamente
            `)

        

    })

    test('deve consultar um pedido REPROVADO - com AriaSnapshot', async ({ page }) => {

        //Teste Data
        //const order = 'VLO-UWM26W'

        const order = {
            number: 'VLO-UWM26W',
            status: 'REPROVADO',
            color: 'Midnight Black',
            wheels: 'sport Wheels',
            customer: {
                name: 'Steve Jobs',
                email: 'jobs@apple.com'
            },
            payment: 'À Vista'
        }

        // Act
        const orderLookupPage = new OrderLookupPage(page);
        await orderLookupPage.searchOrder(order.number);
 
        // Assert
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
            `);

        const statusBadge = page.getByRole('status').filter({ hasText: `${order.status}` })
        await expect(statusBadge).toContainClass('bg-red-100')
        await expect(statusBadge).toContainClass('text-red-700')

        const iconBadge = statusBadge.locator('svg')
        await expect(iconBadge).toContainClass('lucide-circle-x')

    })

    test('deve consultar um pedido EM ANALISE - com AriaSnapshot', async ({ page }) => {

        //Teste Data
        //const order = 'VLO-UWM26W'

        const order = {
            number: 'VLO-KN8H35',
            status: 'EM_ANALISE',
            color: 'Lunar White',
            wheels: 'aero Wheels',
            customer: {
                name: 'Joao da Silva',
                email: 'joao@velo.dev'
            },
            payment: 'Financiamento 12x'
        }

        // Act
        const orderLookupPage = new OrderLookupPage(page);
        await orderLookupPage.searchOrder(order.number);
 
        // Assert
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
            `);

        const statusBadge = page.getByRole('status').filter({ hasText: `${order.status}` })
        await expect(statusBadge).toContainClass('bg-amber-100')
        await expect(statusBadge).toContainClass('text-amber-700')

        const iconBadge = statusBadge.locator('svg')
        await expect(iconBadge).toContainClass('lucide-clock1')

    })

})