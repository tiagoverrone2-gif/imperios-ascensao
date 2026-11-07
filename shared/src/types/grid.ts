/**
 * IMPÉRIOS — Ascensão das Civilizações
 * Grade Isométrica com ocupação de células e validação espacial
 */

export interface GridCoordinate {
  x: number;
  y: number;
}

export interface GridDimensions {
  width: number;
  height: number;
}

export interface GridBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export const VILLAGE_GRID_SIZE = 40; // Grade padrão 40x40

export class IsometricGridValidator {
  /**
   * Converte coordenadas cartesianas da grade (x, y) em coordenadas isométricas de tela
   */
  static gridToIsometric(gridX: number, gridY: number, tileWidth: number = 64, tileHeight: number = 32): { isoX: number; isoY: number } {
    const isoX = (gridX - gridY) * (tileWidth / 2);
    const isoY = (gridX + gridY) * (tileHeight / 2);
    return { isoX, isoY };
  }

  /**
   * Converte coordenadas isométricas de tela de volta para a grade (x, y)
   */
  static isometricToGrid(isoX: number, isoY: number, tileWidth: number = 64, tileHeight: number = 32): GridCoordinate {
    const halfW = tileWidth / 2;
    const halfH = tileHeight / 2;
    const gridX = Math.floor((isoX / halfW + isoY / halfH) / 2);
    const gridY = Math.floor((isoY / halfH - isoX / halfW) / 2);
    return { x: gridX, y: gridY };
  }

  /**
   * Valida se uma construção cabe dentro dos limites da vila
   */
  static isWithinBounds(coord: GridCoordinate, dims: GridDimensions, gridSize: number = VILLAGE_GRID_SIZE): boolean {
    return (
      coord.x >= 0 &&
      coord.y >= 0 &&
      coord.x + dims.width <= gridSize &&
      coord.y + dims.height <= gridSize
    );
  }

  /**
   * Verifica se duas caixas colidem na grade
   */
  static checkCollision(
    posA: GridCoordinate,
    dimA: GridDimensions,
    posB: GridCoordinate,
    dimB: GridDimensions
  ): boolean {
    return (
      posA.x < posB.x + dimB.width &&
      posA.x + dimA.width > posB.x &&
      posA.y < posB.y + dimB.height &&
      posA.y + dimA.height > posB.y
    );
  }
}
