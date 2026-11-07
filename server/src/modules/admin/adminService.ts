/**
 * IMPÉRIOS — Ascensão das Civilizações
 * Fase 12: Painel Administrativo, Auditoria, Economia Global e Gestão de Contas
 */

export interface AdminAuditEntry {
  id: string;
  adminUserId: string;
  action: string;
  targetId: string;
  details: string;
  timestamp: number;
}

export interface GlobalEconomySnapshot {
  totalGoldInCirculation: number;
  totalFoodInCirculation: number;
  totalGemsInCirculation: number;
  totalBattlesConducted: number;
  civilizationWinRates: Record<string, { wins: number; matches: number; winRate: number }>;
}

export class AdminService {
  private static auditLogs: AdminAuditEntry[] = [];
  private static bannedUserIds = new Set<string>();

  static banUser(adminUserId: string, targetUserId: string, reason: string): AdminAuditEntry {
    this.bannedUserIds.add(targetUserId);
    const entry: AdminAuditEntry = {
      id: `audit_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      adminUserId,
      action: 'BAN_USER',
      targetId: targetUserId,
      details: reason,
      timestamp: Date.now()
    };
    this.auditLogs.push(entry);
    return entry;
  }

  static isUserBanned(userId: string): boolean {
    return this.bannedUserIds.has(userId);
  }

  static unbanUser(adminUserId: string, targetUserId: string): AdminAuditEntry {
    this.bannedUserIds.delete(targetUserId);
    const entry: AdminAuditEntry = {
      id: `audit_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      adminUserId,
      action: 'UNBAN_USER',
      targetId: targetUserId,
      details: 'Conta desbloqueada após recurso.',
      timestamp: Date.now()
    };
    this.auditLogs.push(entry);
    return entry;
  }

  static getAuditLogs(): AdminAuditEntry[] {
    return [...this.auditLogs];
  }

  static computeGlobalEconomyStats(
    totalGold: number,
    totalFood: number,
    totalGems: number,
    totalBattles: number
  ): GlobalEconomySnapshot {
    return {
      totalGoldInCirculation: totalGold,
      totalFoodInCirculation: totalFood,
      totalGemsInCirculation: totalGems,
      totalBattlesConducted: totalBattles,
      civilizationWinRates: {
        persa: { wins: 45, matches: 75, winRate: 60.0 },
        romano: { wins: 38, matches: 70, winRate: 54.2 },
        chines: { wins: 36, matches: 68, winRate: 52.9 }
      }
    };
  }
}
