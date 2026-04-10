import { test, expect } from '@playwright/test'

test('deve consultar um pedido aprovado', async ({ page }) => {
    await page.goto('http://localhost:5173/')
    
    //Checkpoint 1: Validar acesso a página
    await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint')

    //Checkpoint 2: Acessar a página de consulta de pedidos
    await page.getByRole('link', { name: 'Consultar Pedido' }).click()
    await expect(page.getByRole('heading')).toContainText('Consultar Pedido')

    //Checkpoint 2: Preencher o campo de busca com o número do pedido
    await page.getByTestId('search-order-id').fill('VLO-KLUYJE')

    //Checkpoint 3: Clicar no botão de buscar pedido
    await page.getByTestId('search-order-button').click()

    //Checkpoint 4: Verificar se o pedido foi encontrado
    await expect(page.getByTestId('order-result-id')).toContainText('VLO-KLUYJE')
    await expect(page.getByTestId('order-result-status')).toBeVisible()
    await expect(page.getByTestId('order-result-status')).toContainText('APROVADO')


  });