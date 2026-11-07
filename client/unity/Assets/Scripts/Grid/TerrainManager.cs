using System;
using UnityEngine;

namespace Imperios.Core.Grid
{
    public enum TerrainBiomeType
    {
        AreiaPersa,
        TerraFertil,
        AguaOasis,
        Rocha,
        EstradaReal
    }

    [Serializable]
    public struct TerrainCell
    {
        public int x;
        public int y;
        public TerrainBiomeType biome;
        public bool isWalkable;
        public float movementCost;
    }

    public class TerrainManager : MonoBehaviour
    {
        [Header("Configuração de Bioma")]
        [SerializeField] private int gridSize = 40;
        [SerializeField] private float cellSize = 1.0f;

        [Header("Materiais e Cores do Terreno")]
        [SerializeField] private Material terrainMaterial;
        [SerializeField] private Color sandColor = new Color(0.85f, 0.75f, 0.55f);
        [SerializeField] private Color waterColor = new Color(0.15f, 0.55f, 0.70f);
        [SerializeField] private Color rockColor = new Color(0.45f, 0.40f, 0.35f);
        [SerializeField] private Color roadColor = new Color(0.65f, 0.60f, 0.50f);

        private TerrainCell[,] gridCells;

        private void Awake()
        {
            GeneratePersianPlanaltoTerrain();
        }

        public void GeneratePersianPlanaltoTerrain()
        {
            gridCells = new TerrainCell[gridSize, gridSize];

            for (int x = 0; x < gridSize; x++)
            {
                for (int y = 0; y < gridSize; y++)
                {
                    TerrainBiomeType biome = TerrainBiomeType.AreiaPersa;
                    bool isWalkable = true;
                    float cost = 1.0f;

                    // Oásis no canto nordeste
                    float distOasis = Mathf.Sqrt(Mathf.Pow(x - 6, 2) + Mathf.Pow(y - 6, 2));
                    if (distOasis <= 3.2f)
                    {
                        biome = TerrainBiomeType.AguaOasis;
                        isWalkable = false;
                        cost = Mathf.Infinity;
                    }
                    // Afloramento rochoso no canto noroeste
                    float distRock = Mathf.Sqrt(Mathf.Pow(x - 33, 2) + Mathf.Pow(y - 7, 2));
                    if (distRock <= 2.2f)
                    {
                        biome = TerrainBiomeType.Rocha;
                        isWalkable = false;
                        cost = Mathf.Infinity;
                    }
                    // Estrada Real cruzando a vila
                    else if (y == 20 && x >= 2 && x <= 38)
                    {
                        biome = TerrainBiomeType.EstradaReal;
                        cost = 0.7f;
                    }

                    gridCells[x, y] = new TerrainCell
                    {
                        x = x,
                        y = y,
                        biome = biome,
                        isWalkable = isWalkable,
                        movementCost = cost
                    };
                }
            }
        }

        public TerrainCell GetCell(int x, int y)
        {
            if (x < 0 || x >= gridSize || y < 0 || y >= gridSize)
                return default;
            return gridCells[x, y];
        }

        public bool IsWalkable(int x, int y)
        {
            if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) return false;
            return gridCells[x, y].isWalkable;
        }
    }
}
