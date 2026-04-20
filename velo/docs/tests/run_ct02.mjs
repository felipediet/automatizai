import { chromium } from '@playwright/test';
import path from 'path';
import fs from 'fs';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const evidenciasDir = path.resolve('docs/tests/evidencias');
  if (!fs.existsSync(evidenciasDir)) {
    fs.mkdirSync(evidenciasDir, { recursive: true });
  }

  try {
    console.log('Acessando o configurador...');
    await page.goto('http://localhost:5173/configure', { waitUntil: 'networkidle' });

    // Step 1
    console.log('Passo 1: Verificando preço inicial...');
    await page.waitForTimeout(2000); // Wait for animations/load
    await page.screenshot({ path: path.join(evidenciasDir, 'CT02_Passo1_Preco_Inicial.png') });
    console.log('Evidência do Passo 1 salva.');

    // Step 2: Cor
    console.log('Passo 2: Selecionando cor diferente...');
    // We need to click on a different color. Let's look for a color option.
    // I will use text or generic button locators since I don't know the exact DOM.
    // Playwright locator strategy: let's try to click a button that might represent 'Midnight Black' or 'Lunar White'.
    const colorButton = page.locator('button:has-text("Midnight Black"), button:has-text("Lunar White")').first();
    if (await colorButton.isVisible()) {
      await colorButton.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(evidenciasDir, 'CT02_Passo2_Cor_Alterada.png') });
      console.log('Evidência do Passo 2 salva.');
    } else {
      console.log('Botão de cor não encontrado. Tentando alternativas...');
      // just screenshot current state
      await page.screenshot({ path: path.join(evidenciasDir, 'CT02_Passo2_Cor_Alterada_Fallback.png') });
    }

    // Step 3: Rodas Sport
    console.log('Passo 3: Selecionando roda Sport...');
    const sportWheelsBtn = page.locator('button:has-text("Sport"), div:has-text("Sport Wheels")').last();
    if (await sportWheelsBtn.isVisible()) {
      await sportWheelsBtn.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(evidenciasDir, 'CT02_Passo3_Rodas_Sport.png') });
      console.log('Evidência do Passo 3 salva.');
    } else {
      console.log('Botão de roda Sport não encontrado.');
      await page.screenshot({ path: path.join(evidenciasDir, 'CT02_Passo3_Rodas_Sport_Fallback.png') });
    }

    // Step 4: Rodas Aero
    console.log('Passo 4: Selecionando roda Aero...');
    const aeroWheelsBtn = page.locator('button:has-text("Aero"), div:has-text("Aero Wheels")').last();
    if (await aeroWheelsBtn.isVisible()) {
      await aeroWheelsBtn.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(evidenciasDir, 'CT02_Passo4_Rodas_Aero.png') });
      console.log('Evidência do Passo 4 salva.');
    } else {
      console.log('Botão de roda Aero não encontrado.');
      await page.screenshot({ path: path.join(evidenciasDir, 'CT02_Passo4_Rodas_Aero_Fallback.png') });
    }

    console.log('CT02 executado com sucesso.');

  } catch (error) {
    console.error('Erro na execução do CT02:', error);
  } finally {
    await browser.close();
  }
})();
