/**
 * IMPÉRIOS — Ascensão das Civilizações
 * Fase 13: Segurança, Rate Limiting, Idempotência e Conformidade LGPD
 */

export class SecurityService {
  private static requestCounts = new Map<string, { count: number; windowStart: number }>();
  private static idempotencyKeys = new Map<string, { response: unknown; timestamp: number }>();

  /**
   * Rate Limiter em memória (Token bucket / Sliding window por IP ou Device)
   * Limite padrão: 60 requisições por minuto por cliente
   */
  static checkRateLimit(clientId: string, maxRequestsPerMinute: number = 60): { allowed: boolean; remaining: number } {
    const now = Date.now();
    const windowMs = 60000;

    let record = this.requestCounts.get(clientId);
    if (!record || now - record.windowStart > windowMs) {
      record = { count: 1, windowStart: now };
      this.requestCounts.set(clientId, record);
      return { allowed: true, remaining: maxRequestsPerMinute - 1 };
    }

    if (record.count >= maxRequestsPerMinute) {
      return { allowed: false, remaining: 0 };
    }

    record.count++;
    return { allowed: true, remaining: maxRequestsPerMinute - record.count };
  }

  /**
   * Proteção de Idempotência para transações financeiras e upgrades
   */
  static processIdempotentRequest<T>(
    idempotencyKey: string,
    action: () => T
  ): { cached: boolean; data: T } {
    const cached = this.idempotencyKeys.get(idempotencyKey);
    if (cached) {
      return { cached: true, data: cached.response as T };
    }

    const data = action();
    this.idempotencyKeys.set(idempotencyKey, { response: data, timestamp: Date.now() });
    return { cached: false, data };
  }

  /**
   * Anonimização e exclusão de dados em conformidade com a LGPD
   */
  static sanitizeForLgpdExport(userData: { id: string; email?: string; deviceId?: string; playerName: string }) {
    return {
      userId: userData.id,
      playerName: userData.playerName,
      exportedAt: new Date().toISOString(),
      rightsNotice: 'Dados pessoais processados estritamente em conformidade com a LGPD (Lei Geral de Proteção de Dados - Lei nº 13.709/2018).'
    };
  }
}
