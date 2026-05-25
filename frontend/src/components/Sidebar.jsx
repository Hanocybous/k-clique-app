import React from 'react';

export default function Sidebar({
  isSidebarOpen, setIsSidebarOpen, fileName, numNodes,
  kValue, setKValue, // <-- Make sure setKValue is received here
  handleFileUpload, searchQuery, setSearchQuery, handleSearch,
  repulsion, setRepulsion, minConnections, setMinConnections,
  isSolving, handleSolve,
  linkOpacity, setLinkOpacity, linkThickness, setLinkThickness,
  nodeSizeScale, setNodeSizeScale, curvedLinks, setCurvedLinks,
  genNodes, setGenNodes, genEdges, setGenEdges, handleGenerateGraph
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

        {/* Physics & Visuals */}
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

        <button disabled={isSolving} onClick={handleSolve}
          style={{ padding: '16px', background: isSolving ? '#333' : '#00ffff', color: isSolving ? '#888' : '#000', border: 'none', borderRadius: '8px', cursor: isSolving ? 'wait' : 'pointer', fontWeight: 'bold', width: '100%', fontSize: '1.05em', boxShadow: isSolving ? 'none' : '0 0 15px rgba(0, 255, 255, 0.4)' }}>
          {isSolving ? 'Scanning Topology...' : 'Run Z3 SAT Solver'}
        </button>
      </div>
    </>
  );
}