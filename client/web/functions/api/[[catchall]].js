// Cloudflare Pages Functions - Router de API Autoritativa Edge para IMPÉRIOS
// Subdomínio: vilas.proton.ia.br / vilas-proton.pages.dev

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/api/, '');
  const method = request.method;

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };

  if (method === 'OPTIONS') {
    return new Response(null, { headers });
  }

  const timestamp = Date.now();

  // 1. Health
  if (path === '/health' || path === '') {
    return new Response(JSON.stringify({
      success: true,
      data: {
        game: 'IMPÉRIOS — Ascensão das Civilizações',
        version: '0.1.0-cloudflare-edge',
        civilization: 'persa',
        domain: 'vilas.proton.ia.br',
        edgeRuntime: 'Cloudflare Pages Free'
      },
      serverTimestamp: timestamp
    }), { headers });
  }

  // 2. Civilizações
  if (path === '/civilizations') {
    return new Response(JSON.stringify({
      success: true,
      data: {
        civilization: {
          id: 'persa',
          name: 'Império Persa (Aquemênida)',
          architecturalStyle: 'Aquemênida / Persépolis',
          bonuses: {
            economy: '+15% Ouro e Comércio pelas Satrapias',
            military: '+20% Vida para Imortais Persas'
          }
        }
      },
      serverTimestamp: timestamp
    }), { headers });
  }

  // 3. Autenticação Convidado
  if (path === '/auth/guest' && method === 'POST') {
    let body = {};
    try { body = await request.json(); } catch (_) {}
    const playerName = body.playerName || 'Grande Sátrapa Persa';

    return new Response(JSON.stringify({
      success: true,
      data: {
        token: 'edge_jwt_' + Math.random().toString(36).substring(2),
        userId: 'usr_persia_' + timestamp,
        villageId: 'vlg_persia_' + timestamp,
        playerName,
        civilization: 'persa'
      },
      serverTimestamp: timestamp
    }), { headers });
  }

  // 4. Estado da Vila
  if (path === '/village/state') {
    return new Response(JSON.stringify({
      success: true,
      data: {
        villageId: 'vlg_persia_primary',
        name: 'Persépolis Oriental',
        civilization: 'persa',
        era: 1,
        economy: {
          balances: { alimento: 1450, madeira: 1300, pedra: 950, ferro: 600, ouro: 1100, gemas: 250 },
          capacities: { alimento: 5000, madeira: 5000, pedra: 4000, ferro: 3000, ouro: 5000, gemas: 999999 },
          productionPerHour: { alimento: 300, madeira: 250, pedra: 210, ferro: 140, ouro: 220, gemas: 0 },
          lastCalculatedAt: timestamp
        },
        buildings: [
          { id: 'bld_1', type: 'CENTRO_IMPERIAL', level: 1, position: { x: 18, y: 18 }, currentHealth: 2000, maxHealth: 2000 },
          { id: 'bld_2', type: 'FAZENDA', level: 1, position: { x: 14, y: 18 }, currentHealth: 450, maxHealth: 450 },
          { id: 'bld_3', type: 'SERRARIA', level: 1, position: { x: 23, y: 18 }, currentHealth: 500, maxHealth: 500 },
          { id: 'bld_4', type: 'QUARTEL', level: 1, position: { x: 18, y: 23 }, currentHealth: 800, maxHealth: 800 },
          { id: 'bld_5', type: 'TORRE_ARQUEIROS', level: 1, position: { x: 18, y: 15 }, currentHealth: 600, maxHealth: 600 }
        ],
        units: { IMORTAL_PERSA: 20, ARQUEIRO: 25, LANCEIRO: 15 },
        shieldActiveUntil: timestamp + 86400000
      },
      serverTimestamp: timestamp
    }), { headers });
  }

  // 5. Matchmaking
  if (path === '/combat/matchmaking') {
    return new Response(JSON.stringify({
      success: true,
      data: {
        targets: [
          {
            villageId: 'vlg_rival_babilonia',
            defenderName: 'Rei Nabonido da Babilônia',
            civilization: 'babiloneo',
            availableLoot: { alimento: 2500, madeira: 2000, pedra: 1500, ferro: 800, ouro: 1800, gemas: 0 }
          }
        ]
      },
      serverTimestamp: timestamp
    }), { headers });
  }

  // 6. Simulação de Combate
  if (path === '/combat/simulate' && method === 'POST') {
    return new Response(JSON.stringify({
      success: true,
      data: {
        battleResult: {
          battleId: 'btl_' + timestamp,
          destructionPercentage: 100,
          stars: 3,
          isVictory: true,
          lootPlundered: { alimento: 1250, madeira: 1000, pedra: 750, ferro: 400, ouro: 900, gemas: 0 },
          attackerLosses: { IMORTAL_PERSA: 2, ARQUEIRO: 3 },
          durationSeconds: 42
        }
      },
      serverTimestamp: timestamp
    }), { headers });
  }

  return new Response(JSON.stringify({
    success: false,
    error: { code: 'NOT_FOUND', message: 'Rota de API não encontrada: ' + path },
    serverTimestamp: timestamp
  }), { status: 404, headers });
}
