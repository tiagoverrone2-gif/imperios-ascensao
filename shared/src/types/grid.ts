/**
 * IMPÉRIOS — Ascensão das Civilizações
 * Fase 2: Terreno, Câmera e Grade Isométrica
 * Grade com ocupação multicamada, biomas de terreno e Pathfinding A* determinístico
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

export enum TerrainType {
  AREIA_PERSA = 'AREIA_PERSA',       // Terreno árido clássico do planalto iraniano
  TERRA_FERTIL = 'TERRA_FERTIL',     // Margens cultiváveis e canais qanat
  AGUA_OASIS = 'AGUA_OASIS',         // Lagos de oásis e rios (intransponíveis sem ponte)
  ROCHA = 'ROCHA',                   // Afloramentos rochosos (obstáculo natural)
  ESTRADA_REAL = 'ESTRADA_REAL',     // A célebre Estrada Real de Dario I (+30% velocidade)
  GRAMA_ESTEPE = 'GRAMA_ESTEPE'      // Vegetação esparsa de transição
}

export enum CellOccupantType {
  NONE = 'NONE',
  BUILDING = 'BUILDING',
  OBSTACLE = 'OBSTACLE',
  ROAD = 'ROAD',
  DECORATION = 'DECORATION'
}

export interface CellData {
  x: number;
  y: number;
  terrain: TerrainType;
  occupantType: CellOccupantType;
  occupantId?: string;
  isWalkable: boolean;
  movementCost: number; // 1.0 padrão, 0.7 para estradas, Infinity para obstáculos
}

export const VILLAGE_GRID_SIZE = 40; // Grade padrão 40x40

export class IsometricGridValidator {
  /**
   * Converte coordenadas cartesianas da grade (x, y) em coordenadas isométricas de tela 2:1
   */
  static gridToIsometric(
    gridX: number,
    gridY: number,
    tileWidth: number = 64,
    tileHeight: number = 32,
    elevation: number = 0
  ): { isoX: number; isoY: number } {
    const isoX = (gridX - gridY) * (tileWidth / 2);
    const isoY = (gridX + gridY) * (tileHeight / 2) - elevation;
    return { isoX, isoY };
  }

  /**
   * Converte coordenadas isométricas de tela de volta para a grade (x, y)
   */
  static isometricToGrid(
    isoX: number,
    isoY: number,
    tileWidth: number = 64,
    tileHeight: number = 32,
    elevation: number = 0
  ): GridCoordinate {
    const adjustedY = isoY + elevation;
    const halfW = tileWidth / 2;
    const halfH = tileHeight / 2;
    const gridX = Math.floor((isoX / halfW + adjustedY / halfH) / 2);
    const gridY = Math.floor((adjustedY / halfH - isoX / halfW) / 2);
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

  /**
   * Cria uma matriz padrão 40x40 do bioma persa com oásis e rochas naturais
   */
  static createPersianVillageTerrain(gridSize: number = VILLAGE_GRID_SIZE): CellData[][] {
    const grid: CellData[][] = [];

    for (let x = 0; x < gridSize; x++) {
      grid[x] = [];
      for (let y = 0; y < gridSize; y++) {
        let terrain = TerrainType.AREIA_PERSA;
        let isWalkable = true;
        let movementCost = 1.0;
        let occupantType = CellOccupantType.NONE;

        // Oásis no canto superior nordeste (x: 4..8, y: 4..8)
        if (Math.hypot(x - 6, y - 6) <= 3) {
          terrain = TerrainType.AGUA_OASIS;
          isWalkable = false;
          movementCost = Infinity;
          occupantType = CellOccupantType.OBSTACLE;
        }
        // Afloramento rochoso no canto noroeste (x: 32..35, y: 6..9)
        else if (Math.hypot(x - 33, y - 7) <= 2) {
          terrain = TerrainType.ROCHA;
          isWalkable = false;
          movementCost = Infinity;
          occupantType = CellOccupantType.OBSTACLE;
        }
        // Estrada Real principal que cruza a vila de leste a oeste (y: 20)
        else if (y === 20 && (x >= 2 && x <= 38)) {
          terrain = TerrainType.ESTRADA_REAL;
          movementCost = 0.7; // 30% mais rápido andar na estrada
          occupantType = CellOccupantType.ROAD;
        }

        grid[x][y] = {
          x,
          y,
          terrain,
          occupantType,
          isWalkable,
          movementCost
        };
      }
    }

    return grid;
  }
}

/**
 * Algoritmo de Navegação A* (A-Star) em Grade Isométrica
 */
export class AStarPathfinder {
  static findPath(
    start: GridCoordinate,
    target: GridCoordinate,
    grid: CellData[][],
    gridSize: number = VILLAGE_GRID_SIZE
  ): GridCoordinate[] {
    if (
      start.x < 0 || start.x >= gridSize || start.y < 0 || start.y >= gridSize ||
      target.x < 0 || target.x >= gridSize || target.y < 0 || target.y >= gridSize
    ) {
      return [];
    }

    if (!grid[target.x][target.y].isWalkable) {
      return [];
    }

    const key = (c: GridCoordinate) => `${c.x},${c.y}`;
    const openSet: GridCoordinate[] = [start];
    const cameFrom = new Map<string, GridCoordinate>();

    const gScore = new Map<string, number>();
    gScore.set(key(start), 0);

    const fScore = new Map<string, number>();
    fScore.set(key(start), Math.hypot(target.x - start.x, target.y - start.y));

    while (openSet.length > 0) {
      // Pega o nó em openSet com menor fScore
      let currentIdx = 0;
      let lowestF = fScore.get(key(openSet[0])) ?? Infinity;

      for (let i = 1; i < openSet.length; i++) {
        const score = fScore.get(key(openSet[i])) ?? Infinity;
        if (score < lowestF) {
          lowestF = score;
          currentIdx = i;
        }
      }

      const current = openSet.splice(currentIdx, 1)[0];

      if (current.x === target.x && current.y === target.y) {
        // Reconstrói o caminho
        const path: GridCoordinate[] = [current];
        let currKey = key(current);
        while (cameFrom.has(currKey)) {
          const prev = cameFrom.get(currKey)!;
          path.unshift(prev);
          currKey = key(prev);
        }
        return path;
      }

      // Vizinhos cardeais (cima, baixo, esquerda, direita)
      const neighbors: GridCoordinate[] = [
        { x: current.x + 1, y: current.y },
        { x: current.x - 1, y: current.y },
        { x: current.x, y: current.y + 1 },
        { x: current.x, y: current.y - 1 }
      ];

      for (const neighbor of neighbors) {
        if (
          neighbor.x < 0 || neighbor.x >= gridSize ||
          neighbor.y < 0 || neighbor.y >= gridSize
        ) continue;

        const cell = grid[neighbor.x][neighbor.y];
        if (!cell.isWalkable) continue;

        const currentG = gScore.get(key(current)) ?? Infinity;
        const tentativeG = currentG + cell.movementCost;
        const neighborKey = key(neighbor);

        if (tentativeG < (gScore.get(neighborKey) ?? Infinity)) {
          cameFrom.set(neighborKey, current);
          gScore.set(neighborKey, tentativeG);
          const h = Math.hypot(target.x - neighbor.x, target.y - neighbor.y);
          fScore.set(neighborKey, tentativeG + h);

          if (!openSet.some(c => c.x === neighbor.x && c.y === neighbor.y)) {
            openSet.push(neighbor);
          }
        }
      }
    }

    return []; // Sem caminho viável
  }
}
