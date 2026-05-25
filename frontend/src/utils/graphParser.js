export const parseGraphFile = (fileText) => {
  const lines = fileText.split('\n');
  let parsedK = 3;
  const edges = [];
  let maxNode = 0;

  lines.forEach(line => {
    const cleanLine = line.trim();
    if (!cleanLine) return;
    if (cleanLine.toLowerCase().startsWith('k')) {
      parsedK = Number.parseInt(cleanLine.replaceAll(/\D/g, ''), 10);
    } else {
      const parts = cleanLine.split(/\s+/);
      if (parts.length >= 2) {
        const u = Number.parseInt(parts[0], 10), v = Number.parseInt(parts[1], 10);
        if (!Number.isNaN(u) && !Number.isNaN(v)) {
          edges.push({ source: u, target: v });
          maxNode = Math.max(maxNode, u, v);
        }
      }
    }
  });

  const nodes = Array.from({ length: maxNode }, (_, i) => ({ id: i + 1, neighbors: [] }));
  edges.forEach(edge => {
    nodes[edge.source - 1].neighbors.push(edge.target);
    nodes[edge.target - 1].neighbors.push(edge.source);
  });

  return { nodes, links: edges, kValue: parsedK, maxNode };
};

/**
 * Generates a Barabási–Albert scale-free network (Preferential Attachment)
 * @param {number} n - Total number of nodes to generate
 * @param {number} m - Number of edges to attach from a new node to existing nodes
 */
export const generateBarabasiAlbert = (n, m) => {
  const nodes = [];
  const links = [];
  const m0 = m + 1; // Initial connected cluster size

  // 1. Create initial complete graph (the founders of the social network)
  for (let i = 1; i <= Math.min(m0, n); i++) {
    nodes.push({ id: i, neighbors: [] });
  }
  for (let i = 1; i <= Math.min(m0, n); i++) {
    for (let j = i + 1; j <= Math.min(m0, n); j++) {
      links.push({ source: i, target: j });
      nodes[i - 1].neighbors.push(j);
      nodes[j - 1].neighbors.push(i);
    }
  }

  // A fast way to do weighted random choice: keep an array where a node ID
  // appears exactly as many times as its degree.
  const degreeTracker = [];
  links.forEach(l => {
    degreeTracker.push(l.source, l.target);
  });

  // 2. Add remaining nodes using Preferential Attachment
  for (let i = m0 + 1; i <= n; i++) {
    const newNode = { id: i, neighbors: [] };
    nodes.push(newNode);

    // Select m unique targets based on their popularity
    const targets = new Set();
    while (targets.size < m) {
      const randomIndex = Math.floor(Math.random() * degreeTracker.length);
      targets.add(degreeTracker[randomIndex]);
    }

    // Connect the new node and update the degree tracker
    targets.forEach(targetId => {
      links.push({ source: i, target: targetId });
      nodes[i - 1].neighbors.push(targetId);
      nodes[targetId - 1].neighbors.push(i);

      // Increase probability of being chosen in the future (The rich get richer)
      degreeTracker.push(i, targetId);
    });
  }

  return { nodes, links, maxNode: n, kValue: 4 }; // Default k=4 for synthetic graphs
};