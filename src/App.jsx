import React, { useState, useRef } from 'react';
import GlobeView from './components/GlobeView.jsx';
import ExplorerModal from './components/ExplorerModal.jsx';
import HeritageChat from './components/HeritageChat.jsx';
import './App.css';

const FEATURED_CITIES = [
  { 
    key: 'coorg', 
    name: 'Coorg', 
    state: 'Karnataka', 
    desc: 'Coffee plantations & misty hills',
    img: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80'
  },
  { 
    key: 'ziro', 
    name: 'Ziro Valley', 
    state: 'Arunachal Pradesh', 
    desc: 'Apatani heritage & pine groves',
    img: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80'
  },
  { 
    key: 'rajasthan', 
    name: 'Rajasthan', 
    state: 'North India', 
    desc: 'Royal forts, palaces & deserts',
    img: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80'
  },
  { 
    key: 'kerala', 
    name: 'Kerala', 
    state: 'South India', 
    desc: 'Serene backwaters & spice gardens',
    img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80'
  },
  { 
    key: 'varanasi', 
    name: 'Varanasi', 
    state: 'Uttar Pradesh', 
    desc: 'Spiritual ghats along the Ganges',
    img: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=600&q=80'
  },
  { 
    key: 'hampi', 
    name: 'Hampi', 
    state: 'Karnataka', 
    desc: 'Ancient Vijayanagara temple ruins',
    img: 'https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=600&q=80'
  },
];

function App() {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const globeSectionRef = useRef(null);

  const scrollToGlobe = () => {
    globeSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="app-container">

      {/* Navigation Bar */}
      <header className="navbar">
        <div className="logo">
          BHĀRAT <span>HERITAGE</span>
        </div>

        <div className="nav-actions">
          <button className="explore-btn" onClick={scrollToGlobe}>
            Explore Globe ↓
          </button>
        </div>
      </header>

      {/* 🟢 PAGE 1: HERO LANDING & FEATURED CITIES */}
      <section className="hero-landing-page">

        <div className="hero-content">
          <h1>Discover India’s Rich Culture</h1>

          <p>
            Explore traditional foods, heritage activities, and hidden gems
            across iconic destinations.
          </p>
        </div>

        {/* 6 City Cards Grid */}
        <div className="city-cards-grid">

          {FEATURED_CITIES.map((city) => (

            <div 
              key={city.key} 
              className="city-card"
              onClick={() => setSelectedRegion(city.key)}
            >

              <div className="city-card-image-wrapper">
                <img
                  src={city.img}
                  alt={city.name}
                  className="city-card-image"
                />
              </div>

              <div className="city-card-content">

                <h3>{city.name}</h3>

                <span className="city-state">
                  {city.state}
                </span>

                <p>
                  {city.desc}
                </p>

                <span className="card-action">
                  View Details →
                </span>

              </div>

            </div>

          ))}

        </div>

        <button
          className="scroll-down-btn"
          onClick={scrollToGlobe}
        >
          Or Scroll Down to Explore the 3D Globe ↓
        </button>

      </section>

      {/* 🌐 PAGE 2: 3D GLOBE SECTION */}
      <section
        ref={globeSectionRef}
        className="globe-section"
      >
        <GlobeView
          onSelectRegion={(regionKey) =>
            setSelectedRegion(regionKey)
          }
        />
      </section>

      {/* Cultural Information Modal */}
      {selectedRegion && (
        <ExplorerModal 
          regionKey={selectedRegion} 
          onClose={() => setSelectedRegion(null)} 
        />
      )}

      {/* 🤖 HERITAGE AI CHATBOX */}
      <HeritageChat />

    </div>
  );
}

export default App;