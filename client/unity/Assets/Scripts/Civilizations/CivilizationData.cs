using System;
using UnityEngine;

namespace Imperios.Core.Civilizations
{
    public enum CivilizationId
    {
        Persa,
        Romano,
        Chines,
        Arabe,
        Egipcio,
        Grego,
        Mongol,
        Japones,
        Indiano,
        Otomano,
        Cartagines,
        Viking
    }

    [CreateAssetMenu(fileName = "NewCivilization", menuName = "Imperios/Civilization Definition")]
    public class CivilizationData : ScriptableObject
    {
        [Header("Identidade")]
        public CivilizationId civilizationId;
        public string civilizationName;
        [TextArea(2, 4)]
        public string historicalPeriod;
        [TextArea(3, 6)]
        public string description;

        [Header("Identidade Visual")]
        public string architecturalStyle;
        public Color primaryColor = new Color(0.11f, 0.21f, 0.34f);
        public Color secondaryColor = new Color(0.83f, 0.69f, 0.22f);
        public Color accentColor = new Color(0.70f, 0.13f, 0.13f);
        public Sprite bannerSprite;

        [Header("Bônus")]
        public string economyBonusDescription;
        public float goldProductionMultiplier = 1.15f;
        public string militaryBonusDescription;
        public float eliteTroopHealthMultiplier = 1.20f;
    }
}
