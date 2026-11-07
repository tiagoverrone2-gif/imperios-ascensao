using System;
using UnityEngine;

namespace Imperios.Core.Economy
{
    [Serializable]
    public struct ResourceState
    {
        public long alimento;
        public long madeira;
        public long pedra;
        public long ferro;
        public long ouro;
        public long gemas;
    }

    public class ResourceManager : MonoBehaviour
    {
        public static ResourceManager Instance { get; private set; }

        [SerializeField] private ResourceState currentBalances;
        [SerializeField] private ResourceState storageCapacities;
        [SerializeField] private ResourceState productionPerHour;

        public event Action<ResourceState> OnBalancesChanged;

        private void Awake()
        {
            if (Instance == null) Instance = this;
            else Destroy(gameObject);
        }

        public void UpdateAuthoritativeState(ResourceState balances, ResourceState capacities, ResourceState rates)
        {
            currentBalances = balances;
            storageCapacities = capacities;
            productionPerHour = rates;
            OnBalancesChanged?.Invoke(currentBalances);
        }

        public bool CanAfford(ResourceState cost)
        {
            return currentBalances.alimento >= cost.alimento &&
                   currentBalances.madeira >= cost.madeira &&
                   currentBalances.pedra >= cost.pedra &&
                   currentBalances.ferro >= cost.ferro &&
                   currentBalances.ouro >= cost.ouro &&
                   currentBalances.gemas >= cost.gemas;
        }

        public ResourceState GetBalances() => currentBalances;
    }
}
