import React, { useState } from 'react';

const REGION_DATA = {
  coorg: {
    title: 'Coorg (Kodagu)',
    subtitle: 'Karnataka • Scotland of India & Warrior Heritage',
    bannerImg: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80',
    categories: {
      'Most Loved': [
        { name: 'Abbey Falls', desc: 'A roaring waterfall nestled within private coffee estates and spice plantations.' },
        { name: 'Raja’s Seat', desc: 'Historic sunset view garden where the Kings of Kodagu used to watch the valleys.' }
      ],
      'Hidden Gems': [
        { name: 'Mandalpatti Peak', desc: 'An offbeat hilltop offering panoramic views of the Western Ghats range.' },
        { name: 'Chelavara Falls', desc: 'A natural waterfall shaped like a tortoise surrounded by dense greenery.' }
      ],
      'Food': [
        { name: 'Pandi Curry', desc: 'Traditional Coorgi pork curry slow-cooked with local dark vinegar (Kachampuli).' },
        { name: 'Kadambuttu', desc: 'Steamed rice dumplings served alongside rich regional curries.' }
      ],
      'Traditions': [
        { name: 'Kailpodh Festival', desc: 'Harvest festival celebrating arms, weaponry, and agrarian traditions.' },
        { name: 'Kupya & Chale', desc: 'Traditional ceremonial attire worn by Kodava men during festivities.' }
      ]
    }
  },
  ziro: {
    title: 'Ziro Valley',
    subtitle: 'Arunachal Pradesh • Sustainable Paddy & Apatani Heritage',
    bannerImg: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    categories: {
      'Most Loved': [
        { name: 'Apatani Cultural Landscape', desc: 'UNESCO nominee valley known for eco-friendly paddy and fish farming.' },
        { name: 'Ziro Music Festival', desc: 'Famous outdoor music festival celebrating independent artists across India.' }
      ],
      'Hidden Gems': [
        { name: 'Tarin Fish Farm', desc: 'High-altitude fish breeding farm showcasing integrated fish-paddy farming.' },
        { name: 'Kardo Forest', desc: 'Home to a giant naturally formed Shiva Lingam structure.' }
      ],
      'Food': [
        { name: 'Pike Pila', desc: 'Traditional local dish made of pork, bamboo shoots, and natural alkali water.' },
        { name: 'Apong', desc: 'Locally brewed organic rice beer served during cultural events.' }
      ],
      'Traditions': [
        { name: 'Myoko Festival', desc: 'Apatani spring festival celebrating friendship, agriculture, and nature.' },
        { name: 'Tattoo Art & Nose Plugs', desc: 'Historical cultural markers practiced by senior Apatani women.' }
      ]
    }
  },
  rajasthan: {
    title: 'Rajasthan',
    subtitle: 'North India • Royal Forts, Palaces & Desert Culture',
    bannerImg: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    categories: {
      'Most Loved': [
        { name: 'Amer Fort (Jaipur)', desc: 'Majestic hilltop palace featuring intricate Rajput architecture and mirror halls.' },
        { name: 'Thar Desert Dunes', desc: 'Golden sands offering camel safaris, folk dances, and stargazing camps.' }
      ],
      'Hidden Gems': [
        { name: 'Abhaneri Stepwell', desc: 'Ancient 13-story geometric stepwell built over a thousand years ago.' },
        { name: 'Kumbhalgarh Wall', desc: 'The second-longest continuous wall in the world surrounding the historic fort.' }
      ],
      'Food': [
        { name: 'Dal Baati Churma', desc: 'Iconic dish of baked wheat balls, spiced lentils, and sweetened crushed flour.' },
        { name: 'Laal Maas', desc: 'Fiery mutton curry prepared with garlic and local Mathania red chilies.' }
      ],
      'Traditions': [
        { name: 'Ghoomar Dance', desc: 'Graceful royal folk dance performed by women in swirling robes.' },
        { name: 'Puppetry (Kathputli)', desc: 'String puppet storytelling depicting legendary folklore and kings.' }
      ]
    }
  },
  kerala: {
    title: 'Kerala',
    subtitle: 'South India • Backwaters, Spices & Ayurveda',
    bannerImg: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    categories: {
      'Most Loved': [
        { name: 'Alleppey Backwaters', desc: 'Peaceful network of palm-fringed canals navigated on traditional houseboats.' },
        { name: 'Munnar Tea Gardens', desc: 'Rolling green hills carpeted with tea plantations and cool mountain mist.' }
      ],
      'Hidden Gems': [
        { name: 'Munroe Island', desc: 'Quaint cluster of islands perfect for narrow canoe cruises through village canals.' },
        { name: 'Vagamon Meadows', desc: 'Serene pine forests and green meadows far from crowded tourist spots.' }
      ],
      'Food': [
        { name: 'Appam with Stew', desc: 'Soft rice pancakes served with aromatic coconut milk vegetable or meat stew.' },
        { name: 'Kerala Sadya', desc: 'Grand vegetarian feast served on a banana leaf during festival celebrations.' }
      ],
      'Traditions': [
        { name: 'Kathakali', desc: 'Classical dance-drama distinguished by elaborate makeup and expressive gestures.' },
        { name: 'Kalaripayattu', desc: 'Ancient martial art form origin from Kerala focusing on agility and weapon combat.' }
      ]
    }
  },
  varanasi: {
    title: 'Varanasi',
    subtitle: 'Uttar Pradesh • Spiritual Capital along the Holy Ganges',
    bannerImg: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80',
    categories: {
      'Most Loved': [
        { name: 'Ganga Aarti', desc: 'Mesmerizing evening prayer ceremony performed with light lamps at Dashashwamedh Ghat.' },
        { name: 'Kashi Vishwanath Temple', desc: 'One of the most sacred Hindu temples dedicated to Lord Shiva.' }
      ],
      'Hidden Gems': [
        { name: 'Sarnath Ruins', desc: 'Historical site where Lord Buddha delivered his very first sermon after enlightenment.' },
        { name: 'Ramnagar Fort', desc: '18th-century sandstone fort museum across the Ganges River.' }
      ],
      'Food': [
        { name: 'Banarasi Paan', desc: 'Famous betel leaf treat infused with sweet and aromatic local ingredients.' },
        { name: 'Malaiyyo', desc: 'Seasonal saffron-flavored milk foam dessert served in clay cups.' }
      ],
      'Traditions': [
        { name: 'Morning Boat Ride', desc: 'Dawn journey along the river ghats observing morning rituals and prayers.' },
        { name: 'Banarasi Silk Weaving', desc: 'Handloom craft producing fine gold and silver brocade silk sarees.' }
      ]
    }
  },
  hampi: {
    title: 'Hampi',
    subtitle: 'Karnataka • UNESCO Ruins of the Vijayanagara Empire',
    bannerImg: 'https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=800&q=80',
    categories: {
      'Most Loved': [
        { name: 'Stone Chariot at Vittala Temple', desc: 'Iconic architectural masterpiece carved from granite stone.' },
        { name: 'Virupaksha Temple', desc: 'Active ancient temple complex operating continuously since the 7th century.' }
      ],
      'Hidden Gems': [
        { name: 'Anegundi Village', desc: 'Mythological kingdom across the Tungabhadra River with ancient rock art.' },
        { name: 'Matanga Hill', desc: 'Highest point in Hampi offering breathtaking sunrise views over boulder fields.' }
      ],
      'Food': [
        { name: 'Hampi Thali', desc: 'Wholesome South Indian meal with rice, ragi mudde, lentils, and fresh chutneys.' },
        { name: 'Jolada Rotti', desc: 'Sorghum flatbread served with spicy brinjal curry and peanut chutney powder.' }
      ],
      'Traditions': [
        { name: 'Hampi Utsav', desc: 'Annual cultural festival filled with lights, classical music, and puppet shows.' },
        { name: 'Coracle River Crossing', desc: 'Riding traditional circular woven basket boats across the river.' }
      ]
    }
  }
};

export default function ExplorerModal({ regionKey, onClose }) {
  const [activeTab, setActiveTab] = useState('Most Loved');

  const region = REGION_DATA[regionKey] || REGION_DATA.coorg;
  const categories = Object.keys(region.categories);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(6px)',
      padding: '20px'
    }}>
      <div style={{
        background: '#0d1322',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '20px',
        maxWidth: '560px',
        width: '100%',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        {/* Banner Header */}
        <div style={{
          height: '180px',
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(13,19,34,0.95)), url(${region.bannerImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '24px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end'
        }}>
          <button 
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(0, 0, 0, 0.5)',
              border: 'none',
              color: '#fff',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ✕
          </button>
          <h2 style={{ margin: 0, color: '#fff', fontSize: '1.8rem', fontWeight: 800 }}>{region.title}</h2>
          <span style={{ fontSize: '0.85rem', color: '#ff9933', marginTop: '4px', fontWeight: 600 }}>
            {region.subtitle}
          </span>
        </div>

        {/* Category Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          padding: '12px 20px',
          background: 'rgba(255, 255, 255, 0.03)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          overflowX: 'auto'
        }}>
          {categories.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  background: isActive ? 'rgba(255, 153, 51, 0.15)' : 'transparent',
                  border: isActive ? '1px solid #ff9933' : '1px solid transparent',
                  color: isActive ? '#ff9933' : '#888',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab === 'Most Loved' && '♥ '}
                {tab === 'Hidden Gems' && '💎 '}
                {tab === 'Food' && '🍲 '}
                {tab === 'Traditions' && '🎭 '}
                {tab}
              </button>
            );
          })}
        </div>

        {/* Card Details List */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {region.categories[activeTab]?.map((item, idx) => (
            <div 
              key={idx}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '16px'
              }}
            >
              <h4 style={{ margin: '0 0 6px 0', color: '#ffffff', fontSize: '1rem', fontWeight: 700 }}>
                {item.name}
              </h4>
              <p style={{ margin: 0, color: '#aaaaaa', fontSize: '0.88rem', lineHeight: 1.5 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}