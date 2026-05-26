# Graph Inputs

This folder contains sample graphs for testing the k-clique solver.

## Graph Format

Each `.txt` file has the following format:
```
k=<clique_size>
<node1> <node2>
<node1> <node3>
...
```

- First line: `k=<number>` — the clique size we're searching for
- Subsequent lines: edge pairs (space-separated node numbers)
- Nodes are 1-indexed

## SAT Examples (graphs that HAVE a k-clique)

### sat_example_triangle.txt
- Nodes: 3
- Edges: 3 (complete triangle)
- k=3
- Expected: **SAT** — nodes [1, 2, 3] form a 3-clique

### sat_example_complete_4.txt
- Nodes: 4
- Edges: 6 (complete graph K4)
- k=4
- Expected: **SAT** — nodes [1, 2, 3, 4] form a 4-clique

### sat_example_complete_5.txt
- Nodes: 5
- Edges: 10 (complete graph K5)
- k=5
- Expected: **SAT** — nodes [1, 2, 3, 4, 5] form a 5-clique

### sat_example_clique_4nodes.txt
- Nodes: 4
- Edges: 5
- k=4
- Expected: **SAT** — contains a 4-clique (all nodes connected)

### sat_example_cycle_4nodes.txt
- Nodes: 4
- Edges: 4 (cycle: 1-2-3-4-1)
- k=4
- Expected: **SAT** — all 4 nodes form a clique

## UNSAT Examples (graphs that DO NOT have a k-clique)

### unsat_example_bipartite.txt
- Bipartite graph (two groups of 3 nodes each)
- Expected: **UNSAT** — no large clique exists in bipartite graphs

### unsat_example_star_graph.txt
- Star topology: central node (1) connected to 4 others
- k=4
- Expected: **UNSAT** — only pairs and the center can form cliques, no 4-clique exists

### unsat_example_disconnected.txt
- Two separate components (triangles)
- k=4
- Expected: **UNSAT** — max clique size is 3 (from each triangle)

## Benchmark Graphs (larger test cases)

Used for performance testing and benchmarking:

- **benchmark_100nodes_k5.txt** — 100 nodes, k=5
- **benchmark_300nodes_k10.txt** — 300 nodes, k=10
- **benchmark_500nodes_k15.txt** — 500 nodes, k=15
- **benchmark_500nodes_sparse_k15.txt** — 500 nodes (sparse), k=15
- **benchmark_massive_graph.txt** — large graph for stress testing

## facebook_combined.txt

This file was excluded from the repository to keep it small.
To restore it, run:
```powershell
.\scripts\restore_data.ps1
```

---

**How to test:**
```powershell
# Start backend
cd backend
python app.py

# In another terminal, test a graph:
$body = @{
  n = 3
  k = 3
  edges = @(@(1,2), @(2,3), @(1,3))
} | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:5000/solve" -Method POST -Body $body -ContentType "application/json"
```

