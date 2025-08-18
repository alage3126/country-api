const { exec } = require('child_process');
const { spawn } = require('child_process');
const http = require('http');

const SERVER_PORT = 3000;

console.log('🔹 Inicializando servidor...');

// 1️⃣ Start do servidor
const server = spawn('node', ['server.js'], {
  stdio: 'inherit',
  shell: true
});

// Função para checar se o servidor está online
function checkServerReady() {
  return new Promise((resolve) => {
    const req = http.get(`http://127.0.0.1:${SERVER_PORT}`, () => {
      resolve(true);
    });
    req.on('error', () => resolve(false));
  });
}

// Espera o servidor ficar pronto
async function waitForServer() {
  let ready = false;
  while (!ready) {
    ready = await checkServerReady();
    if (!ready) {
      await new Promise(res => setTimeout(res, 500)); // tenta a cada 500ms
    }
  }
}

(async () => {
  await waitForServer();
  console.log('✅ Servidor pronto! Rodando testes Playwright...');

  // 2️⃣ Executa os testes Playwright
  const runner = exec('npx playwright test', { shell: true });

  runner.stdout.on('data', (data) => {
    console.log(data.toString());
  });

  runner.stderr.on('data', (data) => {
    console.error(data.toString());
  });

  runner.on('close', (code) => {
    console.log(`Testes finalizados com código ${code}`);

    // 3️⃣ Fecha o servidor
    server.kill();
    console.log('🔹 Servidor encerrado.');
    process.exit(code);
  });
})();

// Captura Ctrl+C
process.on('SIGINT', () => {
  console.log('\n🔹 Interrompido pelo usuário. Fechando servidor...');
  server.kill();
  process.exit();
});
