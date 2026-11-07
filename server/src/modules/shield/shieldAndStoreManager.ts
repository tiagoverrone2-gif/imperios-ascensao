/**
 * IMPÉRIOS — Ascensão das Civilizações
 * Fase 10: Sistema de Escudos e Loja Segura de Entitlements
 */

export interface ShieldData {
  id: string;
  villageId: string;
  type: 'INICIANTE' | 'DERROTA_PVP' | 'PREMIUM';
  expiresAt: number;
}

export interface StorePackage {
  sku: string;
  name: string;
  priceCents: number;
  gemsReward: number;
  shieldHoursReward?: number;
  entitlementGrant?: string;
}

export const STORE_CATALOG: StorePackage[] = [
  { sku: 'gems_pouch_500', name: 'Bolsa de Dáricos & Gemas (500 Gemas)', priceCents: 1490, gemsReward: 500 },
  { sku: 'gems_chest_2500', name: 'Baú Imperial de Gemas (2.500 Gemas)', priceCents: 6990, gemsReward: 2500 },
  { sku: 'extra_builder_hut', name: 'Cabana do 3º Construtor Imperial', priceCents: 2990, gemsReward: 250, entitlementGrant: 'extra_builder_queue' },
  { sku: 'shield_premium_48h', name: 'Escudo Sagrado de Ahura Mazda (48h)', priceCents: 1990, gemsReward: 100, shieldHoursReward: 48 }
];

export class ShieldAndStoreManager {
  private static processedReceipts = new Set<string>();

  /**
   * Concede ou estende escudo respeitando teto de acumulação
   */
  static applyShield(
    currentShieldExpiresAt: number,
    durationMs: number,
    currentTime: number = Date.now(),
    maxStackMs: number = 7 * 24 * 3600 * 1000 // Teto de 7 dias
  ): { newExpiresAt: number; error?: string } {
    const baseTime = Math.max(currentTime, currentShieldExpiresAt);
    const newExpiresAt = baseTime + durationMs;

    if (newExpiresAt - currentTime > maxStackMs) {
      return { newExpiresAt: currentShieldExpiresAt, error: 'Teto máximo de acumulação de escudo atingido.' };
    }

    return { newExpiresAt };
  }

  /**
   * Processa compra na loja com idempotência absoluta
   */
  static processPurchase(
    receiptToken: string,
    sku: string,
    currentGems: number,
    currentShieldExpiresAt: number
  ): { success: boolean; newGems: number; newShieldExpiresAt: number; entitlementGranted?: string; error?: string } {
    if (this.processedReceipts.has(receiptToken)) {
      return { success: false, newGems: currentGems, newShieldExpiresAt: currentShieldExpiresAt, error: 'Recibo já processado anteriormente (Anti-Replay).' };
    }

    const product = STORE_CATALOG.find(p => p.sku === sku);
    if (!product) {
      return { success: false, newGems: currentGems, newShieldExpiresAt: currentShieldExpiresAt, error: 'Produto inexistente no catálogo da loja.' };
    }

    this.processedReceipts.add(receiptToken);

    let updatedGems = currentGems + product.gemsReward;
    let updatedShield = currentShieldExpiresAt;

    if (product.shieldHoursReward) {
      const shieldResult = this.applyShield(currentShieldExpiresAt, product.shieldHoursReward * 3600 * 1000);
      updatedShield = shieldResult.newExpiresAt;
    }

    return {
      success: true,
      newGems: updatedGems,
      newShieldExpiresAt: updatedShield,
      entitlementGranted: product.entitlementGrant
    };
  }
}
