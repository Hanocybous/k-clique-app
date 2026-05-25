import React from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';

function createTextSprite(text, isHighlighted) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = 256; canvas.height = 128;
  context.font = isHighlighted ? 'bold 48px Inter, sans-serif' : '36px Inter, sans-serif';
  context.fillStyle = isHighlighted ? '#ffffff' : 'rgba(200, 220, 255, 0.7)';
  context.textAlign = 'center'; context.fillText(text, 128, 80);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(18, 9, 1);
  return sprite;
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
  linkOpacity, linkThickness, nodeSizeScale, curvedLinks
}, ref) => {

  return (
    <ForceGraph3D
      ref={ref}
      graphData={graphData}
      backgroundColor="#020306"
      onNodeClick={handleNodeClick}
      enableNodeDrag={true}
      onNodeDragEnd={node => { node.fx = node.x; node.fy = node.y; node.fz = node.z; }}

      // Applies the Organic vs Straight curve toggle
      linkCurvature={link => {
        if (!curvedLinks) return 0;
        const sid = link.source.id || link.source;
        const tid = link.target.id || link.target;
        if (wormholeNodes.some(n => n.id === sid) && wormholeNodes.some(n => n.id === tid)) return 0;
        return 0.25;
      }}
      linkCurveRotation={getStableCurveRotation}

      nodeThreeObject={node => {
        if ((node.neighbors?.length || 0) < minConnections) return new THREE.Object3D();

        const isClique = clique.includes(node.id);
        const isSelected = selectedNode && node.id === selectedNode.id;
        const isScanning = scanningNode === node.id;
        const isDimmed = (selectedNode && !isSelected && !selectedNode.neighbors.includes(node.id)) || (clique.length > 0 && !isClique);

        const heatRatio = (node.neighbors?.length || 0) / maxConnections;
        let nodeColor = `rgb(${Math.floor(30 + 150 * heatRatio)}, ${Math.floor(80 + 80 * heatRatio)}, ${Math.floor(200 - 80 * heatRatio)})`;

        if (isClique) nodeColor = '#00ffff';
        else if (isScanning) nodeColor = '#ff3366';
        else if (isSelected) nodeColor = '#ff00ff';

        // Apply the global scale slider
        const baseSize = isClique || isSelected || isScanning ? 12 : 4 + (heatRatio * 6);
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
           const sprite = createTextSprite(`${node.id}`, isClique || isSelected || isScanning);
           sprite.position.y = finalSize + (6 * nodeSizeScale);
           group.add(sprite);
        }
        return group;
      }}

      linkColor={link => {
        const sid = link.source.id || link.source;
        const tid = link.target.id || link.target;
        if (wormholeNodes.some(n => n.id === sid) && wormholeNodes.some(n => n.id === tid)) return '#ff00ff';
        if (clique.includes(sid) && clique.includes(tid)) return '#00ffff';
        if (scanningNode === sid || scanningNode === tid) return 'rgba(255, 51, 102, 0.9)';

        const isDimmed = (selectedNode && !(sid === selectedNode.id || tid === selectedNode.id)) || (clique.length > 0 && !(clique.includes(sid) && clique.includes(tid)));

        // Dynamic opacity based on your slider
        const finalAlpha = isDimmed ? 0.05 : linkOpacity;
        return `rgba(80, 110, 200, ${finalAlpha})`;
      }}

      linkWidth={link => {
        const sid = link.source.id || link.source;
        const tid = link.target.id || link.target;

        // Base thickness multiplied by your slider
        let baseWidth = (scanningNode === sid || scanningNode === tid) ? 1.5 : 1.0;
        if (clique.includes(sid) && clique.includes(tid)) baseWidth = 2.5;

        return baseWidth * linkThickness;
      }}

      linkDirectionalParticles={link => {
        const sid = link.source.id || link.source;
        const tid = link.target.id || link.target;
        if (clique.includes(sid) && clique.includes(tid)) return 4;
        if (scanningNode === sid || scanningNode === tid) return 2;
        return 0;
      }}
      linkDirectionalParticleWidth={link => clique.length > 0 ? 3 : 2}
      linkDirectionalParticleSpeed={0.008}
      linkDirectionalParticleColor={link => {
        const sid = link.source.id || link.source;
        const tid = link.target.id || link.target;
        if (clique.includes(sid) && clique.includes(tid)) return '#ffffff';
        return '#ff3366';
      }}
    />
  );
});