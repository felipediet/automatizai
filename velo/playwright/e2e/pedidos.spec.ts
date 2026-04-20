import { test, expect } from '../support/fixtures'
import { generateOrderCode } from '../support/helpers'
import type { OrderData } from '../support/actions/orderLockupActions'


/// AAA - Arrange, Act, Assert

test.describe('Consulta de Pedidos', () => {

    test.beforeAll(async () => {
        console.log('beforeAll: roda uma vez antes de todos os testes.')
    })

    test.beforeEach(async ({ app }) => {
        console.log('beforeEach: roda antes de cada teste.')
        
        await app.orderLockup.open()
    })

    test.afterEach(async () => {
        console.log('afterEach: roda depois de cada teste.')
    })

    test.afterAll(async () => {
        console.log('afterAll: roda uma vez depois de todos os testes.')
    })

    test('deve consultar um pedido APROVADO', async ({ app, page }) => {

        //Teste Data
        const order = 'VLO-KLUYJE'

        // Act
        await app.orderLockup.searchOrder(order)

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

    test('deve consultar um pedido APROVADO - com AriaSnapshot', async ({ app }) => {

        //Teste Data
        //const order = 'VLO-KLUYJE'

        const order: OrderData = {
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
        await app.orderLockup.searchOrder(order.number)
 
        // Assert
        await app.orderLockup.validateOrderDetails(order)
        await app.orderLockup.validateStatusBadge(order.status)

    })

    test('deve exibir a mensagem quando o pedido nao é encontrado', async ({ app }) => {
    
        const order = generateOrderCode();
        
        // Act
        await app.orderLockup.searchOrder(order)
        

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
        await app.orderLockup.validateOrderNotFound()

        

    })

    test('deve consultar um pedido REPROVADO - com AriaSnapshot', async ({ app }) => {

        //Teste Data
        //const order = 'VLO-UWM26W'

        const order: OrderData = {
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
        await app.orderLockup.searchOrder(order.number)
 
        // Assert
        await app.orderLockup.validateOrderDetails(order)
        await app.orderLockup.validateStatusBadge(order.status)

    })

    test('deve consultar um pedido EM ANALISE - com AriaSnapshot', async ({ app }) => {

        //Teste Data
        //const order = 'VLO-UWM26W'

        const order: OrderData = {
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
        await app.orderLockup.searchOrder(order.number)
 
        // Assert
        await app.orderLockup.validateOrderDetails(order)
        await app.orderLockup.validateStatusBadge(order.status)
    })

})