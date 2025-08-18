import { test, expect } from '@playwright/test';

test('GET /countries/:id should return a single country', async ({ request }) => {
  // Pega o primeiro país da lista para usar o id
  const listResponse = await request.get('http://127.0.0.1:3000/countries');
  expect(listResponse.status()).toBe(200);
  const countries = await listResponse.json();

  const [id, name] = countries[1];

  // Faz a requisição por ID
  const response = await request.get(`http://127.0.0.1:3000/countries/${id}`);
  expect(response.status()).toBe(200);

  const country = await response.json();

  // Valida o objeto retornado
  expect(country).toHaveProperty('ID', id);
  expect(country).toHaveProperty('COUNTRYNAME', name);
});
