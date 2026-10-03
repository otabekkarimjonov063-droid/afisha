import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  console.log('Navigating to / ...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  
  // Set localStorage state to simulate items in cart and favorites
  await page.evaluate(() => {
    localStorage.setItem('afisha-storage-v3', JSON.stringify({
      state: {
        cart: [{
          id: '1',
          title: { uz: 'Test', en: 'Test', ru: 'Test' },
          price: 1000,
          qty: 1,
          size: 'A3',
          image: 'test.jpg'
        }],
        favorites: ['1', '2']
      }
    }));
  });

  console.log('Navigating to /cart ...');
  await page.goto('http://localhost:5173/cart', { waitUntil: 'networkidle0' });
  
  console.log('Navigating to /favorites ...');
  await page.goto('http://localhost:5173/favorites', { waitUntil: 'networkidle0' });
  
  await browser.close();
})();
