/**
 * IMPÉRIOS — Ascensão das Civilizações
 * Fase 11: Sistema de Alianças, Cargos, Doações de Tropas e Chat
 */

export enum AllianceRole {
  LEADER = 'LEADER',
  ELDER = 'ELDER',
  MEMBER = 'MEMBER'
}

export interface AllianceMemberData {
  userId: string;
  playerName: string;
  role: AllianceRole;
  trophies: number;
  troopsDonated: number;
  joinedAt: number;
}

export interface AllianceData {
  id: string;
  name: string;
  tag: string;
  description: string;
  totalPoints: number;
  members: AllianceMemberData[];
  maxMembers: number;
  chatMessages: { id: string; senderName: string; text: string; timestamp: number }[];
}

export class AllianceManager {
  private static alliances = new Map<string, AllianceData>();

  static createAlliance(
    founderUserId: string,
    founderName: string,
    name: string,
    tag: string,
    description: string
  ): { success: boolean; alliance?: AllianceData; error?: string } {
    if (name.length < 3 || tag.length < 2) {
      return { success: false, error: 'Nome ou Tag da aliança muito curtos.' };
    }

    const allianceId = `all_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const alliance: AllianceData = {
      id: allianceId,
      name,
      tag: tag.toUpperCase(),
      description,
      totalPoints: 0,
      maxMembers: 50,
      members: [
        {
          userId: founderUserId,
          playerName: founderName,
          role: AllianceRole.LEADER,
          trophies: 0,
          troopsDonated: 0,
          joinedAt: Date.now()
        }
      ],
      chatMessages: []
    };

    this.alliances.set(allianceId, alliance);
    return { success: true, alliance };
  }

  static joinAlliance(allianceId: string, userId: string, playerName: string, trophies: number): { success: boolean; error?: string } {
    const alliance = this.alliances.get(allianceId);
    if (!alliance) return { success: false, error: 'Aliança não encontrada.' };
    if (alliance.members.length >= alliance.maxMembers) return { success: false, error: 'Aliança já atingiu o limite de membros.' };
    if (alliance.members.some(m => m.userId === userId)) return { success: false, error: 'Jogador já faz parte desta aliança.' };

    alliance.members.push({
      userId,
      playerName,
      role: AllianceRole.MEMBER,
      trophies,
      troopsDonated: 0,
      joinedAt: Date.now()
    });

    alliance.totalPoints += trophies;
    return { success: true };
  }

  static donateTroops(
    allianceId: string,
    donorUserId: string,
    recipientUserId: string,
    unitType: string,
    count: number
  ): { success: boolean; error?: string } {
    const alliance = this.alliances.get(allianceId);
    if (!alliance) return { success: false, error: 'Aliança inexistente.' };

    const donor = alliance.members.find(m => m.userId === donorUserId);
    const recipient = alliance.members.find(m => m.userId === recipientUserId);
    if (!donor || !recipient) return { success: false, error: 'Membros não pertencem à mesma aliança.' };

    donor.troopsDonated += count;
    return { success: true };
  }
}
