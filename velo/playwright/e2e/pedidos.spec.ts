import { test, expect } from '../support/fixtures'
import { generateOrderCode } from '../support/helpers'
import { createDbClient, destroyDbClient } from '../support/database/client'
import { createTestOrder, deleteTestOrder } from '../support/database/orderFactory'
import type { Kysely } from 'kysely'
import type { Database } from '../support/database/schema'


/// AAA - Arrange, Act, Assert

test.describe('Consulta de Pedidos', () => {

    let db: Kysely<Database>

    test.beforeAll(async () => {
        db = await createDbClient()
    })

    test.beforeEach(async ({ app }) => {
        await app.orderLockup.open()
    })

    test.afterAll(async () => {
        await destroyDbClient(db)
    })

    test('deve consultar um pedido APROVADO', async ({ app, page }) => {

        const order_number = 'VLO-SEARCH'

        // Cleanup
        await deleteTestOrder(db, order_number)

        // Arrange
        const order = await createTestOrder(db, 'APROVADO', {
            order_number: order_number,
            color: 'lunar-white',
            wheel_type: 'sport',
            customer_name: 'Felipe Diet',
            customer_email: 'diet@velo.dev',
            payment_method: 'avista',
        })

        // Act
        await app.orderLockup.searchOrder(order.number)

        // Assert
        const containerPedido = page.getByRole('paragraph')
            .filter({hasText: /^Pedido$/})
            .locator('..')

        await expect(containerPedido).toContainText(order.number, {timeout: 10_000})
        await expect(page.getByText('APROVADO')).toBeVisible()

        // Cleanup
    

    })

    test('deve consultar um pedido APROVADO - com AriaSnapshot', async ({ app }) => {

        const order_number = 'VLO-SEARC1'

        // Cleanup
        await deleteTestOrder(db, order_number)

        // Arrange
        const order = await createTestOrder(db, 'APROVADO', {
            order_number: order_number,
            color: 'lunar-white',
            wheel_type: 'sport',
            customer_name: 'Felipe Diet',
            customer_email: 'diet@velo.dev',
            payment_method: 'avista',
        })

        // Act
        await app.orderLockup.searchOrder(order.number)

        // Assert
        await app.orderLockup.validateOrderDetails(order)
        await app.orderLockup.validateStatusBadge(order.status)



    })

    test('deve exibir a mensagem quando o pedido nao é encontrado', async ({ app }) => {

        // Arrange
        const order = generateOrderCode()

        // Act
        await app.orderLockup.searchOrder(order)

        // Assert
        await app.orderLockup.validateOrderNotFound()

    })

    test('deve consultar um pedido REPROVADO - com AriaSnapshot', async ({ app }) => {

        const order_number = 'VLO-SEARC2'

        // Cleanup
        await deleteTestOrder(db, order_number)

        // Arrange
        const order = await createTestOrder(db, 'REPROVADO', {
            order_number: order_number,
            color: 'midnight-black',
            wheel_type: 'sport',
            customer_name: 'Steve Jobs',
            customer_email: 'jobs@apple.com',
            payment_method: 'avista',
        })

        // Act
        await app.orderLockup.searchOrder(order.number)

        // Assert
        await app.orderLockup.validateOrderDetails(order)
        await app.orderLockup.validateStatusBadge(order.status)

        // Cleanup
        //await deleteTestOrder(db, order.number)

    })

    test('deve consultar um pedido EM ANALISE - com AriaSnapshot', async ({ app }) => {

        const order_number = 'VLO-SEARC3'

        // Cleanup
        await deleteTestOrder(db, order_number)

        // Arrange
        const order = await createTestOrder(db, 'EM_ANALISE', {
            order_number: order_number,
            color: 'lunar-white',
            wheel_type: 'aero',
            customer_name: 'Joao da Silva',
            customer_email: 'joao@velo.dev',
            payment_method: 'financiamento',
        })

        // Act
        await app.orderLockup.searchOrder(order.number)

        // Assert
        await app.orderLockup.validateOrderDetails(order)
        await app.orderLockup.validateStatusBadge(order.status)

        // Cleanup
        //await deleteTestOrder(db, order.number)

    })

    test('deve manter o botao de busca desabilitato com campo vazio ou apenas espaços', async ({ app, page }) => {

        await app.orderLockup.elements.orderInput.fill('')
        await expect(app.orderLockup.elements.searchButton).toBeDisabled()

        await app.orderLockup.elements.orderInput.fill('   ')
        await expect(app.orderLockup.elements.searchButton).toBeDisabled()

    })

})