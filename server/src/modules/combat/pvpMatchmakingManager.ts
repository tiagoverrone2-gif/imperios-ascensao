/**
 * IMPÉRIOS — Ascensão das Civilizações
 * Fase 8: PvP Assíncrono, Matchmaking por Troféus e Bloqueio Concorrente
 */

import { DefensiveSnapshot, ResourceAmount } from '@imperios/shared';

export interface MatchmakingPlayer {
  villageId: string;
  userId: string;
  displayName: string;
  civilization: string;
  trophies: number;
  era: number;
  shieldExpiresAt: number;
  isUnderAttack: boolean;
  snapshot: DefensiveSnapshot;
}

export class PvPMatchmakingManager {
  private static attackLocks = new Map<string, { attackerId: string; lockExpiresAt: number }>();

  /**
   * Encontra um adversário elegível dentro da faixa de troféus sem escudo ativo
   */
  static findEligibleOpponent(
    attackerVillageId: string,
    attackerTrophies: number,
    pool: MatchmakingPlayer[],
    currentTime: number = Date.now()
  ): MatchmakingPlayer | null {
    // Limpa locks expirados (> 3 minutos)
    for (const [vId, lock] of this.attackLocks.entries()) {
      if (currentTime > lock.lockExpiresAt) {
        this.attackLocks.delete(vId);
      }
    }

    const eligible = pool.filter(p => {
      if (p.villageId === attackerVillageId) return false;
      if (p.shieldExpiresAt > currentTime) return false;
      if (this.attackLocks.has(p.villageId)) return false;
      // Faixa de troféus ±300
      return Math.abs(p.trophies - attackerTrophies) <= 300;
    });

    if (eligible.length === 0) return null;
    const selected = eligible[Math.floor(Math.random() * eligible.length)];
    return selected;
  }

  /**
   * Adquire trava de ataque para evitar que dois jogadores ataquem a mesma vila simultaneamente
   */
  static acquireAttackLock(defenderVillageId: string, attackerId: string, durationSec: number = 180): boolean {
    const now = Date.now();
    const existing = this.attackLocks.get(defenderVillageId);
    if (existing && existing.lockExpiresAt > now) {
      return false; // Vila já está sob ataque
    }

    this.attackLocks.set(defenderVillageId, {
      attackerId,
      lockExpiresAt: now + durationSec * 1000
    });
    return true;
  }

  /**
   * Libera a trava de ataque
   */
  static releaseAttackLock(defenderVillageId: string): void {
    this.attackLocks.delete(defenderVillageId);
  }

  /**
   * Concede escudo proporcional à destruição sofrida
   */
  static calculateDefeatShieldDuration(stars: number, destructionPct: number): number {
    if (stars === 3 || destructionPct >= 90) return 16 * 3600 * 1000; // 16 horas
    if (stars >= 2 || destructionPct >= 60) return 12 * 3600 * 1000; // 12 horas
    if (stars >= 1 || destructionPct >= 30) return 8 * 3600 * 1000;  // 8 horas
    return 0; // Sem escudo se a defesa repeliu o ataque sem destruição relevante
  }
}
