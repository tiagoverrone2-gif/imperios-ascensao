using System.Collections.Generic;
using UnityEngine;

namespace Imperios.Core.Grid
{
    public class PathfindingAStar : MonoBehaviour
    {
        [SerializeField] private TerrainManager terrainManager;
        private const int GridSize = 40;

        public List<Vector2Int> FindPath(Vector2Int start, Vector2Int target)
        {
            if (terrainManager == null) terrainManager = GetComponent<TerrainManager>();

            if (!terrainManager.IsWalkable(target.x, target.y))
                return new List<Vector2Int>();

            List<Vector2Int> openSet = new List<Vector2Int> { start };
            HashSet<Vector2Int> closedSet = new HashSet<Vector2Int>();
            Dictionary<Vector2Int, Vector2Int> cameFrom = new Dictionary<Vector2Int, Vector2Int>();

            Dictionary<Vector2Int, float> gScore = new Dictionary<Vector2Int, float> { [start] = 0f };
            Dictionary<Vector2Int, float> fScore = new Dictionary<Vector2Int, float> { [start] = Vector2Int.Distance(start, target) };

            while (openSet.Count > 0)
            {
                // Escolhe o nó com menor fScore
                Vector2Int current = openSet[0];
                float lowestF = fScore.ContainsKey(current) ? fScore[current] : Mathf.Infinity;

                for (int i = 1; i < openSet.Count; i++)
                {
                    float score = fScore.ContainsKey(openSet[i]) ? fScore[openSet[i]] : Mathf.Infinity;
                    if (score < lowestF)
                    {
                        lowestF = score;
                        current = openSet[i];
                    }
                }

                if (current == target)
                {
                    return ReconstructPath(cameFrom, current);
                }

                openSet.Remove(current);
                closedSet.Add(current);

                Vector2Int[] neighbors = new Vector2Int[]
                {
                    new Vector2Int(current.x + 1, current.y),
                    new Vector2Int(current.x - 1, current.y),
                    new Vector2Int(current.x, current.y + 1),
                    new Vector2Int(current.x, current.y - 1)
                };

                foreach (Vector2Int neighbor in neighbors)
                {
                    if (neighbor.x < 0 || neighbor.x >= GridSize || neighbor.y < 0 || neighbor.y >= GridSize)
                        continue;
                    if (closedSet.Contains(neighbor))
                        continue;
                    if (!terrainManager.IsWalkable(neighbor.x, neighbor.y))
                        continue;

                    float moveCost = terrainManager.GetCell(neighbor.x, neighbor.y).movementCost;
                    float tentativeG = (gScore.ContainsKey(current) ? gScore[current] : Mathf.Infinity) + moveCost;

                    if (!gScore.ContainsKey(neighbor) || tentativeG < gScore[neighbor])
                    {
                        cameFrom[neighbor] = current;
                        gScore[neighbor] = tentativeG;
                        fScore[neighbor] = tentativeG + Vector2Int.Distance(neighbor, target);

                        if (!openSet.Contains(neighbor))
                            openSet.Add(neighbor);
                    }
                }
            }

            return new List<Vector2Int>();
        }

        private List<Vector2Int> ReconstructPath(Dictionary<Vector2Int, Vector2Int> cameFrom, Vector2Int current)
        {
            List<Vector2Int> path = new List<Vector2Int> { current };
            while (cameFrom.ContainsKey(current))
            {
                current = cameFrom[current];
                path.Insert(0, current);
            }
            return path;
        }
    }
}
