import puppeteer from 'puppeteer';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

describe('StadiaIQ E2E End-to-End Flow', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

  it('should load the application and render the sidebar', async () => {
    // Note: E2E tests assume a local server is running on port 5173
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0', timeout: 5000 });
    await page.waitForSelector('.app', { timeout: 3000 });
    const sidebar = await page.$('.sidebar');
    expect(sidebar).not.toBeNull();
  });
});
