/**
 * Graph Analysis Utilities
 * Computes centrality measures and layout algorithms for graph visualization
 */

/**
 * Compute degree centrality for each node
 */
export function computeDegreeCentrality(nodes, links) {
  const centrality = {};
  nodes.forEach(n => centrality[n.id] = 0);
  links.forEach(l => {
    const src = l.source.id || l.source;
    const tgt = l.target.id || l.target;
    centrality[src]++;
    centrality[tgt]++;
  });
  
  const max = Math.max(...Object.values(centrality), 1);
  Object.keys(centrality).forEach(k => centrality[k] /= max);
  return centrality;
}

/**
 * Compute betweenness centrality using Brandes' algorithm
 */
export function computeBetweennessCentrality(nodes, links) {
  const nodeMap = {};
  nodes.forEach(n => nodeMap[n.id] = n);
  
  const adj = {};
  nodes.forEach(n => adj[n.id] = []);
  links.forEach(l => {
    const src = l.source.id || l.source;
    const tgt = l.target.id || l.target;
    adj[src].push(tgt);
    adj[tgt].push(src);
  });

  const centrality = {};
  nodes.forEach(n => centrality[n.id] = 0);

  // Simplified betweenness: for each node, count shortest paths passing through it
  nodes.forEach(start => {
    const visited = {};
    const queue = [start];
    const distances = {};
    nodes.forEach(n => distances[n.id] = Infinity);
    distances[start.id] = 0;

    while (queue.length > 0) {
      const curr = queue.shift();
      (adj[curr.id] || []).forEach(neighbor => {
        if (distances[neighbor] === Infinity) {
          distances[neighbor] = distances[curr.id] + 1;
          queue.push(neighbor);
          centrality[neighbor] += 1;
        }
      });
    }
  });

  const max = Math.max(...Object.values(centrality), 1);
  Object.keys(centrality).forEach(k => centrality[k] /= max);
  return centrality;
}

/**
 * Compute closeness centrality
 */
export function computeClosenessCentrality(nodes, links) {
  const adj = {};
  nodes.forEach(n => adj[n.id] = []);
  links.forEach(l => {
    const src = l.source.id || l.source;
    const tgt = l.target.id || l.target;
    adj[src].push(tgt);
    adj[tgt].push(src);
  });

  const centrality = {};
  
  nodes.forEach(start => {
    const distances = {};
    const queue = [start];
    distances[start.id] = 0;
    let sumDist = 0;

    while (queue.length > 0) {
      const curr = queue.shift();
      (adj[curr.id] || []).forEach(neighbor => {
        if (!(neighbor in distances)) {
          distances[neighbor] = distances[curr.id] + 1;
          sumDist += distances[neighbor];
          queue.push(neighbor);
        }
      });
    }

    const reachable = Object.keys(distances).length - 1;
    centrality[start.id] = reachable > 0 ? 1 / sumDist : 0;
  });

  const max = Math.max(...Object.values(centrality), 1);
  Object.keys(centrality).forEach(k => centrality[k] /= max);
  return centrality;
}

/**
 * Compute clustering coefficient for each node
 */
export function computeClusteringCoefficient(nodes, links) {
  const adj = {};
  nodes.forEach(n => adj[n.id] = new Set());
  links.forEach(l => {
    const src = l.source.id || l.source;
    const tgt = l.target.id || l.target;
    adj[src].add(tgt);
    adj[tgt].add(src);
  });

  const clustering = {};
  
  nodes.forEach(node => {
    const neighbors = Array.from(adj[node.id]);
    const k = neighbors.length;

    if (k < 2) {
      clustering[node.id] = 0;
      return;
    }

    let edges = 0;
    for (let i = 0; i < neighbors.length; i++) {
      for (let j = i + 1; j < neighbors.length; j++) {
        if (adj[neighbors[i]].has(neighbors[j])) {
          edges++;
        }
      }
    }

    clustering[node.id] = (2 * edges) / (k * (k - 1));
  });

  const max = Math.max(...Object.values(clustering), 1);
  Object.keys(clustering).forEach(k => clustering[k] /= max);
  return clustering;
}

/**
 * Circular layout: arrange nodes in a circle
 */
export function applyCircularLayout(nodes, radius = 150) {
  const n = nodes.length;
  nodes.forEach((node, idx) => {
    const angle = (2 * Math.PI * idx) / n;
    node.x = radius * Math.cos(angle);
    node.y = radius * Math.sin(angle);
    node.z = 0;
    node.fx = node.x;
    node.fy = node.y;
    node.fz = node.z;
  });
}

/**
 * Grid layout: arrange nodes in a grid
 */
export function applyGridLayout(nodes, spacing = 50) {
  const cols = Math.ceil(Math.sqrt(nodes.length));
  nodes.forEach((node, idx) => {
    const row = Math.floor(idx / cols);
    const col = idx % cols;
    node.x = (col - cols / 2) * spacing;
    node.y = (row - cols / 2) * spacing;
    node.z = 0;
    node.fx = node.x;
    node.fy = node.y;
    node.fz = node.z;
  });
}

/**
 * Hierarchical (tree) layout using breadth-first traversal
 */
export function applyHierarchicalLayout(nodes, links, rootNodeId = null) {
  // Build adjacency
  const adj = {};
  nodes.forEach(n => adj[n.id] = []);
  links.forEach(l => {
    const src = l.source.id || l.source;
    const tgt = l.target.id || l.target;
    adj[src].push(tgt);
    adj[tgt].push(src);
  });

  // Find root (highest degree node if not specified)
  const root = rootNodeId !== null 
    ? nodes.find(n => n.id === rootNodeId) 
    : nodes.reduce((a, b) => (adj[a.id].length > adj[b.id].length ? a : b));

  const visited = new Set();
  const levels = {};
  const queue = [root];
  visited.add(root.id);
  levels[root.id] = 0;

  while (queue.length > 0) {
    const node = queue.shift();
    (adj[node.id] || []).forEach(neighborId => {
      if (!visited.has(neighborId)) {
        visited.add(neighborId);
        levels[neighborId] = (levels[node.id] || 0) + 1;
        queue.push(nodes.find(n => n.id === neighborId));
      }
    });
  }

  // Group nodes by level
  const levelGroups = {};
  nodes.forEach(n => {
    const level = levels[n.id] || 0;
    if (!levelGroups[level]) levelGroups[level] = [];
    levelGroups[level].push(n);
  });

  // Assign positions
  const levelSpacing = 100;
  const nodeSpacing = 60;

  Object.keys(levelGroups).forEach(level => {
    const levelNum = Number(level);
    const nodesInLevel = levelGroups[level];
    const totalWidth = (nodesInLevel.length - 1) * nodeSpacing;

    nodesInLevel.forEach((node, idx) => {
      node.x = (idx * nodeSpacing) - totalWidth / 2;
      node.y = levelNum * levelSpacing;
      node.z = 0;
      node.fx = node.x;
      node.fy = node.y;
      node.fz = node.z;
    });
  });
}

/**
 * Reset nodes to allow force-directed simulation
 */
export function resetForcedDirectedLayout(nodes) {
  nodes.forEach(n => {
    n.fx = null;
    n.fy = null;
    n.fz = null;
  });
}

/**
 * Map centrality measure to color theme
 */
function getCentralityColorTheme(centralityMeasure) {
  const themeMap = {
    'degree': 'heatmap',           // Red -> Yellow -> Green
    'betweenness': 'warm',         // Dark Red -> Orange -> Yellow
    'closeness': 'cool',           // Blue -> Cyan -> Green
    'clustering': 'purple'         // Purple -> Magenta -> Pink
  };
  return themeMap[centralityMeasure] || 'heatmap';
}

/**
 * Get color for node based on centrality measure and theme
 */
export function getNodeColorFromCentrality(value, colorScheme = 'heatmap', isDarkMode = true) {
  // Normalize value to 0-1
  const v = Math.max(0, Math.min(1, value));

  // Map centrality measure names to color themes
  const actualTheme = getCentralityColorTheme(colorScheme);

  const themes = {
    heatmap: () => {
      // Red -> Yellow -> Green
      if (v < 0.5) {
        const r = 255;
        const g = Math.floor(255 * (v * 2));
        return `rgb(${r}, ${g}, 0)`;
      } else {
        const r = Math.floor(255 * (1 - (v - 0.5) * 2));
        const g = 255;
        return `rgb(${r}, ${g}, 0)`;
      }
    },
    cool: () => {
      // Blue -> Cyan -> Green
      const b = Math.floor(255 * (1 - v));
      const g = Math.floor(100 + 155 * v);
      return `rgb(0, ${g}, ${b})`;
    },
    warm: () => {
      // Dark Red -> Orange -> Yellow
      const r = Math.floor(200 + 55 * v);
      const g = Math.floor(50 + 155 * v);
      return `rgb(${r}, ${g}, 0)`;
    },
    purple: () => {
      // Purple -> Magenta -> Pink
      const r = Math.floor(150 + 105 * v);
      const g = Math.floor(50 * (1 - v));
      const b = Math.floor(200 - 100 * v);
      return `rgb(${r}, ${g}, ${b})`;
    },
    grayscale: () => {
      // Black -> White
      const val = Math.floor(100 + 155 * v);
      return `rgb(${val}, ${val}, ${val})`;
    }
  };

  return (themes[actualTheme] || themes.heatmap)();
}

