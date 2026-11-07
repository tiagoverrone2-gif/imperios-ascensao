using System;
using UnityEngine;

namespace Imperios.Core.Buildings
{
    public enum BuildingState
    {
        Constructing,
        Upgrading,
        Operational,
        Damaged,
        Destroyed
    }

    public class BuildingController : MonoBehaviour
    {
        [Header("Metadados")]
        public string buildingInstanceId;
        public string buildingType;
        public int level = 1;
        public Vector2Int gridPosition;
        public Vector2Int size = new Vector2Int(3, 3);

        [Header("Combate e Estado")]
        public int maxHealth = 1000;
        public int currentHealth = 1000;
        public BuildingState state = BuildingState.Operational;

        [Header("Visual")]
        [SerializeField] private GameObject operationalModel;
        [SerializeField] private GameObject damagedModel;
        [SerializeField] private ParticleSystem constructionVfx;

        public event Action<BuildingController> OnBuildingClicked;

        public void TakeDamage(int damage)
        {
            currentHealth = Mathf.Max(0, currentHealth - damage);
            if (currentHealth == 0)
            {
                state = BuildingState.Destroyed;
                if (damagedModel != null) damagedModel.SetActive(true);
                if (operationalModel != null) operationalModel.SetActive(false);
            }
            else if (currentHealth < maxHealth * 0.4f)
            {
                state = BuildingState.Damaged;
            }
        }

        private void OnMouseDown()
        {
            OnBuildingClicked?.Invoke(this);
        }
    }
}
