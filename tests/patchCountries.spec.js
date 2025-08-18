import { test, expect, request } from '@playwright/test';

function randomCountryName() {
  const countries = ['Spain', 'France', 'Germany', 'Portugal', 'Norway', 'Brazil', 'Canada'];
  return countries[Math.floor(Math.random() * countries.length)] + '-' + Math.floor(Math.random() * 1000);
}

test('PATCH /countries/:id should update a country', async ({ request }) => {
  const getResponse = await request.get('http://127.0.0.1:3000/countries');
  expect(getResponse.ok()).toBeTruthy();

  const countries = await getResponse.json();
  expect(countries.length).toBeGreaterThan(0);

  const countryId = countries[0][0];
  const updatedName = randomCountryName();

  const patchResponse = await request.patch(`http://127.0.0.1:3000/countries/${countryId}`, {
    data: {
      id: countryId,
      countryName: updatedName
    },
    headers: { 'Content-Type': 'application/json' }
  });

  expect(patchResponse.status()).toBe(200);

  // Lê como texto e valida a mensagem
  const message = await patchResponse.text();
  expect(message).toBe('País atualizado parcialmente com sucesso');

  console.log(`País ${countryId} atualizado com sucesso para "${updatedName}"`);
});
