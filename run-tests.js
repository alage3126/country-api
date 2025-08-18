const { exec } = require('child_process');
const http = require('http');
const { test, expect } = require('@playwright/test');

// Função para verificar se o servidor está pronto
function waitForServer(url, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();

    const check = () => {
      http.get(url, res => {
        resolve(); // servidor respondeu, podemos continuar
      }).on('error', () => {
        if (Date.now() - start > timeout) {
          reject(new Error(`Servidor não respondeu dentro de ${timeout}ms`));
        } else {
          setTimeout(check, 100); // tenta de novo
        }
      });
    };

    check();
  });
}

// 1️⃣ Inicia o servidor
const serverProcess = exec('node index.js');

// 2️⃣ Espera o servidor estar pronto
waitForServer('http://127.0.0.1:3000')
  .then(() => {
    console.log('✅ Servidor pronto! Rodando testes Playwright...');

    // 3️⃣ Executa os testes
    const testProcess = exec('npx playwright test');

    testProcess.stdout.pipe(process.stdout);
    testProcess.stderr.pipe(process.stderr);

    testProcess.on('exit', code => {
      console.log(`Testes finalizados com código ${code}`);
      // 4️⃣ Encerra o servidor
      serverProcess.kill();
      process.exit(code);
    });
  })
  .catch(err => {
    console.error('❌ Erro ao esperar servidor:', err);
    serverProcess.kill();
    process.exit(1);
  });
