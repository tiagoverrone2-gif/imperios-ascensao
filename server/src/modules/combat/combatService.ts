/**
 * IMPÉRIOS — Ascensão das Civilizações
 * Motor Autoritativo de Combate Determinístico e Simulação PvP Assíncrona
 */

import {
  UnitType,
  UNITS_CATALOG,
  TargetPriority,
  DefensiveSnapshot,
  DefensiveSnapshotBuilding,
  AttackingArmyUnit,
  BattleSimulationResult,
  BattleEventLog,
  calculateBattleStars,
  ResourceAmount
} from '@imperios/shared';

interface SimUnit {
  id: string;
  type: UnitType;
  health: number;
  maxHealth: number;
  damage: number;
  defense: number;
  range: number;
  speed: number;
  attackSpeed: number;
  targetPriority: TargetPriority;
  posX: number;
  posY: number;
  isAlive: boolean;
  lastAttackSec: number;
}

interface SimBuilding {
  id: string;
  type: string;
  level: number;
  health: number;
  maxHealth: number;
  posX: number;
  posY: number;
  isDestroyed: boolean;
  isDefense: boolean;
  damage: number;
  range: number;
  lastAttackSec: number;
}

export class CombatService {
  /**
   * Executa a simulação determinística de uma batalha entre o exército atacante e o snapshot defensor
   */
  static simulateBattle(
    battleId: string,
    attackerId: string,
    defenderSnapshot: DefensiveSnapshot,
    deployedArmy: AttackingArmyUnit[],
    maxDurationSeconds: number = 180
  ): BattleSimulationResult {
    const events: BattleEventLog[] = [];
    const attackerLosses: Partial<Record<UnitType, number>> = {};

    // 1. Instancia edifícios defensores para simulação
    const simBuildings: SimBuilding[] = defenderSnapshot.buildings.map((b) => ({
      id: b.id,
      type: b.type,
      level: b.level,
      health: b.currentHealth,
      maxHealth: b.maxHealth,
      posX: b.gridX,
      posY: b.gridY,
      isDestroyed: false,
      isDefense: b.isDefense,
      damage: b.damagePerSecond || (b.isDefense ? 30 : 0),
      range: b.range || (b.isDefense ? 5 : 0),
      lastAttackSec: 0
    }));

    // 2. Instancia unidades atacantes
    const simUnits: SimUnit[] = [];
    let unitSequence = 0;

    for (const group of deployedArmy) {
      const def = UNITS_CATALOG[group.unitType];
      if (!def) continue;

      for (let i = 0; i < group.count; i++) {
        unitSequence++;
        // Spawn em torno das bordas da vila
        const spawnX = (unitSequence * 3) % 40;
        const spawnY = unitSequence % 2 === 0 ? 0 : 39;

        simUnits.push({
          id: `u_${unitSequence}`,
          type: group.unitType,
          health: def.health,
          maxHealth: def.health,
          damage: def.damage,
          defense: def.defense,
          range: def.range,
          speed: def.speed,
          attackSpeed: def.attackSpeed,
          targetPriority: def.targetPriority,
          posX: spawnX,
          posY: spawnY,
          isAlive: true,
          lastAttackSec: 0
        });

        events.push({
          timestampSec: 0,
          eventType: 'SPAWN_UNIT',
          sourceId: `u_${unitSequence}`,
          position: { x: spawnX, y: spawnY }
        });
      }
    }

    // 3. Loop determinístico de simulação (passos de 0.5 segundos)
    const timeStep = 0.5;
    let currentSec = 0;
    const initialBuildingCount = simBuildings.length;
    let destroyedBuildingsCount = 0;
    let imperialCenterDestroyed = false;

    while (currentSec <= maxDurationSeconds) {
      currentSec += timeStep;

      // Unidades atacam edifícios
      for (const unit of simUnits) {
        if (!unit.isAlive) continue;

        // Seleciona alvo prioritário
        const target = this.selectBuildingTarget(unit, simBuildings);
        if (!target) continue;

        const dist = Math.hypot(target.posX - unit.posX, target.posY - unit.posY);

        if (dist <= unit.range) {
          // Ataca se cooldown permitir
          if (currentSec - unit.lastAttackSec >= 1 / unit.attackSpeed) {
            unit.lastAttackSec = currentSec;
            const damageApplied = Math.max(1, unit.damage);
            target.health -= damageApplied;

            events.push({
              timestampSec: Math.round(currentSec * 10) / 10,
              eventType: 'ATTACK_HIT',
              sourceId: unit.id,
              targetId: target.id,
              value: damageApplied
            });

            if (target.health <= 0 && !target.isDestroyed) {
              target.isDestroyed = true;
              destroyedBuildingsCount++;
              if (target.type === 'CENTRO_IMPERIAL') {
                imperialCenterDestroyed = true;
              }
              events.push({
                timestampSec: Math.round(currentSec * 10) / 10,
                eventType: 'BUILDING_DESTROYED',
                sourceId: target.id
              });
            }
          }
        } else {
          // Move-se em direção ao alvo
          const dirX = (target.posX - unit.posX) / (dist || 1);
          const dirY = (target.posY - unit.posY) / (dist || 1);
          unit.posX += dirX * unit.speed * timeStep;
          unit.posY += dirY * unit.speed * timeStep;
        }
      }

      // Torres defensivas atacam unidades
      for (const bld of simBuildings) {
        if (bld.isDestroyed || !bld.isDefense) continue;

        // Procura a unidade viva mais próxima dentro do alcance
        let closestUnit: SimUnit | null = null;
        let closestDist = bld.range;

        for (const unit of simUnits) {
          if (!unit.isAlive) continue;
          const dist = Math.hypot(unit.posX - bld.posX, unit.posY - bld.posY);
          if (dist <= closestDist) {
            closestDist = dist;
            closestUnit = unit;
          }
        }

        if (closestUnit && currentSec - bld.lastAttackSec >= 1.0) {
          bld.lastAttackSec = currentSec;
          const damageDealt = Math.max(1, bld.damage - closestUnit.defense);
          closestUnit.health -= damageDealt;

          events.push({
            timestampSec: Math.round(currentSec * 10) / 10,
            eventType: 'ATTACK_HIT',
            sourceId: bld.id,
            targetId: closestUnit.id,
            value: damageDealt
          });

          if (closestUnit.health <= 0 && closestUnit.isAlive) {
            closestUnit.isAlive = false;
            attackerLosses[closestUnit.type] = (attackerLosses[closestUnit.type] || 0) + 1;
            events.push({
              timestampSec: Math.round(currentSec * 10) / 10,
              eventType: 'UNIT_DIED',
              sourceId: closestUnit.id
            });
          }
        }
      }

      // Condições de término precoce:
      // a) Todos os edifícios destruídos (100% de vitória)
      if (destroyedBuildingsCount >= initialBuildingCount) break;

      // b) Todas as tropas atacantes morreram
      const aliveTroops = simUnits.some((u) => u.isAlive);
      if (!aliveTroops) break;
    }

    // 4. Apuração final
    const destructionPercentage = initialBuildingCount > 0
      ? Math.min(100, Math.round((destroyedBuildingsCount / initialBuildingCount) * 100))
      : 0;

    const stars = calculateBattleStars(destructionPercentage, imperialCenterDestroyed);
    const isVictory = stars >= 1;

    // Cálculo do saque (proporcional à porcentagem de destruição, até 50% dos recursos disponíveis)
    const lootRatio = (destructionPercentage / 100) * 0.5;
    const lootPlundered: ResourceAmount = {
      alimento: Math.floor((defenderSnapshot.availableLoot?.alimento || 0) * lootRatio),
      madeira: Math.floor((defenderSnapshot.availableLoot?.madeira || 0) * lootRatio),
      pedra: Math.floor((defenderSnapshot.availableLoot?.pedra || 0) * lootRatio),
      ferro: Math.floor((defenderSnapshot.availableLoot?.ferro || 0) * lootRatio),
      ouro: Math.floor((defenderSnapshot.availableLoot?.ouro || 0) * lootRatio),
      gemas: 0
    };

    events.push({
      timestampSec: Math.round(currentSec * 10) / 10,
      eventType: 'BATTLE_CONCLUDED',
      sourceId: battleId,
      value: stars
    });

    return {
      battleId,
      attackerId,
      defenderId: defenderSnapshot.villageId,
      destructionPercentage,
      stars,
      isVictory,
      lootPlundered,
      attackerLosses,
      durationSeconds: Math.round(currentSec),
      events
    };
  }

  private static selectBuildingTarget(unit: SimUnit, buildings: SimBuilding[]): SimBuilding | null {
    const active = buildings.filter((b) => !b.isDestroyed);
    if (active.length === 0) return null;

    if (unit.targetPriority === TargetPriority.DEFENSES) {
      const defenses = active.filter((b) => b.isDefense);
      if (defenses.length > 0) {
        return this.findClosest(unit.posX, unit.posY, defenses);
      }
    }

    return this.findClosest(unit.posX, unit.posY, active);
  }

  private static findClosest(x: number, y: number, targets: SimBuilding[]): SimBuilding {
    let closest = targets[0];
    let minDist = Math.hypot(closest.posX - x, closest.posY - y);

    for (let i = 1; i < targets.length; i++) {
      const dist = Math.hypot(targets[i].posX - x, targets[i].posY - y);
      if (dist < minDist) {
        minDist = dist;
        closest = targets[i];
      }
    }
    return closest;
  }
}
