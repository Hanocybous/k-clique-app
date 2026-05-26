import sys
import time
import re
import social_solver.z3_solver as solver
from collections import defaultdict, deque

def parse_graph(filepath):
    """Parses the text file into a list of tuple edges and finds max node ID."""
    edges = []
    max_node = 0
    k_val = None

    with open(filepath, 'r') as f:
        for line in f:
            clean_line = line.strip()
            if not clean_line:
                continue
            if clean_line.lower().startswith('k'):
                k_val = int(re.sub(r'\D', '', clean_line))
            else:
                parts = clean_line.split()
                if len(parts) >= 2 and parts[0].isdigit() and parts[1].isdigit():
                    u, v = int(parts[0]), int(parts[1])
                    edges.append((u, v))
                    max_node = max(max_node, u, v)

    return max_node, k_val, edges


def preprocess_graph(n, k, edges):
    """Recursively prunes nodes with degree < k-1 and remaps the surviving nodes."""
    print(f"[*] Starting k-Core Pre-processing (Threshold degree >= {k - 1})...")

    # 1. Build Adjacency List
    adj = defaultdict(set)
    for u, v in edges:
        adj[u].add(v)
        adj[v].add(u)

    active_nodes = set(range(1, n + 1))
    degrees = {node: len(adj[node]) for node in active_nodes}

    # 2. Find initial nodes to kill
    queue = deque([node for node in active_nodes if degrees[node] < k - 1])
    in_queue = set(queue)

    # 3. Recursively Prune
    nodes_removed = 0
    while queue:
        u = queue.popleft()
        active_nodes.remove(u)
        nodes_removed += 1

        for v in adj[u]:
            if v in active_nodes:
                adj[v].remove(u)
                degrees[v] -= 1
                # If a neighbor's degree drops below threshold, mark it for death
                if degrees[v] < k - 1 and v not in in_queue:
                    queue.append(v)
                    in_queue.add(v)

    print(f"[+] Pre-processing complete. Burned away {nodes_removed} useless nodes.")

    # 4. Check for Total Collapse
    if len(active_nodes) < k:
        return 0, [], {}  # Graph collapsed! Impossible to have a k-clique.

    # 5. Remap surviving nodes to contiguous 1...n_new
    sorted_active = sorted(list(active_nodes))
    n_new = len(sorted_active)
    old_to_new = {old: new for new, old in enumerate(sorted_active, 1)}
    new_to_old = {new: old for old, new in old_to_new.items()}

    # 6. Rebuild edges with new IDs
    new_edges = []
    for u, v in edges:
        if u in active_nodes and v in active_nodes:
            new_u, new_v = old_to_new[u], old_to_new[v]
            new_edges.append((min(new_u, new_v), max(new_u, new_v)))

    return n_new, new_edges, new_to_old


def run_benchmark(filepath, override_k=None):
    print(f"\n--- Z3 K-CORE OPTIMIZED BENCHMARK ---")
    print(f"Loading graph from: {filepath}")

    n_original, file_k, edges_original = parse_graph(filepath)
    k = override_k if override_k else (file_k if file_k else 3)

    print(f"Original Nodes: {n_original} | Original Edges: {len(edges_original)} | Target k: {k}")

    # --- INTERCEPT & PRE-PROCESS ---
    start_time = time.time()
    n_new, edges_new, new_to_old = preprocess_graph(n_original, k, edges_original)

    if n_new < k:
        print(f"\n[-] RESULT: UNSATISFIABLE (Graph collapsed during pre-processing)")
        print(f"[*] TOTAL EXECUTION TIME: {(time.time() - start_time):.4f} seconds\n")
        return

    print(f"Surviving Nodes: {n_new} | Surviving Edges: {len(edges_new)}")
    print("Generating SAT Clauses in memory...")

    # --- RUN SAT SOLVER ---
    solver.reset_globals()
    kwargs = {'n': n_new, 'k': k, 'edges': edges_new}
    solver.gen_var_names(**kwargs)
    clauses = solver.gen_clauses(**kwargs)

    print(f"Total Boolean Clauses Generated: {len(clauses)}")
    print("Executing Native Z3 Python Solver... (Press CTRL+C to abort)")

    try:
        result_vars = solver.solve_clauses(clauses)
        end_time = time.time()
        execution_time = end_time - start_time

        if result_vars is not None:
            facts = [solver.var_number_to_name(x) for x in result_vars]
            clique_new_ids = [int(re.search(r',(\d+)\)', f).group(1)) for f in facts if "inClique" in f]

            # --- TRANSLATE IDs BACK TO REALITY ---
            clique_real_ids = [new_to_old[new_id] for new_id in clique_new_ids]

            print(f"\n[+] RESULT: SATISFIABLE")
            print(f"[+] CLIQUE FOUND (Original IDs): {clique_real_ids}")
        else:
            print(f"\n[-] RESULT: UNSATISFIABLE (No {k}-clique exists)")

        print(f"[*] TOTAL EXECUTION TIME: {execution_time:.4f} seconds\n")

    except KeyboardInterrupt:
        print("\n[!] Benchmark aborted by user.")
        sys.exit(1)


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python benchmark.py <path_to_graph.txt> [optional_k_override]")
        sys.exit(1)

    target_file = sys.argv[1]
    k_override = int(sys.argv[2]) if len(sys.argv) > 2 else None

    run_benchmark(target_file, k_override)