# k-clique-app

This repository contains a web application that solves the **k-clique problem** using SAT solving.

## Overview: How the App Works

### The Problem
The k-clique problem asks: given a graph with `n` nodes and a set of edges, does there exist a clique of size `k`? (A clique is a subset of nodes where every two nodes are connected by an edge.)

### The Solution Approach
1. **Frontend** (React): User draws or uploads a graph and specifies `k`
2. **Backend** (Flask + Z3):
   - Converts the graph and clique constraint into a Boolean SAT formula
   - Uses Z3 theorem prover to solve the SAT formula
   - Returns either a valid clique (nodes that form the k-clique) or UNSAT if none exists
3. **Result**: Frontend displays the clique nodes highlighted on the graph

### Architecture
- **Frontend** (`frontend/`): React + Vite app for graph visualization and user input
- **Backend** (`backend/`):
  - `app.py`: Flask REST API with one `/solve` endpoint (POST JSON)
  - `social_solver/z3_solver.py`: SAT formula generation and Z3 solving logic
- **Tests** (`tests/`): Smoke tests for the `/solve` endpoint (SAT and UNSAT cases)

### Data Flow Example
```
User Input (graph, k=3)
    → Frontend sends: {"n": 4, "k": 3, "edges": [[0,1], [1,2], [2,3], ...]}
    → Backend converts to SAT clauses
    → Z3 solver finds satisfying assignment
    → Returns: {"status": "SAT", "nodes": [1, 2, 3]}
    → Frontend highlights nodes 1, 2, 3 on graph
```

---

## Project Setup & Cleanup

Purpose of this cleanup: prepare the project directory for uploading to GitHub for instructor review while keeping large/local-only data out of the repo.

Checklist performed by the provided scripts:
- Move large data files from `backend/` into `backend/local_data/` (these files are ignored by git)
- Leave small placeholder files so the code doesn't fail when files are referenced
- Add a script to restore the moved files locally

Quick steps to prepare for GitHub (PowerShell)

Run the preparation script (creates `backend/local_data/` and moves large files there):

```powershell
Set-Location "C:\Users\harry\PycharmProjects\k-clique-app"
.\scripts\prepare_for_github.ps1
```

Confirm the repo is clean and then create a git repo and push:

```powershell
git init
git add .
git commit -m "Prepare project for instructor review: remove large local data and add cleanup scripts"
# create remote repo on GitHub, then:
git remote add origin <your-repo-url>
git push -u origin main
```

How to run locally (after cloning)
- Install dependencies (Python 3.10+ recommended):

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt  # or use your usual install method
```

- Start backend (example):

```powershell
Set-Location backend
python app.py
```

- Start frontend (in a second terminal):

```powershell
Set-Location frontend
npm install
npm run dev
```

- Optional backend test check:

```powershell
Set-Location .
python -m unittest discover -s tests -q
```

---

## For Teaching Assistants and Instructors: Quick Testing Guide

### Quick Testing Checklist
1. **Install and start**:
   ```powershell
   pip install -r requirements.txt
   cd backend
   python app.py
   ```
   Backend runs on `http://localhost:5000`

2. **Test the solver with curl** (or Postman):
   - **SAT case** (should find a clique):
     ```powershell
     $body = @{
       n = 4
       k = 3
       edges = @(@(0,1), @(1,2), @(2,3), @(0,2))
     } | ConvertTo-Json
     Invoke-WebRequest -Uri "http://localhost:5000/solve" -Method POST -Body $body -ContentType "application/json"
     ```
     Expected: `{"status":"SAT","nodes":[0,1,2]}`

   - **UNSAT case** (no clique exists):
     ```powershell
     $body = @{
       n = 4
       k = 4
       edges = @(@(0,1), @(1,2))
     } | ConvertTo-Json
     Invoke-WebRequest -Uri "http://localhost:5000/solve" -Method POST -Body $body -ContentType "application/json"
     ```
     Expected: `{"status":"UNSAT"}`

3. **Run test suite**:
   ```powershell
   python -m unittest discover -s tests -q
   ```
   Both tests should pass (SAT and UNSAT cases)

4. **Start frontend** (in another terminal):
   ```powershell
   cd frontend
   npm install
   npm run dev
   ```
   Open browser to `http://localhost:5173` and test the UI

5. **Check code structure**:
   - Solver logic: `backend/social_solver/z3_solver.py`
   - Flask routes: `backend/app.py`
   - Tests: `tests/test_backend.py`
   - Sample graphs: `backend/graphs/` (test_*.txt files)

### Expected Output
- Backend returns `200 OK` with JSON: `{"status": "SAT", "nodes": [...]}` or `{"status": "UNSAT"}`
- Tests pass: `Ran 2 tests` → `OK`
- Frontend displays graph visualization with highlighted clique nodes on success


Notes
- The script moves only files above a size threshold into `backend/local_data/`. If you want to keep some files in repo, move them back before committing.
- If your solver binary is local and not allowed to be committed, put it in `backend/local_data/` and update your local config to point to that path.
- Sample graph inputs are organized in `backend/graphs/`.

