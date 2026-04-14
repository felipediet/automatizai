import { test, expect } from '@playwright/test'


/// AAA - Arrange, Act, Assert

test('deve consultar um pedido aprovado', async ({ page }) => {

    //Teste Data
    const order = 'VLO-KLUYJE'

    // Arrange
        await page.goto('http://localhost:5173/')
        
        //Checkpoint 1: Validar acesso a página
        await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint')

        //Checkpoint 2: Acessar a página de consulta de pedidos
        await page.getByRole('link', { name: 'Consultar Pedido' }).click()
        await expect(page.getByRole('heading')).toContainText('Consultar Pedido')

    // Act
        //Checkpoint 2: Preencher o campo de busca com o número do pedido
        //await page.getByTestId('search-order-id').fill(order)
        await page.getByRole('textbox', { name: 'Número do Pedido'}).fill(order)

        //Checkpoint 3: Clicar no botão de buscar pedido
        //await page.getByTestId('search-order-button').click()
        await page.getByRole('button', { name: 'Buscar Pedido'}).click()

    // Assert
        //Checkpoint 4: Verificar se o pedido foi encontrado
        await expect(page.getByTestId('order-result-id')).toBeVisible({timeout: 10_000})
        await expect(page.getByTestId('order-result-id')).toContainText(order)
        
        await expect(page.getByTestId('order-result-status')).toBeVisible({timeout: 10_000})
        await expect(page.getByTestId('order-result-status')).toContainText('APROVADO')

        //Usando expressão regular para filtrar texto de uma forma mais segura e robusta
        const containerPedido = page.getByRole('paragraph')
            .filter({hasText: /^Pedido$/})
            .locator('..')

        await expect(containerPedido).toContainText(order)
        await expect(page.getByText('APROVADO')).toBeVisible();

        // await expect(page.getByText('VLO-KLUYJE')).toBeVisible();
        // //await expect(page.getByText('VLO-KLUYJE')).toContainText('VLO-KLUYJE');

        // await expect(page.getByText('APROVADO')).toBeVisible();
        // //await expect(page.getByText('APROVADO')).toContainText('APROVADO');

  });



  test('deve exibir a mensagem quando o pedido nao é encontrado', async ({ page }) => {
    
    const order = 'VLO-ABC123'

    await page.goto('http://localhost:5173/')
    await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint')
    await page.getByRole('link', { name: 'Consultar Pedido' }).click()
    await expect(page.getByRole('heading')).toContainText('Consultar Pedido')
    
    await page.getByRole('textbox', { name: 'Número do Pedido'}).fill(order)
    await page.getByRole('button', { name: 'Buscar Pedido'}).click() 
    
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

    await expect(page.locator('#root')).toMatchAriaSnapshot(`
        - img
        - heading "Pedido não encontrado" [level=3]
        - paragraph: Verifique o número do pedido e tente novamente
        `)

        

  });