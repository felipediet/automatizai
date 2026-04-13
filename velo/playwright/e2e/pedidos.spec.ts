import { test, expect } from '@playwright/test'


/// AAA - Arrange, Act, Assert

test('deve consultar um pedido aprovado', async ({ page }) => {
    // Arrange
        await page.goto('http://localhost:5173/')
        
        //Checkpoint 1: Validar acesso a página
        await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint')

        //Checkpoint 2: Acessar a página de consulta de pedidos
        await page.getByRole('link', { name: 'Consultar Pedido' }).click()
        await expect(page.getByRole('heading')).toContainText('Consultar Pedido')

    // Act
        //Checkpoint 2: Preencher o campo de busca com o número do pedido
        await page.getByTestId('search-order-id').fill('VLO-KLUYJE')

        //Checkpoint 3: Clicar no botão de buscar pedido
        await page.getByTestId('search-order-button').click()

    // Assert
        //Checkpoint 4: Verificar se o pedido foi encontrado
        await expect(page.getByTestId('order-result-id')).toBeVisible({timeout: 10_000})
        await expect(page.getByTestId('order-result-id')).toContainText('VLO-KLUYJE')
        
        await expect(page.getByTestId('order-result-status')).toBeVisible({timeout: 10_000})
        await expect(page.getByTestId('order-result-status')).toContainText('APROVADO')

        //Usando expressão regular para filtrar texto de uma forma mais segura e robusta
        const containerPedido = page.getByRole('paragraph')
            .filter({hasText: /^Pedido$/})
            .locator('..')

        await expect(containerPedido).toContainText('VLO-KLUYJE')
        await expect(page.getByText('APROVADO')).toBeVisible();

        // await expect(page.getByText('VLO-KLUYJE')).toBeVisible();
        // //await expect(page.getByText('VLO-KLUYJE')).toContainText('VLO-KLUYJE');

        // await expect(page.getByText('APROVADO')).toBeVisible();
        // //await expect(page.getByText('APROVADO')).toContainText('APROVADO');

  });