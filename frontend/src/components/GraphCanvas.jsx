import React, { useEffect, useState, useMemo, useRef } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';
import {
  computeDegreeCentrality,
  computeBetweennessCentrality,
  computeClosenessCentrality,
  computeClusteringCoefficient,
  applyCircularLayout,
  applyGridLayout,
  applyHierarchicalLayout,
  resetForcedDirectedLayout,
  getNodeColorFromCentrality
} from '../utils/graphAnalysis';

// Cache for text sprites to avoid creating them on every render
const spriteCache = new Map();

function createTextSprite(text, isHighlighted, isDarkMode) {
  const cacheKey = `${text}_${isHighlighted}_${isDarkMode}`;
  
  if (spriteCache.has(cacheKey)) {
    return spriteCache.get(cacheKey).clone();
  }
  
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = 256; canvas.height = 128;
  context.font = isHighlighted ? 'bold 48px Inter, sans-serif' : '36px Inter, sans-serif';
  context.fillStyle = isHighlighted ? '#ffffff' : (isDarkMode ? 'rgba(200, 220, 255, 0.7)' : 'rgba(50, 60, 100, 0.9)');
  context.textAlign = 'center'; context.fillText(text, 128, 80);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(18, 9, 1);
  
  // Cache the sprite template
  if (spriteCache.size < 100) {
    spriteCache.set(cacheKey, sprite);
  }
  
  return sprite.clone();
}

// Generates a permanent, stable rotation angle based on the connected Node IDs
function getStableCurveRotation(link) {
  const sid = typeof link.source === 'object' ? link.source.id : link.source;
  const tid = typeof link.target === 'object' ? link.target.id : link.target;

  // Math trick to create a pseudo-random, but unchanging number between 0 and 2π
  const stableHash = (sid * 17) + (tid * 31);
  return (stableHash % 100) / 100 * Math.PI * 2;
}

export default React.forwardRef(({
  graphData, clique, selectedNode, minConnections,
  wormholeNodes, handleNodeClick, scanningNode, maxConnections,
  linkOpacity, linkThickness, nodeSizeScale, curvedLinks,
  layoutType, colorScheme, isDarkMode
}, ref) => {
  const [centrality, setCentrality] = useState({});
  const internalRef = useRef(null);

  // Convert arrays to Sets for O(1) lookups
  const cliqueSet = useMemo(() => new Set(clique), [clique]);
  const wormholeNodesSet = useMemo(() => new Set(wormholeNodes.map(n => n.id)), [wormholeNodes]);
  const selectedNodeId = useMemo(() => selectedNode?.id, [selectedNode]);
  const selectedNodeNeighbors = useMemo(() => new Set(selectedNode?.neighbors || []), [selectedNode?.neighbors]);

  // Update layout when layoutType changes
  useEffect(() => {
    if (!graphData.nodes || graphData.nodes.length === 0) return;

    const nodesCopy = [...graphData.nodes];
    if (layoutType === 'force') {
      resetForcedDirectedLayout(nodesCopy);
    } else if (layoutType === 'circular') {
      applyCircularLayout(nodesCopy, 150);
    } else if (layoutType === 'grid') {
      applyGridLayout(nodesCopy, 50);
    } else if (layoutType === 'hierarchical') {
      applyHierarchicalLayout(nodesCopy, graphData.links);
    }

    if (internalRef.current) {
      internalRef.current.d3ReheatSimulation();
    }
  }, [layoutType, graphData.nodes.length]);

  // Compute and memoize centrality based on colorScheme
  const memoizedCentrality = useMemo(() => {
    if (!graphData.nodes || graphData.nodes.length === 0) {
      return {};
    }

    let newCentrality;
    if (colorScheme === 'degree') {
      newCentrality = computeDegreeCentrality(graphData.nodes, graphData.links);
    } else if (colorScheme === 'betweenness') {
      newCentrality = computeBetweennessCentrality(graphData.nodes, graphData.links);
    } else if (colorScheme === 'closeness') {
      newCentrality = computeClosenessCentrality(graphData.nodes, graphData.links);
    } else if (colorScheme === 'clustering') {
      newCentrality = computeClusteringCoefficient(graphData.nodes, graphData.links);
    } else {
      newCentrality = computeDegreeCentrality(graphData.nodes, graphData.links);
    }
    return newCentrality;
  }, [colorScheme, graphData.nodes.length, graphData.links.length]);

  useEffect(() => {
    setCentrality(memoizedCentrality);
  }, [memoizedCentrality]);

  // Memoize wormhole check function
  const isWormholeLink = useMemo(() => {
    return (sid, tid) => wormholeNodesSet.has(sid) && wormholeNodesSet.has(tid);
  }, [wormholeNodesSet]);

  // Forward ref to internal ref
  React.useImperativeHandle(ref, () => internalRef.current);

  return (
    <ForceGraph3D
      ref={internalRef}
      graphData={graphData}
      backgroundColor={isDarkMode ? "#020306" : "#ffffff"}
      onNodeClick={handleNodeClick}
      enableNodeDrag={true}
      onNodeDragEnd={node => { node.fx = node.x; node.fy = node.y; node.fz = node.z; }}

      // Applies the Organic vs Straight curve toggle
      linkCurvature={link => {
        if (!curvedLinks) return 0;
        const sid = link.source.id || link.source;
        const tid = link.target.id || link.target;
        if (isWormholeLink(sid, tid)) return 0;
        return 0.25;
      }}
      linkCurveRotation={getStableCurveRotation}

      nodeThreeObject={node => {
        if ((node.neighbors?.length || 0) < minConnections) return new THREE.Object3D();

        const isClique = cliqueSet.has(node.id);
        const isSelected = selectedNodeId === node.id;
        const isScanning = scanningNode === node.id;
        const isDimmed = (selectedNode && !isSelected && !selectedNodeNeighbors.has(node.id)) || (clique.length > 0 && !isClique);

        // Use centrality for base color
        const centralityValue = centrality[node.id] || 0;
        let nodeColor = getNodeColorFromCentrality(centralityValue, colorScheme, isDarkMode);

        if (isClique) nodeColor = '#00ffff';
        else if (isScanning) nodeColor = '#ff3366';
        else if (isSelected) nodeColor = '#ff00ff';

        // Apply the global scale slider
        const baseSize = isClique || isSelected || isScanning ? 12 : 4 + (centralityValue * 6);
        const finalSize = baseSize * nodeSizeScale;

        const group = new THREE.Group();

        const sphere = new THREE.Mesh(
          new THREE.SphereGeometry(finalSize, 24, 24),
          new THREE.MeshPhysicalMaterial({
            color: nodeColor,
            transparent: true,
            opacity: isDimmed ? 0.05 : (isClique || isScanning ? 1.0 : 0.85),
            roughness: 0.2,
            transmission: 0.5,
            thickness: 0.5,
            emissive: isScanning ? '#ff3366' : (isClique ? '#00aaaa' : '#000000'),
            emissiveIntensity: isScanning || isClique ? 0.8 : 0
          })
        );
        group.add(sphere);

        if (!isDimmed) {
           const sprite = createTextSprite(`${node.id}`, isClique || isSelected || isScanning, isDarkMode);
           sprite.position.y = finalSize + (6 * nodeSizeScale);
           group.add(sprite);
        }
        return group;
      }}

      linkColor={link => {
        const sid = link.source.id || link.source;
        const tid = link.target.id || link.target;
        if (isWormholeLink(sid, tid)) return '#ff00ff';
        if (cliqueSet.has(sid) && cliqueSet.has(tid)) return '#00ffff';
        if (scanningNode === sid || scanningNode === tid) return 'rgba(255, 51, 102, 0.9)';

        const isDimmed = (selectedNode && !(sid === selectedNodeId || tid === selectedNodeId)) || (clique.length > 0 && !(cliqueSet.has(sid) && cliqueSet.has(tid)));

        // Dynamic opacity based on your slider
        const finalAlpha = isDimmed ? 0.05 : linkOpacity;
        return isDarkMode
          ? `rgba(80, 110, 200, ${finalAlpha})`
          : `rgba(150, 150, 200, ${finalAlpha})`;
      }}

      linkWidth={link => {
        const sid = link.source.id || link.source;
        const tid = link.target.id || link.target;

        // Base thickness multiplied by your slider
        let baseWidth = (scanningNode === sid || scanningNode === tid) ? 1.5 : 1.0;
        if (cliqueSet.has(sid) && cliqueSet.has(tid)) baseWidth = 2.5;

        return baseWidth * linkThickness;
      }}

      linkDirectionalParticles={link => {
        const sid = link.source.id || link.source;
        const tid = link.target.id || link.target;
        if (cliqueSet.has(sid) && cliqueSet.has(tid)) return 4;
        if (scanningNode === sid || scanningNode === tid) return 2;
        return 0;
      }}
      linkDirectionalParticleWidth={link => clique.length > 0 ? 3 : 2}
      linkDirectionalParticleSpeed={0.008}
      linkDirectionalParticleColor={link => {
        const sid = link.source.id || link.source;
        const tid = link.target.id || link.target;
        if (cliqueSet.has(sid) && cliqueSet.has(tid)) return '#ffffff';
        return '#ff3366';
      }}
    />
  );
});