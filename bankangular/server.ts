import express from 'express';
import { CommonEngine } from '@angular/ssr';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { APP_BASE_HREF } from '@angular/common';
import bootstrap from './src/main.server';  // Importe a função de bootstrapping do Angular Universal
import cors from 'cors';  // Middleware CORS

// Função que configura o servidor
export function app(): express.Express {
  const server = express();

  // Caminhos para os diretórios de distribuição
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  // Instância do mecanismo de renderização do Angular Universal
  const commonEngine = new CommonEngine();

  // Habilitar CORS para o frontend Angular (localhost:4200)
  server.use(cors({
    origin: 'http://localhost:4200',  // Permitir requisições do Angular no frontend
    methods: 'GET,POST,PUT,DELETE',  // Métodos permitidos
    allowedHeaders: 'Content-Type, Authorization',  // Cabeçalhos permitidos
  }));

  // Configura o mecanismo de renderização do Angular Universal
  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Rota para servir arquivos estáticos da aplicação Angular
  server.get('**', express.static(browserDistFolder, {
    maxAge: '1y',  // Define cache para arquivos estáticos
    index: 'index.html',
  }));

  // Rota que renderiza o Angular Universal para todas as outras requisições
  server.get('**', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    // Renderiza a página usando o Angular Universal (SSR)
    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  // Rota para a API de transações (exemplo)
  server.get('/api/transactions', (req, res) => {
    const transactions = [
      { id: 1, type: 'Deposit', amount: 100, timestamp: '2024-11-06' },
      { id: 2, type: 'Transfer Out', amount: 50, timestamp: '2024-11-06' },
    ];
    res.json(transactions);
  });

  return server;
}

// Função que inicia o servidor
function run(): void {
  const port = process.env['PORT'] || 4000;  // A porta do servidor (pode ser configurada pelo ambiente)

  // Inicia o servidor Express
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Executa a função de iniciar o servidor
run();
