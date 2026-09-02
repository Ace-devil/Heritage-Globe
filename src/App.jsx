import React, { useState } from 'react';
import GlobeView from './components/globeview.jsx';
import ExplorerModal from './components/ExplorerModal.jsx';
import './App.css';

function App() {
  const [selectedRegion, setSelectedRegion] = useState(null);

  return (
    <div className="app-container">
      {/* 1. Interactive 3D Globe Layer */}
      <GlobeView onSelectRegion={(regionKey) => setSelectedRegion(regionKey)} />

      {/* 2. Top Navigation Bar */}
      <header className="navbar">
        <div className="logo">BHĀRAT <span>HERITAGE</span></div>
        <div className="nav-actions">
          <button className="explore-btn" onClick={() => setSelectedRegion('coorg')}>
            Explore Heritage
          </button>
        </div>
      </header>

      {/* 3. Hero Text & Destination Selection Chips */}
      <div className="hero-content">
        <h1>Discover India’s Rich Culture</h1>
        <p>Explore traditional foods, heritage activities, and hidden gems.</p>

        <div className="quick-chips">
          <span>Featured Destinations:</span>
          <button onClick={() => setSelectedRegion('coorg')}>Coorg (Karnataka)</button>
          <button onClick={() => setSelectedRegion('ziro')}>Ziro Valley (Arunachal)</button>
          <button onClick={() => setSelectedRegion('rajasthan')}>Rajasthan</button>
          <button onClick={() => setSelectedRegion('kerala')}>Kerala</button>
        </div>
      </div>

      {/* 4. Cultural Information Modal */}
      {selectedRegion && (
        <ExplorerModal 
          regionKey={selectedRegion} 
          onClose={() => setSelectedRegion(null)} 
        />
      )}
    </div>
  );
}

export default App;