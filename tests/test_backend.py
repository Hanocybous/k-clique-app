import sys
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parents[1] / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app import app  # noqa: E402


client = app.test_client()


def test_solve_returns_sat_for_triangle():
    response = client.post(
        "/solve",
        json={
            "n": 4,
            "k": 3,
            "edges": [[1, 2], [1, 3], [2, 3], [3, 4]],
        },
    )

    assert response.status_code == 200
    payload = response.get_json()
    assert payload["status"] == "SAT"
    assert set(payload["nodes"]) == {1, 2, 3}
    assert len(payload["nodes"]) == 3


def test_solve_returns_unsat_when_no_clique_exists():
    response = client.post(
        "/solve",
        json={
            "n": 4,
            "k": 4,
            "edges": [[1, 2], [2, 3]],
        },
    )

    assert response.status_code == 200
    assert response.get_json() == {"status": "UNSAT"}

