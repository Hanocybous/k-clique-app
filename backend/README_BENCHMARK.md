# Benchmarking the Z3 k-Clique Solver (offline)

This document explains how to use `benchmark.py` to run the project's Z3-based k-clique solver directly from the command line — without starting the Flask backend. The script performs k-core pre-processing, generates SAT clauses in-memory, runs the Z3 Python solver, and maps any found clique back to the original node IDs.

Prerequisites
- Python 3.10+
- `z3-solver` Python package installed

Quick setup (PowerShell)

```powershell
# from the repository root
python -m venv .venv            ; # create a virtual env (optional but recommended)
.\.venv\Scripts\Activate.ps1  ; # activate the virtual environment
pip install -r requirements.txt ; # install dependencies (includes z3-solver)
```

How `benchmark.py` works (high level)
- Parses your graph file. The expected graph format:
  - Optional first line: `k=<number>` to suggest a default k
  - Remaining lines: `u v` (space separated integer node IDs)
- Performs a k-core style pre-processing to remove nodes of degree < k-1 (pruning impossible nodes)
- Remaps surviving node IDs to a compact range (1..n_new) to reduce clause size
- Generates SAT clauses in memory and calls the Z3 Python API
- If a clique is found, the script prints the clique using the original node IDs

Running the benchmark

Basic usage (PowerShell):

```powershell
# run with k taken from file (if present) or default k=3
python backend\benchmark.py backend\graphs\sat_example_triangle.txt

# override k explicitly (example: force k=4)
python backend\benchmark.py backend\graphs\sat_example_triangle.txt 4
```

Example output (annotated)
- The script will print progress messages similar to:
  - Loading graph from: ...
  - Original Nodes / Original Edges / Target k
  - Pre-processing summary (nodes burned away)
  - Surviving Nodes / Surviving Edges
  - Total Boolean Clauses Generated
  - RESULT: SATISFIABLE or UNSATISFIABLE
  - If SAT: "CLIQUE FOUND (Original IDs): [ ... ]"

Interpreting pre-processing results
- If pre-processing removes too many nodes (surviving nodes < k) the script exits early and reports UNSATISFIABLE because a k-clique is impossible.
- Pre-processing both speeds up solving and reduces memory usage by removing irrelevant nodes.

Tips for benchmarking and reproducibility
- Run the same input multiple times and average the reported "TOTAL EXECUTION TIME" to get a stable measurement.
- For large graphs, increase your system's memory or run on a machine with more RAM; Z3 can be memory intensive.
- If you want raw timings only, redirect stdout to a file and parse the last timing line:

```powershell
python backend\benchmark.py backend\graphs\benchmark_100nodes_k5.txt > run1.log
Select-String -Path run1.log -Pattern "TOTAL EXECUTION TIME"
```

Troubleshooting
- Import/Module errors: make sure you run the script from the repository root so the `social_solver` package is importable (the script expects `backend` to be on the module path). Example: `python backend\benchmark.py ...`
- Z3 import errors: ensure `z3-solver` is installed into the active interpreter (`pip install z3-solver`). On Windows, installation should normally pull a compatible wheel.
- Long run times / high memory: increase SWAP/virtual memory or run on a machine with more RAM. Use the pre-processing k-core to drastically reduce the problem size before solving.

Advanced
- To profile or log memory usage you can run the script under a profiler, or use `time`/`Measure-Command` in PowerShell for coarse timing.

---
Small, focused, reproducible benchmarks will help verify solver performance without launching the web UI.
