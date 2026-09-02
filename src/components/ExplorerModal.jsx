import React, { useState } from 'react';
import { heritageData } from '/src/data/heritageData.js';
import './ExplorerModal.css';

export default function ExplorerModal({ regionKey, onClose }) {
  const [activeTab, setActiveTab] = useState('loved');
  const data = heritageData[regionKey] || heritageData.coorg;

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <button className="close-btn" onClick={onClose}>✕</button>
        
        <div 
          className="modal-header" 
          style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.8)), url(${data.banner})` }}
        >
          <h2>{data.title}</h2>
          <p>{data.subtitle}</p>
        </div>

        <nav className="tab-nav">
          <button className={activeTab === 'loved' ? 'active' : ''} onClick={() => setActiveTab('loved')}>❤️ Most Loved</button>
          <button className={activeTab === 'underrated' ? 'active' : ''} onClick={() => setActiveTab('underrated')}>💎 Hidden Gems</button>
          <button className={activeTab === 'food' ? 'active' : ''} onClick={() => setActiveTab('food')}>🍛 Food</button>
          <button className={activeTab === 'activities' ? 'active' : ''} onClick={() => setActiveTab('activities')}>🎭 Traditions</button>
        </nav>

        <div className="tab-content">
          {activeTab === 'loved' && (
            <div className="card-grid">
              {data.mostLoved.map((item, idx) => (
                <div key={idx} className="info-card">
                  <h4>{item.name}</h4>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'underrated' && (
            <div className="card-grid">
              {data.underrated.map((item, idx) => (
                <div key={idx} className="info-card highlight-card">
                  <span className="badge">Underrated</span>
                  <h4>{item.name}</h4>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'food' && (
            <div className="card-grid">
              {data.food.map((item, idx) => (
                <div key={idx} className="info-card">
                  <h4>{item.name}</h4>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'activities' && (
            <div className="card-grid">
              {data.activities.map((item, idx) => (
                <div key={idx} className="info-card">
                  <h4>{item.name}</h4>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}