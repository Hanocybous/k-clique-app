import importlib.util
import sys
from pathlib import Path
import unittest


BACKEND_DIR = Path(__file__).resolve().parents[1] / "backend"
APP_PATH = BACKEND_DIR / "app.py"

if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

spec = importlib.util.spec_from_file_location("backend_app", APP_PATH)
if spec is None or spec.loader is None:
    raise RuntimeError(f"Unable to load app module from {APP_PATH}")

backend_app = importlib.util.module_from_spec(spec)
spec.loader.exec_module(backend_app)
app = backend_app.app
client = app.test_client()


class BackendSolveTests(unittest.TestCase):
    def test_solve_returns_sat_for_triangle(self):
        response = client.post(
            "/solve",
            json={
                "n": 4,
                "k": 3,
                "edges": [[1, 2], [1, 3], [2, 3], [3, 4]],
            },
        )

        self.assertEqual(response.status_code, 200)
        payload = response.get_json()
        self.assertEqual(payload["status"], "SAT")
        self.assertEqual(set(payload["nodes"]), {1, 2, 3})
        self.assertEqual(len(payload["nodes"]), 3)

    def test_solve_returns_unsat_when_no_clique_exists(self):
        response = client.post(
            "/solve",
            json={
                "n": 4,
                "k": 4,
                "edges": [[1, 2], [2, 3]],
            },
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), {"status": "UNSAT"})


if __name__ == "__main__":
    unittest.main()
