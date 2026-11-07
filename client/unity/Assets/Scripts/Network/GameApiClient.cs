using System;
using System.Collections;
using System.Text;
using UnityEngine;
using UnityEngine.Networking;

namespace Imperios.Core.Network
{
    public class GameApiClient : MonoBehaviour
    {
        public static GameApiClient Instance { get; private set; }

        [SerializeField] private string apiBaseUrl = "https://vilas.proton.ia.br/api";
        private string authToken;

        private void Awake()
        {
            if (Instance == null) { Instance = this; DontDestroyOnLoad(gameObject); }
            else Destroy(gameObject);
        }

        public void SetAuthToken(string token)
        {
            authToken = token;
        }

        public IEnumerator GetRequest(string endpoint, Action<string> onSuccess, Action<string> onError)
        {
            string url = $"{apiBaseUrl}{endpoint}";
            using (UnityWebRequest req = UnityWebRequest.Get(url))
            {
                if (!string.IsNullOrEmpty(authToken))
                    req.SetRequestHeader("Authorization", $"Bearer {authToken}");

                yield return req.SendWebRequest();

                if (req.result == UnityWebRequest.Result.Success)
                    onSuccess?.Invoke(req.downloadHandler.text);
                else
                    onError?.Invoke(req.error);
            }
        }

        public IEnumerator PostRequest(string endpoint, string jsonBody, Action<string> onSuccess, Action<string> onError)
        {
            string url = $"{apiBaseUrl}{endpoint}";
            using (UnityWebRequest req = new UnityWebRequest(url, "POST"))
            {
                byte[] bodyRaw = Encoding.UTF8.GetBytes(jsonBody);
                req.uploadHandler = new UploadHandlerRaw(bodyRaw);
                req.downloadHandler = new DownloadHandlerBuffer();
                req.SetRequestHeader("Content-Type", "application/json");

                if (!string.IsNullOrEmpty(authToken))
                    req.SetRequestHeader("Authorization", $"Bearer {authToken}");

                yield return req.SendWebRequest();

                if (req.result == UnityWebRequest.Result.Success)
                    onSuccess?.Invoke(req.downloadHandler.text);
                else
                    onError?.Invoke(req.error);
            }
        }
    }
}
