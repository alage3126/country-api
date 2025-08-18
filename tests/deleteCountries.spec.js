import { test, expect } from '@playwright/test';

test('DELETE /countries/:id should delete the third country', async ({ request }) => {
  // Pega a lista de países
  const getResponse = await request.get('http://127.0.0.1:3000/countries');
  expect(getResponse.ok()).toBeTruthy();

  const countries = await getResponse.json();
  expect(countries.length).toBeGreaterThan(2); // precisa ter pelo menos 3 países

  // Pega o ID do terceiro país
  const countryId = countries[2].ID || countries[2][0]; // depende da estrutura da resposta

  // Deleta o terceiro país
  const deleteResponse = await request.delete(`http://127.0.0.1:3000/countries/${countryId}`);
  expect(deleteResponse.status()).toBe(200);

  // Valida a mensagem de sucesso
  const bodyText = await deleteResponse.text();
  expect(bodyText).toContain('País removido com sucesso');

  console.log(`País ${countryId} removido com sucesso`);

});
