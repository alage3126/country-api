import { test, expect } from '@playwright/test';

test('GET /countries should return countries list', async ({ request }) => {
  const response = await request.get('http://127.0.0.1:3000/countries');
  expect(response.status()).toBe(200);

  const data = await response.json();
  console.log(data); // opcional, para debug

  // Cada item é um array [ID, COUNTRYNAME]
  data.forEach(country => {
    expect(country.length).toBe(2);
    expect(typeof country[0]).toBe('number'); // ID
    expect(typeof country[1]).toBe('string'); // COUNTRYNAME
  });
});
