import { test, expect } from '@playwright/test'

test('un usuario puede crear una tarea y verla en la lista', async ({ page }) => {

  await page.route('**/login', route => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ token: 'fake-token' })
  }));
  
  await page.route('**/tasks', route => {
    if (route.request().method() === 'GET') {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
    } else if (route.request().method() === 'POST') {
      route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ id: 1, text: 'Comprar pan', completed: false }) });
    } else {
      route.continue();
    }
  });

  // 1. Entrar a la aplicación
  await page.goto('/')

  // 1.5. Iniciar sesión (necesario por el componente Login.tsx)
  await page.getByPlaceholder('Ej: admin').fill('admin')
  await page.getByPlaceholder('Ej: 1234').fill('1234')
  await page.getByRole('button', { name: 'Ingresar' }).click()

  // 2. Crear una tarea
  await page.getByLabel('Nueva tarea').fill('Comprar pan')
  await page.getByRole('button', { name: 'Agregar' }).click()

  // 3. Verla en la lista
  await expect(page.getByText('Comprar pan')).toBeVisible()
})
