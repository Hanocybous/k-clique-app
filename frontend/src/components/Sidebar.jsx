import React from 'react';

export default function Sidebar({
  isSidebarOpen, setIsSidebarOpen, fileName, numNodes,
  kValue, setKValue,
  handleFileUpload, searchQuery, setSearchQuery, handleSearch,
  repulsion, setRepulsion, minConnections, setMinConnections,
  isSolving, handleSolve,
  linkOpacity, setLinkOpacity, linkThickness, setLinkThickness,
  nodeSizeScale, setNodeSizeScale, curvedLinks, setCurvedLinks,
  genNodes, setGenNodes, genEdges, setGenEdges, handleGenerateGraph,
  solverResult, setSolverResult, clique,
  isCinematic, setIsCinematic
}) {
  const glassPanelStyle = {
    position: 'absolute', top: 0, left: isSidebarOpen ? 0 : '-380px', width: '360px', height: '100vh',
    background: 'rgba(12, 14, 20, 0.95)', borderRight: '1px solid rgba(255, 255, 255, 0.08)',
    zIndex: 50, padding: '72px 24px 24px 24px', transition: 'left 0.4s', color: '#eaf6ff', overflowY: 'auto',
    fontFamily: 'system-ui, sans-serif'
  };

  const sectionLabelStyle = { fontSize: '0.75em', color: '#6b8cae', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px', fontWeight: 'bold' };

  return (
    <>
      <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        style={{ position: 'absolute', top: 18, left: 18, zIndex: 60, padding: '10px 14px', background: '#11141c', border: '1px solid #3a506b', color: '#00ffff', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
        {isSidebarOpen ? '◀ MENU' : '☰ MENU'}
      </button>

      <div style={glassPanelStyle}>
        <h2 style={{ margin: '0 0 20px 0', color: '#00ffff', fontSize: '1.4em' }}>Network Command</h2>

        {/* SYNTHETIC GENERATOR */}
        <div style={{ marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <label style={sectionLabelStyle}>0. Generate Synthetic Data</label>
            <p style={{ fontSize: '0.75em', color: '#8fe8ff', marginBottom: '10px', fontStyle: 'italic' }}>
              Barabási–Albert model (Scale-Free Topology).
            </p>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '0.8em', color: '#9fbfdc' }}>Total Nodes</span>
                    <input type="number" value={genNodes} onChange={e => setGenNodes(Number(e.target.value))} style={{ width: '100%', padding: '6px', background: '#1c212e', border: 'none', color: '#fff', borderRadius: '4px' }} />
                </div>
                <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '0.8em', color: '#9fbfdc' }}>Edges/Node</span>
                    <input type="number" value={genEdges} onChange={e => setGenEdges(Number(e.target.value))} style={{ width: '100%', padding: '6px', background: '#1c212e', border: 'none', color: '#fff', borderRadius: '4px' }} />
                </div>
            </div>
            <button onClick={handleGenerateGraph} style={{ padding: '10px', background: 'rgba(0, 255, 255, 0.1)', color: '#00ffff', border: '1px solid #00ffff', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', width: '100%', transition: '0.2s' }}>
                Generate Network
            </button>
        </div>

        {/* Data Source */}
        <div style={{ marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <label style={sectionLabelStyle}>1. Data Source</label>
            <label style={{ display: 'block', padding: '14px', background: 'rgba(42, 167, 255, 0.1)', border: '1px dashed #2aa7ff', borderRadius: '6px', textAlign: 'center', cursor: 'pointer', color: '#8fe8ff' }}>
              {fileName ? `📄 ${fileName}` : "📁 Upload Graph File (.txt)"}
              <input type="file" accept=".txt" onChange={handleFileUpload} style={{ display: 'none' }} />
            </label>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '0.9em' }}>
                <span>Total Nodes Loaded: <strong>{numNodes}</strong></span>
            </div>
        </div>

        {/* Search */}
        <div style={{ marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <label style={sectionLabelStyle}>2. Find Node</label>
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
                <input type="number" placeholder="Enter ID..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ flex: 1, padding: '8px', background: '#1c212e', border: 'none', color: '#fff', borderRadius: '4px' }} />
                <button type="submit" style={{ padding: '0 16px', background: '#3a506b', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>GO</button>
             </form>
         </div>

         {/* CINEMATIC DEMO BUTTON */}
         <div style={{ marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
             <label style={sectionLabelStyle}>🎬 Presentation Mode</label>
             <button 
               disabled={isCinematic} 
               onClick={() => setIsCinematic(true)}
               style={{ 
                 padding: '12px', 
                 background: isCinematic ? '#333' : 'rgba(255, 100, 200, 0.15)', 
                 color: isCinematic ? '#888' : '#ff64c8', 
                 border: '1px solid rgba(255, 100, 200, 0.5)', 
                 borderRadius: '6px', 
                 cursor: isCinematic ? 'wait' : 'pointer', 
                 fontWeight: 'bold', 
                 width: '100%',
                 transition: '0.2s'
               }}
             >
               {isCinematic ? '🎥 Cinematic Show In Progress...' : '▶ Start Cinematic Demo'}
             </button>
             <p style={{ fontSize: '0.75em', color: '#8fe8ff', marginTop: '8px', marginBottom: '0', fontStyle: 'italic' }}>
               Auto-guided tour through the graph with smooth camera movements
             </p>
         </div>

         
        <div style={{ marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <label style={sectionLabelStyle}>3. Universe Physics</label>
            <span style={{ fontSize: '0.85em', color: '#9fbfdc' }}>Gravity Repulsion: {repulsion}</span>
            <input type="range" min="-500" max="-10" value={repulsion} onChange={e => setRepulsion(Number(e.target.value))} style={{ width: '100%', marginBottom: '10px' }} />

            <span style={{ fontSize: '0.85em', color: minConnections > 0 ? '#00ffff' : '#9fbfdc' }}>Hide Connections &lt; {minConnections}</span>
            <input type="range" min="0" max="10" value={minConnections} onChange={e => setMinConnections(Number(e.target.value))} style={{ width: '100%', marginBottom: '15px' }} />

            <label style={sectionLabelStyle}>4. Visuals & Theme</label>
            <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85em', marginBottom: '10px', color: '#9fbfdc' }}>
                Use Curved Links
                <input type="checkbox" checked={curvedLinks} onChange={e => setCurvedLinks(e.target.checked)} />
            </label>

            <span style={{ fontSize: '0.85em', color: '#9fbfdc' }}>Edge Opacity: {linkOpacity.toFixed(1)}</span>
            <input type="range" min="0.1" max="1.0" step="0.1" value={linkOpacity} onChange={e => setLinkOpacity(Number(e.target.value))} style={{ width: '100%', marginBottom: '10px' }} />

            <span style={{ fontSize: '0.85em', color: '#9fbfdc' }}>Node Size Scale: {nodeSizeScale.toFixed(1)}x</span>
            <input type="range" min="0.5" max="3.0" step="0.1" value={nodeSizeScale} onChange={e => setNodeSizeScale(Number(e.target.value))} style={{ width: '100%' }} />
        </div>

        {/* NEW: Z3 SOLVER PARAMETERS */}
        <div style={{ marginBottom: '30px' }}>
            <label style={sectionLabelStyle}>5. Z3 Algorithm Parameters</label>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <span style={{ fontSize: '0.9em', color: '#9fbfdc' }}>Target Clique Size (<i style={{color:'#ff00ff'}}>k</i>):</span>
               <strong style={{ color: '#ff00ff', fontSize: '1.2em' }}>{kValue}</strong>
            </div>
            <input
               type="range"
               min="2"
               max="20"
               value={kValue}
               onChange={e => setKValue(Number(e.target.value))}
               style={{ width: '100%', marginTop: '8px', cursor: 'pointer' }}
            />
            <p style={{ fontSize: '0.7em', color: '#6b8cae', marginTop: '5px' }}>
               Warning: High <i style={{color:'#ff00ff'}}>k</i> values exponentially increase SAT complexity.
            </p>
         </div>

         {/* SOLVER RESULT DISPLAY */}
         {solverResult && (
           <div style={{
             marginBottom: '15px',
             padding: '16px',
             borderRadius: '8px',
             background: solverResult === 'SAT'
               ? 'rgba(0, 255, 100, 0.15)'
               : solverResult === 'UNSAT'
               ? 'rgba(255, 100, 100, 0.15)'
               : 'rgba(255, 200, 0, 0.15)',
             border: solverResult === 'SAT'
               ? '1px solid rgba(0, 255, 100, 0.5)'
               : solverResult === 'UNSAT'
               ? '1px solid rgba(255, 100, 100, 0.5)'
               : '1px solid rgba(255, 200, 0, 0.5)',
             color: solverResult === 'SAT'
               ? '#00ff64'
               : solverResult === 'UNSAT'
               ? '#ff6464'
               : '#ffc800'
           }}>
             {solverResult === 'SAT' && (
               <>
                 <div style={{ fontSize: '1em', fontWeight: 'bold', marginBottom: '8px' }}>SATISFIABLE</div>
                 <div style={{ fontSize: '0.9em', marginBottom: '8px' }}>
                   Found a {kValue}-clique!
                 </div>
                 <div style={{ fontSize: '0.85em', fontFamily: 'monospace', background: 'rgba(0, 0, 0, 0.3)', padding: '8px', borderRadius: '4px' }}>
                   Nodes: {clique.sort((a, b) => a - b).join(', ')}
                 </div>
                 <button
                   onClick={() => setSolverResult(null)}
                   style={{ marginTop: '10px', fontSize: '0.8em', padding: '6px 12px', background: 'rgba(0, 255, 100, 0.2)', border: '1px solid rgba(0, 255, 100, 0.5)', color: '#00ff64', borderRadius: '4px', cursor: 'pointer' }}
                 >
                   Dismiss
                 </button>
               </>
             )}
             {solverResult === 'UNSAT' && (
               <>
                 <div style={{ fontSize: '1em', fontWeight: 'bold', marginBottom: '8px' }}>UNSATISFIABLE</div>
                 <div style={{ fontSize: '0.9em' }}>
                   No {kValue}-clique exists in this graph.
                 </div>
                 <p style={{ fontSize: '0.75em', color: '#ddd', marginTop: '8px', marginBottom: '0' }}>
                   Try lowering <i style={{color:'#ff00ff'}}>k</i> or loading a larger graph.
                 </p>
                 <button
                   onClick={() => setSolverResult(null)}
                   style={{ marginTop: '10px', fontSize: '0.8em', padding: '6px 12px', background: 'rgba(255, 100, 100, 0.2)', border: '1px solid rgba(255, 100, 100, 0.5)', color: '#ff6464', borderRadius: '4px', cursor: 'pointer' }}
                 >
                   Dismiss
                 </button>
               </>
             )}
             {solverResult === 'ERROR' && (
               <>
                 <div style={{ fontSize: '1em', fontWeight: 'bold', marginBottom: '8px' }}>⚠️ ERROR</div>
                 <div style={{ fontSize: '0.9em' }}>
                   Backend offline or connection error.
                 </div>
                 <p style={{ fontSize: '0.75em', color: '#ddd', marginTop: '8px', marginBottom: '0' }}>
                   Make sure the backend is running on port 5000.
                 </p>
                 <button
                   onClick={() => setSolverResult(null)}
                   style={{ marginTop: '10px', fontSize: '0.8em', padding: '6px 12px', background: 'rgba(255, 200, 0, 0.2)', border: '1px solid rgba(255, 200, 0, 0.5)', color: '#ffc800', borderRadius: '4px', cursor: 'pointer' }}
                 >
                   Dismiss
                 </button>
               </>
             )}
           </div>
         )}

         <button disabled={isSolving} onClick={handleSolve}
           style={{ padding: '16px', background: isSolving ? '#333' : '#00ffff', color: isSolving ? '#888' : '#000', border: 'none', borderRadius: '8px', cursor: isSolving ? 'wait' : 'pointer', fontWeight: 'bold', width: '100%', fontSize: '1.05em', boxShadow: isSolving ? 'none' : '0 0 15px rgba(0, 255, 255, 0.4)' }}>
           {isSolving ? 'Scanning Topology...' : 'Run Z3 SAT Solver'}
         </button>
      </div>
    </>
  );
}