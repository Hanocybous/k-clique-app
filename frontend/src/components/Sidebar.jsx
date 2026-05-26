import React from 'react';

function Sidebar({
  isSidebarOpen, setIsSidebarOpen, fileName, numNodes,
  kValue, setKValue,
  handleFileUpload, searchQuery, setSearchQuery, handleSearch,
  repulsion, setRepulsion, minConnections, setMinConnections,
  isSolving, handleSolve,
  linkOpacity, setLinkOpacity, linkThickness, setLinkThickness,
  nodeSizeScale, setNodeSizeScale, curvedLinks, setCurvedLinks,
  genNodes, setGenNodes, genEdges, setGenEdges, handleGenerateGraph,
  solverResult, setSolverResult, clique,
  isCinematic, setIsCinematic,
  layoutType, setLayoutType,
  colorScheme, setColorScheme,
  isDarkMode, setIsDarkMode
}) {
  const glassPanelStyle = {
    position: 'absolute', top: 0, left: isSidebarOpen ? 0 : '-380px', width: '360px', height: '100vh',
    background: isDarkMode ? 'rgba(12, 14, 20, 0.95)' : 'rgba(240, 242, 247, 0.98)',
    borderRight: isDarkMode ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.1)',
    zIndex: 50, padding: '72px 24px 24px 24px', transition: 'left 0.4s', 
    color: isDarkMode ? '#eaf6ff' : '#1a1a2e', overflowY: 'auto',
    fontFamily: 'system-ui, sans-serif'
  };

  const sectionLabelStyle = { 
    fontSize: '0.75em', 
    color: isDarkMode ? '#6b8cae' : '#5a7a9e', 
    textTransform: 'uppercase', 
    letterSpacing: '1px', 
    display: 'block', 
    marginBottom: '8px', 
    fontWeight: 'bold' 
  };

  return (
    <>
      <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        style={{ position: 'absolute', top: 18, left: 18, zIndex: 60, padding: '10px 14px', background: isDarkMode ? '#11141c' : '#e5e8ed', border: isDarkMode ? '1px solid #3a506b' : '1px solid #ccc', color: isDarkMode ? '#00ffff' : '#0066aa', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
        {isSidebarOpen ? '◀ MENU' : '☰ MENU'}
      </button>

      <button onClick={() => setIsDarkMode(!isDarkMode)}
        style={{ position: 'absolute', top: 18, right: 18, zIndex: 60, padding: '10px 14px', background: isDarkMode ? '#11141c' : '#e5e8ed', border: isDarkMode ? '1px solid #3a506b' : '1px solid #ccc', color: isDarkMode ? '#ff9900' : '#ff6600', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
        {isDarkMode ? 'LIGHT' : 'DARK'}
      </button>

      <div style={glassPanelStyle}>
        <h2 style={{ margin: '0 0 20px 0', color: isDarkMode ? '#00ffff' : '#0066aa', fontSize: '1.4em' }}>Social Network Menu</h2>

        {/* SYNTHETIC GENERATOR */}
         <div style={{ marginBottom: '25px', paddingBottom: '15px', borderBottom: isDarkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.1)' }}>
             <label style={sectionLabelStyle}>0. Generate Synthetic Data</label>
             <p style={{ fontSize: '0.75em', color: isDarkMode ? '#8fe8ff' : '#5a7a9e', marginBottom: '10px', fontStyle: 'italic' }}>
               Barabási–Albert model (Scale-Free Topology).
             </p>
             <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                 <div style={{ flex: 1 }}>
                     <span style={{ fontSize: '0.8em', color: isDarkMode ? '#9fbfdc' : '#6a8cab' }}>Total Nodes</span>
                     <input type="number" value={genNodes} onChange={e => setGenNodes(Number(e.target.value))} style={{ width: '100%', padding: '6px', background: isDarkMode ? '#1c212e' : '#f0f0f5', border: isDarkMode ? 'none' : '1px solid #ccc', color: isDarkMode ? '#fff' : '#000', borderRadius: '4px' }} />
                 </div>
                 <div style={{ flex: 1 }}>
                     <span style={{ fontSize: '0.8em', color: isDarkMode ? '#9fbfdc' : '#6a8cab' }}>Edges/Node</span>
                     <input type="number" value={genEdges} onChange={e => setGenEdges(Number(e.target.value))} style={{ width: '100%', padding: '6px', background: isDarkMode ? '#1c212e' : '#f0f0f5', border: isDarkMode ? 'none' : '1px solid #ccc', color: isDarkMode ? '#fff' : '#000', borderRadius: '4px' }} />
                 </div>
             </div>
             <button onClick={handleGenerateGraph} style={{ padding: '10px', background: isDarkMode ? 'rgba(0, 255, 255, 0.1)' : 'rgba(0, 150, 200, 0.1)', color: isDarkMode ? '#00ffff' : '#0066aa', border: isDarkMode ? '1px solid #00ffff' : '1px solid #0066aa', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', width: '100%', transition: '0.2s' }}>
                 Generate Network
             </button>
        </div>

         {/* Data Source */}
         <div style={{ marginBottom: '25px', paddingBottom: '15px', borderBottom: isDarkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.1)' }}>
             <label style={sectionLabelStyle}>1. Data Source</label>
             <label style={{ display: 'block', padding: '14px', background: isDarkMode ? 'rgba(42, 167, 255, 0.1)' : 'rgba(100, 180, 255, 0.1)', border: isDarkMode ? '1px dashed #2aa7ff' : '1px dashed #0066aa', borderRadius: '6px', textAlign: 'center', cursor: 'pointer', color: isDarkMode ? '#8fe8ff' : '#0066aa' }}>
               {fileName ? `📄 ${fileName}` : "Upload Graph File (.txt)"}
               <input type="file" accept=".txt" onChange={handleFileUpload} style={{ display: 'none' }} />
             </label>
             <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '0.9em' }}>
                 <span>Total Nodes Loaded: <strong>{numNodes}</strong></span>
             </div>
         </div>

         {/* Search */}
         <div style={{ marginBottom: '25px', paddingBottom: '15px', borderBottom: isDarkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.1)' }}>
             <label style={sectionLabelStyle}>2. Find Node</label>
             <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
                 <input type="number" placeholder="Enter ID..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ flex: 1, padding: '8px', background: isDarkMode ? '#1c212e' : '#f0f0f5', border: isDarkMode ? 'none' : '1px solid #ccc', color: isDarkMode ? '#fff' : '#000', borderRadius: '4px' }} />
                 <button type="submit" style={{ padding: '0 16px', background: isDarkMode ? '#3a506b' : '#c0d8f0', color: isDarkMode ? '#fff' : '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>GO</button>
              </form>
          </div>

          {/* CINEMATIC DEMO BUTTON */}
          <div style={{ marginBottom: '25px', paddingBottom: '15px', borderBottom: isDarkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.1)' }}>
              <label style={sectionLabelStyle}>3. Presentation Mode</label>
              <button 
                disabled={isCinematic} 
                onClick={() => setIsCinematic(true)}
                style={{ 
                  padding: '12px', 
                  background: isCinematic ? (isDarkMode ? '#333' : '#ddd') : (isDarkMode ? 'rgba(255, 100, 200, 0.15)' : 'rgba(255, 150, 200, 0.2)'), 
                  color: isCinematic ? (isDarkMode ? '#888' : '#999') : (isDarkMode ? '#ff64c8' : '#cc0066'), 
                  border: isDarkMode ? '1px solid rgba(255, 100, 200, 0.5)' : '1px solid rgba(200, 80, 150, 0.5)', 
                  borderRadius: '6px', 
                  cursor: isCinematic ? 'wait' : 'pointer', 
                  fontWeight: 'bold', 
                  width: '100%',
                  transition: '0.2s'
                }}
              >
                {isCinematic ? 'Cinematic In Progress...' : '▶ Start Cinematic Demo'}
              </button>
              <p style={{ fontSize: '0.75em', color: isDarkMode ? '#8fe8ff' : '#5a7a9e', marginTop: '8px', marginBottom: '0', fontStyle: 'italic' }}>
                Auto-guided tour through the graph with smooth camera movements
              </p>
          </div>

          {/* GRAPH LAYOUTS & COLOR SCHEMES */}
          <div style={{ marginBottom: '25px', paddingBottom: '15px', borderBottom: isDarkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.1)' }}>
              <label style={sectionLabelStyle}>4. Graph Layouts</label>
              <select
                value={layoutType}
                onChange={(e) => setLayoutType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  background: isDarkMode ? '#1c212e' : '#e5e8ed',
                  border: isDarkMode ? 'none' : '1px solid #ccc',
                  color: isDarkMode ? '#fff' : '#000',
                  borderRadius: '4px',
                  marginBottom: '12px',
                  cursor: 'pointer'
                }}
              >
                <option value="force">Force-Directed</option>
                <option value="circular">Circular</option>
                <option value="grid">Grid</option>
                <option value="hierarchical">Hierarchical</option>
              </select>
              <p style={{ fontSize: '0.75em', color: isDarkMode ? '#8fe8ff' : '#5a7a9e', marginBottom: '0', fontStyle: 'italic' }}>
                Choose how nodes are positioned
              </p>
          </div>

          {/* COLOR SCHEMES */}
          <div style={{ marginBottom: '25px', paddingBottom: '15px', borderBottom: isDarkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.1)' }}>
              <label style={sectionLabelStyle}>5. Node Color Heatmap</label>
              <select
                value={colorScheme}
                onChange={(e) => setColorScheme(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  background: isDarkMode ? '#1c212e' : '#e5e8ed',
                  border: isDarkMode ? 'none' : '1px solid #ccc',
                  color: isDarkMode ? '#fff' : '#000',
                  borderRadius: '4px',
                  marginBottom: '12px',
                  cursor: 'pointer'
                }}
              >
                <option value="degree">Degree Centrality</option>
                <option value="betweenness">Betweenness</option>
                <option value="closeness">Closeness</option>
                <option value="clustering">Clustering Coef.</option>
              </select>
              <p style={{ fontSize: '0.75em', color: isDarkMode ? '#8fe8ff' : '#5a7a9e', marginBottom: '0', fontStyle: 'italic' }}>
                Color nodes by network importance
              </p>
          </div>

          <div style={{ marginBottom: '25px', paddingBottom: '15px', borderBottom: isDarkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.1)' }}>
             <label style={sectionLabelStyle}>6. Universe Physics</label>
             <span style={{ fontSize: '0.85em', color: isDarkMode ? '#9fbfdc' : '#6a8cab' }}>Gravity Repulsion: {repulsion}</span>
             <input type="range" min="-500" max="-10" value={repulsion} onChange={e => setRepulsion(Number(e.target.value))} style={{ width: '100%', marginBottom: '10px' }} />

             <span style={{ fontSize: '0.85em', color: minConnections > 0 ? (isDarkMode ? '#00ffff' : '#0066aa') : (isDarkMode ? '#9fbfdc' : '#6a8cab') }}>Hide Connections &lt; {minConnections}</span>
             <input type="range" min="0" max="10" value={minConnections} onChange={e => setMinConnections(Number(e.target.value))} style={{ width: '100%', marginBottom: '15px' }} />

             <label style={sectionLabelStyle}>7. Visuals & Theme</label>
             <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85em', marginBottom: '10px', color: isDarkMode ? '#9fbfdc' : '#6a8cab' }}>
                 Use Curved Links
                 <input type="checkbox" checked={curvedLinks} onChange={e => setCurvedLinks(e.target.checked)} />
             </label>

             <span style={{ fontSize: '0.85em', color: isDarkMode ? '#9fbfdc' : '#6a8cab' }}>Edge Opacity: {linkOpacity.toFixed(1)}</span>
             <input type="range" min="0.1" max="1.0" step="0.1" value={linkOpacity} onChange={e => setLinkOpacity(Number(e.target.value))} style={{ width: '100%', marginBottom: '10px' }} />

             <span style={{ fontSize: '0.85em', color: isDarkMode ? '#9fbfdc' : '#6a8cab' }}>Node Size Scale: {nodeSizeScale.toFixed(1)}x</span>
             <input type="range" min="0.5" max="3.0" step="0.1" value={nodeSizeScale} onChange={e => setNodeSizeScale(Number(e.target.value))} style={{ width: '100%' }} />
         </div>

        {/* NEW: Z3 SOLVER PARAMETERS */}
        <div style={{ marginBottom: '30px' }}>
            <label style={sectionLabelStyle}>8. Z3 Algorithm Parameters</label>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <span style={{ fontSize: '0.9em', color: isDarkMode ? '#9fbfdc' : '#6a8cab' }}>Target Clique Size (<i style={{color:'#ff00ff'}}>k</i>):</span>
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
            <p style={{ fontSize: '0.7em', color: isDarkMode ? '#6b8cae' : '#8a9ab8', marginTop: '5px' }}>
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
                ? (isDarkMode ? 'rgba(0, 255, 100, 0.15)' : 'rgba(0, 200, 100, 0.15)')
                : solverResult === 'UNSAT'
                ? (isDarkMode ? 'rgba(255, 100, 100, 0.15)' : 'rgba(255, 80, 80, 0.15)')
                : (isDarkMode ? 'rgba(255, 200, 0, 0.15)' : 'rgba(255, 180, 0, 0.15)'),
              border: solverResult === 'SAT'
                ? (isDarkMode ? '1px solid rgba(0, 255, 100, 0.5)' : '1px solid rgba(0, 150, 80, 0.7)')
                : solverResult === 'UNSAT'
                ? (isDarkMode ? '1px solid rgba(255, 100, 100, 0.5)' : '1px solid rgba(200, 60, 60, 0.7)')
                : (isDarkMode ? '1px solid rgba(255, 200, 0, 0.5)' : '1px solid rgba(200, 150, 0, 0.7)'),
              color: solverResult === 'SAT'
                ? (isDarkMode ? '#00ff64' : '#00aa44')
                : solverResult === 'UNSAT'
                ? (isDarkMode ? '#ff6464' : '#cc3333')
                : (isDarkMode ? '#ffc800' : '#cc8800')
            }}>
             {solverResult === 'SAT' && (
               <>
                 <div style={{ fontSize: '1em', fontWeight: 'bold', marginBottom: '8px' }}>SATISFIABLE</div>
                 <div style={{ fontSize: '0.9em', marginBottom: '8px' }}>
                   Found a {kValue}-clique!
                 </div>
                  <div style={{ fontSize: '0.85em', fontFamily: 'monospace', background: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.5)', padding: '8px', borderRadius: '4px' }}>
                    Nodes: {clique.sort((a, b) => a - b).join(', ')}
                  </div>
                  <button
                    onClick={() => setSolverResult(null)}
                    style={{ marginTop: '10px', fontSize: '0.8em', padding: '6px 12px', background: isDarkMode ? 'rgba(0, 255, 100, 0.2)' : 'rgba(0, 200, 100, 0.2)', border: isDarkMode ? '1px solid rgba(0, 255, 100, 0.5)' : '1px solid rgba(0, 150, 80, 0.7)', color: isDarkMode ? '#00ff64' : '#00aa44', borderRadius: '4px', cursor: 'pointer' }}
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
                  <p style={{ fontSize: '0.75em', color: isDarkMode ? '#ddd' : '#333', marginTop: '8px', marginBottom: '0' }}>
                    Try lowering <i style={{color:'#ff00ff'}}>k</i> or loading a larger graph.
                  </p>
                  <button
                    onClick={() => setSolverResult(null)}
                    style={{ marginTop: '10px', fontSize: '0.8em', padding: '6px 12px', background: isDarkMode ? 'rgba(255, 100, 100, 0.2)' : 'rgba(255, 80, 80, 0.2)', border: isDarkMode ? '1px solid rgba(255, 100, 100, 0.5)' : '1px solid rgba(200, 60, 60, 0.7)', color: isDarkMode ? '#ff6464' : '#cc3333', borderRadius: '4px', cursor: 'pointer' }}
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
                  <p style={{ fontSize: '0.75em', color: isDarkMode ? '#ddd' : '#333', marginTop: '8px', marginBottom: '0' }}>
                    Make sure the backend is running on port 5000.
                  </p>
                  <button
                    onClick={() => setSolverResult(null)}
                    style={{ marginTop: '10px', fontSize: '0.8em', padding: '6px 12px', background: isDarkMode ? 'rgba(255, 200, 0, 0.2)' : 'rgba(255, 180, 0, 0.2)', border: isDarkMode ? '1px solid rgba(255, 200, 0, 0.5)' : '1px solid rgba(200, 150, 0, 0.7)', color: isDarkMode ? '#ffc800' : '#cc8800', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Dismiss
                  </button>
                </>
              )}
           </div>
         )}

          <button disabled={isSolving} onClick={handleSolve}
            style={{ padding: '16px', background: isSolving ? (isDarkMode ? '#333' : '#ddd') : (isDarkMode ? '#00ffff' : '#0066aa'), color: isSolving ? (isDarkMode ? '#888' : '#999') : (isDarkMode ? '#000' : '#fff'), border: 'none', borderRadius: '8px', cursor: isSolving ? 'wait' : 'pointer', fontWeight: 'bold', width: '100%', fontSize: '1.05em', boxShadow: isSolving ? 'none' : (isDarkMode ? '0 0 15px rgba(0, 255, 255, 0.4)' : '0 0 15px rgba(0, 100, 200, 0.3)') }}>
            {isSolving ? 'Scanning Topology...' : 'Run Z3 SAT Solver'}
          </button>
      </div>
    </>
  );
}

export default React.memo(Sidebar);
