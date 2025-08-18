import { test, expect, request } from '@playwright/test';

function randomCountryName() {
  const countries = [
    'Portugal', 'Spain', 'France', 'Germany', 'Italy',
    'Norway', 'Brazil', 'Canada', 'Japan', 'Australia'
  ];
  // Pega um país aleatório e adiciona um número aleatório
  const country = countries[Math.floor(Math.random() * countries.length)];
  const number = Math.floor(Math.random() * 1000);
  return `${country} ${number}`;
}

test('POST /countries should create a new country', async () => {
  const newCountry = {
    id: Math.floor(Math.random() * 1000000), // id aleatório
    countryName: randomCountryName()
  };

  const apiRequest = await request.newContext({
    extraHTTPHeaders: {
      'Content-Type': 'application/json'
    }
  });

  const response = await apiRequest.post('http://127.0.0.1:3000/countries', {
    data: newCountry
  });

  expect(response.status()).toBe(201);

  const bodyText = await response.text();
  expect(bodyText).toContain('País criado com sucesso');

  console.log('Novo país criado:', newCountry.countryName);
});
