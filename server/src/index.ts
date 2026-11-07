import { buildApp } from './app.js';
import { ENV } from './config/environment.js';

const app = buildApp();

async function start() {
  try {
    const address = await app.listen({ port: ENV.PORT, host: '0.0.0.0' });
    console.log(`⚔️ [IMPÉRIOS - SERVIDOR BACKEND INICIADO] ⚔️`);
    console.log(`🌐 Escutando em: ${address}`);
    console.log(`🏛️ Civilização Ativa da Vertical Slice: Império Persa (Aquemênida)`);
    console.log(`📊 Modos: REST API, Prisma ORM, Economia Segura com Inteiros`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
