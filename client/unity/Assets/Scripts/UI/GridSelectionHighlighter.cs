using UnityEngine;
using Imperios.Core.Grid;

namespace Imperios.Core.UI
{
    public class GridSelectionHighlighter : MonoBehaviour
    {
        [Header("Referências")]
        [SerializeField] private IsometricGrid isometricGrid;
        [SerializeField] private LineRenderer diamondCursor;
        [SerializeField] private Color validColor = new Color(0.2f, 0.9f, 0.3f, 0.8f);
        [SerializeField] private Color invalidColor = new Color(0.9f, 0.2f, 0.2f, 0.8f);

        [Header("Estado Atual")]
        public Vector2Int currentHoveredCell;
        public bool isCurrentCellValid = true;

        private Camera cam;

        private void Awake()
        {
            cam = Camera.main;
            if (diamondCursor == null)
                diamondCursor = GetComponent<LineRenderer>();
            ConfigureLineRenderer();
        }

        private void ConfigureLineRenderer()
        {
            if (diamondCursor == null) return;
            diamondCursor.positionCount = 5;
            diamondCursor.loop = true;
            diamondCursor.startWidth = 0.08f;
            diamondCursor.endWidth = 0.08f;
        }

        private void Update()
        {
            UpdateHoveredCell();
            DrawDiamondCursor();
        }

        private void UpdateHoveredCell()
        {
            if (isometricGrid == null) return;

            Ray ray = cam.ScreenPointToRay(Input.mousePosition);
            Plane groundPlane = new Plane(Vector3.up, Vector3.zero);

            if (groundPlane.Raycast(ray, out float enter))
            {
                Vector3 hitPoint = ray.GetPoint(enter);
                currentHoveredCell = isometricGrid.WorldToGridPosition(hitPoint);
                isCurrentCellValid = isometricGrid.IsInsideBounds(currentHoveredCell.x, currentHoveredCell.y, 1, 1);
            }
        }

        private void DrawDiamondCursor()
        {
            if (diamondCursor == null || isometricGrid == null) return;

            diamondCursor.startColor = isCurrentCellValid ? validColor : invalidColor;
            diamondCursor.endColor = diamondCursor.startColor;

            // 4 vértices do losango isométrico
            Vector3 top = isometricGrid.GridToWorldPosition(currentHoveredCell.x, currentHoveredCell.y + 1);
            Vector3 right = isometricGrid.GridToWorldPosition(currentHoveredCell.x + 1, currentHoveredCell.y + 1);
            Vector3 bottom = isometricGrid.GridToWorldPosition(currentHoveredCell.x + 1, currentHoveredCell.y);
            Vector3 left = isometricGrid.GridToWorldPosition(currentHoveredCell.x, currentHoveredCell.y);

            diamondCursor.SetPosition(0, left + Vector3.up * 0.05f);
            diamondCursor.SetPosition(1, top + Vector3.up * 0.05f);
            diamondCursor.SetPosition(2, right + Vector3.up * 0.05f);
            diamondCursor.SetPosition(3, bottom + Vector3.up * 0.05f);
            diamondCursor.SetPosition(4, left + Vector3.up * 0.05f);
        }
    }
}
