using UnityEngine;

namespace Imperios.Core.Grid
{
    public class IsometricGrid : MonoBehaviour
    {
        [Header("Configurações da Grade")]
        [SerializeField] private int gridSizeX = 40;
        [SerializeField] private int gridSizeY = 40;
        [SerializeField] private float cellSize = 1.0f;

        public int GridSizeX => gridSizeX;
        public int GridSizeY => gridSizeY;

        /// <summary>
        /// Converte coordenadas discretas da grade (x, y) para posição 3D no espaço do mundo
        /// </summary>
        public Vector3 GridToWorldPosition(int gridX, int gridY, float elevation = 0f)
        {
            // Projeção isométrica clássica: X gira 45 graus, Y comprimido na diagonal
            float worldX = (gridX - gridY) * (cellSize * 0.5f);
            float worldZ = (gridX + gridY) * (cellSize * 0.25f);
            return new Vector3(worldX, elevation, worldZ);
        }

        /// <summary>
        /// Converte uma posição de clique no mundo para coordenadas da grade
        /// </summary>
        public Vector2Int WorldToGridPosition(Vector3 worldPos)
        {
            float halfCell = cellSize * 0.5f;
            float quarterCell = cellSize * 0.25f;

            float gridX = (worldPos.x / halfCell + worldPos.z / quarterCell) * 0.5f;
            float gridY = (worldPos.z / quarterCell - worldPos.x / halfCell) * 0.5f;

            return new Vector2Int(Mathf.FloorToInt(gridX), Mathf.FloorToInt(gridY));
        }

        public bool IsInsideBounds(int gridX, int gridY, int width, int height)
        {
            return gridX >= 0 && gridY >= 0 && (gridX + width) <= gridSizeX && (gridY + height) <= gridSizeY;
        }

        private void OnDrawGizmos()
        {
            Gizmos.color = new Color(0.8f, 0.7f, 0.2f, 0.2f);
            for (int x = 0; x <= gridSizeX; x++)
            {
                Vector3 start = GridToWorldPosition(x, 0);
                Vector3 end = GridToWorldPosition(x, gridSizeY);
                Gizmos.DrawLine(start, end);
            }
            for (int y = 0; y <= gridSizeY; y++)
            {
                Vector3 start = GridToWorldPosition(0, y);
                Vector3 end = GridToWorldPosition(gridSizeX, y);
                Gizmos.DrawLine(start, end);
            }
        }
    }
}
