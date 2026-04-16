import { Page, expect } from '@playwright/test'



export class HomePage {

    private readonly heading

    constructor(private page: Page) {
        this.heading = page.getByTestId('hero-section').getByRole('heading')
    }

    /**
    * Navega até a página inicial.
    * Valida o acesso à home.
    */
    async navigateToHome() {
        // Arrange
        await this.page.goto('/')
        
        //Checkpoint 1: Validar acesso a página
        await expect(this.heading).toContainText('Velô Sprint')
    }

}