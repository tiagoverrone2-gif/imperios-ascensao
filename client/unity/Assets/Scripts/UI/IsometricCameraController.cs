using UnityEngine;

namespace Imperios.Core.UI
{
    public class IsometricCameraController : MonoBehaviour
    {
        [Header("Limites de Movimento")]
        [SerializeField] private Vector2 panLimitMin = new Vector2(-20f, -20f);
        [SerializeField] private Vector2 panLimitMax = new Vector2(20f, 20f);

        [Header("Zoom")]
        [SerializeField] private float minOrthographicSize = 6f;
        [SerializeField] private float maxOrthographicSize = 18f;
        [SerializeField] private float zoomSpeed = 2f;

        [Header("Sensibilidade de Toque")]
        [SerializeField] private float panSpeed = 0.8f;

        private Camera cam;
        private Vector3 dragOrigin;

        private void Awake()
        {
            cam = GetComponent<Camera>();
            if (cam == null) cam = Camera.main;

            // Alvo 60 FPS em aparelhos capazes; 30 FPS em aparelhos modestos
            Application.targetFrameRate = 60;
            QualitySettings.vSyncCount = 0;
        }

        private void Update()
        {
            HandleMouseInput();
            HandleTouchInput();
            ClampPosition();
        }

        private void HandleMouseInput()
        {
            // Pan com botão direito ou meio
            if (Input.GetMouseButtonDown(1) || Input.GetMouseButtonDown(2))
            {
                dragOrigin = cam.ScreenToWorldPoint(Input.mousePosition);
            }

            if (Input.GetMouseButton(1) || Input.GetMouseButton(2))
            {
                Vector3 difference = dragOrigin - cam.ScreenToWorldPoint(Input.mousePosition);
                transform.position += difference;
            }

            // Scroll zoom
            float scroll = Input.GetAxis("Mouse ScrollWheel");
            if (Mathf.Abs(scroll) > 0.01f)
            {
                cam.orthographicSize = Mathf.Clamp(
                    cam.orthographicSize - scroll * zoomSpeed * 5f,
                    minOrthographicSize,
                    maxOrthographicSize
                );
            }
        }

        private void HandleTouchInput()
        {
            if (Input.touchCount == 1)
            {
                Touch touch = Input.GetTouch(0);
                if (touch.phase == TouchPhase.Moved)
                {
                    Vector2 delta = touch.deltaPosition * (panSpeed * Time.deltaTime);
                    transform.Translate(-delta.x, -delta.y, 0, Space.World);
                }
            }
            else if (Input.touchCount == 2)
            {
                Touch touchZero = Input.GetTouch(0);
                Touch touchOne = Input.GetTouch(1);

                Vector2 prevZeroPos = touchZero.position - touchZero.deltaPosition;
                Vector2 prevOnePos = touchOne.position - touchOne.deltaPosition;

                float prevMagnitude = (prevZeroPos - prevOnePos).magnitude;
                float currentMagnitude = (touchZero.position - touchOne.position).magnitude;
                float difference = currentMagnitude - prevMagnitude;

                cam.orthographicSize = Mathf.Clamp(
                    cam.orthographicSize - difference * 0.01f * zoomSpeed,
                    minOrthographicSize,
                    maxOrthographicSize
                );
            }
        }

        private void ClampPosition()
        {
            Vector3 pos = transform.position;
            pos.x = Mathf.Clamp(pos.x, panLimitMin.x, panLimitMax.x);
            pos.z = Mathf.Clamp(pos.z, panLimitMin.y, panLimitMax.y);
            transform.position = pos;
        }
    }
}
