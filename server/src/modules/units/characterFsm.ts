/**
 * IMPÉRIOS — Ascensão das Civilizações
 * Fase 5: Máquinas de Estados Finitos (FSM) de Personagens Civis e Militares
 */

export enum CharacterState {
  IDLE = 'IDLE',
  WALKING = 'WALKING',
  WORKING = 'WORKING',
  PATROLLING = 'PATROLLING',
  SEARCHING_TARGET = 'SEARCHING_TARGET',
  ATTACKING = 'ATTACKING',
  RETREATING = 'RETREATING',
  DEFENDING = 'DEFENDING',
  RETURNING_HOME = 'RETURNING_HOME',
  DEAD = 'DEAD'
}

export enum CharacterRole {
  CIVILIAN_WORKER = 'CIVILIAN_WORKER',
  CIVILIAN_FARMER = 'CIVILIAN_FARMER',
  MILITARY_MELEE = 'MILITARY_MELEE',
  MILITARY_RANGED = 'MILITARY_RANGED',
  MILITARY_ELITE_IMMORTAL = 'MILITARY_ELITE_IMMORTAL'
}

export interface FsmContext {
  id: string;
  role: CharacterRole;
  state: CharacterState;
  health: number;
  maxHealth: number;
  position: { x: number; y: number };
  homePosition: { x: number; y: number };
  targetId?: string;
  targetPosition?: { x: number; y: number };
  attackRange: number;
  attackSpeed: number;
  lastActionSec: number;
}

export class CharacterFSM {
  /**
   * Executa uma transição de estado determinística baseada no contexto atual do personagem
   */
  static updateState(ctx: FsmContext, currentSec: number): CharacterState {
    if (ctx.health <= 0) {
      ctx.state = CharacterState.DEAD;
      return CharacterState.DEAD;
    }

    switch (ctx.state) {
      case CharacterState.IDLE:
        if (ctx.role === CharacterRole.CIVILIAN_WORKER || ctx.role === CharacterRole.CIVILIAN_FARMER) {
          ctx.state = CharacterState.WORKING;
        } else {
          ctx.state = CharacterState.PATROLLING;
        }
        break;

      case CharacterState.WORKING:
        // Trabalhadores trabalham e ocasionalmente voltam para casa ou celeiro
        if (currentSec - ctx.lastActionSec > 15) {
          ctx.lastActionSec = currentSec;
          ctx.state = CharacterState.WALKING;
          ctx.targetPosition = { ...ctx.homePosition };
        }
        break;

      case CharacterState.PATROLLING:
        // Se avistar alvo inimigo no combate, engaja
        if (ctx.targetId && ctx.targetPosition) {
          const dist = Math.hypot(ctx.targetPosition.x - ctx.position.x, ctx.targetPosition.y - ctx.position.y);
          if (dist <= ctx.attackRange) {
            ctx.state = CharacterState.ATTACKING;
          } else {
            ctx.state = CharacterState.WALKING;
          }
        }
        break;

      case CharacterState.WALKING:
        if (ctx.targetPosition) {
          const dist = Math.hypot(ctx.targetPosition.x - ctx.position.x, ctx.targetPosition.y - ctx.position.y);
          if (dist <= 0.2) {
            ctx.position = { ...ctx.targetPosition };
            ctx.state = ctx.targetId ? CharacterState.ATTACKING : CharacterState.WORKING;
          }
        }
        break;

      case CharacterState.ATTACKING:
        // Se vida cair abaixo de 20% e for civil/tropa frágil, recua
        if (ctx.health < ctx.maxHealth * 0.2 && ctx.role !== CharacterRole.MILITARY_ELITE_IMMORTAL) {
          ctx.state = CharacterState.RETREATING;
          ctx.targetPosition = { ...ctx.homePosition };
        }
        break;

      case CharacterState.RETREATING:
        const distHome = Math.hypot(ctx.homePosition.x - ctx.position.x, ctx.homePosition.y - ctx.position.y);
        if (distHome <= 0.5) {
          ctx.state = CharacterState.DEFENDING;
        }
        break;

      case CharacterState.DEFENDING:
        // Recupera compostura e retorna à patrulha
        if (ctx.health > ctx.maxHealth * 0.5) {
          ctx.state = CharacterState.PATROLLING;
        }
        break;

      default:
        ctx.state = CharacterState.IDLE;
        break;
    }

    return ctx.state;
  }
}
