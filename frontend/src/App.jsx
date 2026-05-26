import React, { useState, useRef, useEffect, useCallback } from 'react';
import { forceLink } from 'd3-force';
import Sidebar from './components/Sidebar';
import GraphCanvas from './components/GraphCanvas';
import { parseGraphFile, generateBarabasiAlbert } from './utils/graphParser';

export default function App() {
  const fgRef = useRef();

  // App State
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [clique, setClique] = useState([]);
  const [kValue, setKValue] = useState(3);
  const [numNodes, setNumNodes] = useState(0);
  const [fileName, setFileName] = useState('');
  const [solverResult, setSolverResult] = useState(null); // "SAT", "UNSAT", or null

  // Interaction State
  const [selectedNode, setSelectedNode] = useState(null);
  const [wormholeNodes, setWormholeNodes] = useState([]);
  const [isSolving, setIsSolving] = useState(false);
  const [scanningNode, setScanningNode] = useState(null);

  // Settings & Physics
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [repulsion, setRepulsion] = useState(-150);
  const [minConnections, setMinConnections] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // --- NEW: Visual Customization States ---
  const [linkOpacity, setLinkOpacity] = useState(0.5);
  const [linkThickness, setLinkThickness] = useState(1.5);
  const [nodeSizeScale, setNodeSizeScale] = useState(1.0);
  const [curvedLinks, setCurvedLinks] = useState(true);

  // Generator State
  const [genNodes, setGenNodes] = useState(100);
  const [genEdges, setGenEdges] = useState(3);

  // Solver Animation Logic (Sonar Pathfinder)
  useEffect(() => {
    let interval;
    if (isSolving && graphData.nodes.length > 0) {
      let currentId = graphData.nodes[Math.floor(Math.random() * graphData.nodes.length)].id;
      interval = setInterval(() => {
        setScanningNode(currentId);
        const currentNode = graphData.nodes.find(n => n.id === currentId);

        if (fgRef.current && currentNode && Math.random() > 0.5) {
           fgRef.current.cameraPosition(
             { x: currentNode.x + 150, y: currentNode.y + 50, z: currentNode.z + 150 },
             currentNode, 1200
           );
        }

        if (currentNode && currentNode.neighbors.length > 0) {
          if (Math.random() > 0.2) {
            currentId = currentNode.neighbors[Math.floor(Math.random() * currentNode.neighbors.length)];
          } else {
            currentId = graphData.nodes[Math.floor(Math.random() * graphData.nodes.length)].id;
          }
        } else {
          currentId = graphData.nodes[Math.floor(Math.random() * graphData.nodes.length)].id;
        }
      }, 600);
    } else {
      setScanningNode(null);
    }
    return () => clearInterval(interval);
  }, [isSolving, graphData]);

  // Apply Physics Repulsion
  useEffect(() => {
    if (graphData.nodes.length > 0 && fgRef.current) {
      const chargeForce = fgRef.current.d3Force('charge');
      if (chargeForce) { chargeForce.strength(repulsion); fgRef.current.d3ReheatSimulation(); }
    }
  }, [repulsion, graphData.nodes.length]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const parsed = parseGraphFile(e.target.result);
      setGraphData({ nodes: parsed.nodes, links: parsed.links });
      setKValue(parsed.kValue); setNumNodes(parsed.maxNode);
      setClique([]); setSelectedNode(null);
    };
    reader.readAsText(file);
  };

  const handleGenerateGraph = () => {
    setFileName(`Synthetic Scale-Free (n=${genNodes})`);
    const generated = generateBarabasiAlbert(genNodes, genEdges);
    setGraphData({ nodes: generated.nodes, links: generated.links });
    setNumNodes(generated.maxNode);
    setKValue(generated.kValue);
    setClique([]);
    setSelectedNode(null);
    setScanningNode(null);

    // Zoom out slightly to see the new massive galaxy
    if (fgRef.current) {
        fgRef.current.cameraPosition({ x: 0, y: 150, z: genNodes * 4 }, { x: 0, y: 0, z: 0 }, 1500);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const targetId = Number.parseInt(searchQuery, 10);
    const targetNode = graphData.nodes.find(n => n.id === targetId);
    if (targetNode) {
      handleNodeClick(targetNode, { shiftKey: false });
      if (window.innerWidth < 768) setIsSidebarOpen(false);
    } else { alert("Node not found!"); }
  };

   const handleSolve = async () => {
     if (graphData.links.length === 0) return;
     setSelectedNode(null); setClique([]); setIsSolving(true); setSolverResult(null);

     try {
       const response = await fetch('http://localhost:5000/solve', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
           n: numNodes, k: kValue,
           edges: graphData.links.map(l => [l.source.id || l.source, l.target.id || l.target])
         })
       });
       const result = await response.json();

       if (result.status === "SAT") {
         setSolverResult("SAT");
         setClique(result.nodes);
         const targetNodes = graphData.nodes.filter(n => result.nodes.includes(n.id));
         if (targetNodes.length > 0 && fgRef.current) {
           let cx = 0, cy = 0, cz = 0;
           targetNodes.forEach(n => { cx += n.x; cy += n.y; cz += n.z; });
           const len = targetNodes.length;
           fgRef.current.cameraPosition({ x: (cx/len)+150, y: (cy/len)+100, z: (cz/len)+150 }, { x: cx/len, y: cy/len, z: cz/len }, 2000);
         }
       } else {
         setSolverResult("UNSAT");
       }
     } catch (error) { setSolverResult("ERROR"); } finally { setIsSolving(false); }
   };

  const handleNodeClick = useCallback((node, event) => {
      if (event && event.shiftKey) {
        setWormholeNodes(prev => {
          const ns = [...prev, node];
          if (ns.length === 2) {
             if (fgRef.current) {
               fgRef.current.d3Force('wormhole', forceLink().id(d => d.id).distance(150).strength(0.8).links([{ source: ns[0].id, target: ns[1].id }]));
               fgRef.current.d3ReheatSimulation();
             }
            setTimeout(() => { if (fgRef.current) fgRef.current.d3Force('wormhole', null); setWormholeNodes([]); }, 6000);
          }
          return ns;
        });
      } else {
        setSelectedNode(prev => (prev?.id === node.id ? null : node));
        if (fgRef.current) { fgRef.current.cameraPosition({ x: node.x + 100, y: node.y + 80, z: node.z + 100 }, node, 1200); }
      }
  }, []);

  const maxConnections = Math.max(1, ...graphData.nodes.map(n => n.neighbors?.length || 0));

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', background: '#020306' }}>
      <Sidebar
         isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}
         fileName={fileName} numNodes={numNodes}
         kValue={kValue} setKValue={setKValue}
         handleFileUpload={handleFileUpload} isSolving={isSolving} handleSolve={handleSolve}
         searchQuery={searchQuery} setSearchQuery={setSearchQuery} handleSearch={handleSearch}
         repulsion={repulsion} setRepulsion={setRepulsion}
         minConnections={minConnections} setMinConnections={setMinConnections}
         linkOpacity={linkOpacity} setLinkOpacity={setLinkOpacity}
         linkThickness={linkThickness} setLinkThickness={setLinkThickness}
         nodeSizeScale={nodeSizeScale} setNodeSizeScale={setNodeSizeScale}
         curvedLinks={curvedLinks} setCurvedLinks={setCurvedLinks}
         genNodes={genNodes} setGenNodes={setGenNodes}
         genEdges={genEdges} setGenEdges={setGenEdges} handleGenerateGraph={handleGenerateGraph}
         solverResult={solverResult} setSolverResult={setSolverResult} clique={clique}
       />

      <GraphCanvas
        ref={fgRef} graphData={graphData} clique={clique}
        selectedNode={selectedNode} minConnections={minConnections}
        wormholeNodes={wormholeNodes} handleNodeClick={handleNodeClick}
        scanningNode={scanningNode} maxConnections={maxConnections}
        linkOpacity={linkOpacity} linkThickness={linkThickness}
        nodeSizeScale={nodeSizeScale} curvedLinks={curvedLinks}
      />
    </div>
  );
}