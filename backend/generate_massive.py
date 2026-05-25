import random
import sys


def generate_massive_graph(filename, total_nodes, target_k, noise_prob=0.1):
    edges = set()

    # 1. Plant the guaranteed clique (Nodes 1 through target_k)
    for i in range(1, target_k + 1):
        for j in range(i + 1, target_k + 1):
            edges.add((i, j))

    # 2. Add random background noise to make the solver sweat
    # noise_prob = 0.1 means a 10% chance any two random nodes are connected
    for i in range(1, total_nodes + 1):
        for j in range(i + 1, total_nodes + 1):
            if (i, j) not in edges and random.random() < noise_prob:
                edges.add((i, j))

    # 3. Shuffle edges so the solver doesn't just read 1-2, 1-3, 1-4 immediately
    edges_list = list(edges)
    random.shuffle(edges_list)

    # 4. Write to your custom .txt format
    with open(filename, 'w') as f:
        f.write(f"k={target_k}\n")
        for u, v in edges_list:
            f.write(f"{u} {v}\n")

    print(f"[+] Created {filename}")
    print(f"    Total Nodes: {total_nodes}")
    print(f"    Total Edges: {len(edges_list)}")
    print(f"    Planted Clique Size: {target_k}")


if __name__ == '__main__':
    if len(sys.argv) < 4:
        print("Usage: python generate_massive.py <filename> <total_nodes> <target_k> [noise_probability]")
        print("Example: python generate_massive.py massive_100.txt 100 5 0.1")
        sys.exit(1)

    filename = sys.argv[1]
    total_nodes = int(sys.argv[2])
    target_k = int(sys.argv[3])
    noise_prob = float(sys.argv[4]) if len(sys.argv) > 4 else 0.1

    generate_massive_graph(filename, total_nodes, target_k, noise_prob)