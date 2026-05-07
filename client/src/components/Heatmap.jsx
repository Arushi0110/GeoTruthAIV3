import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// safer fix
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

const COORDS = {
  'delhi': [28.6139, 77.2090],
  'mumbai': [19.0760, 72.8777],
  'london': [51.5074, -0.1278],
  'new york': [40.7128, -74.0060],
  'washington': [38.9072, -77.0369],
  'paris': [48.8566, 2.3522],
  'tokyo': [35.6762, 139.6503],
  'berlin': [52.5200, 13.4050],
  'global': [20, 0]
};

const Heatmap = ({ history = [] }) => {
  const center = [20.5937, 78.9629]; // India center

  const getMarkerColor = (prediction) => {
    const p = prediction?.toLowerCase();
    if (p === 'fake') return 'red';
    if (p === 'real') return 'green';
    return 'blue';
  };

  return (
    <div className="w-full h-[400px] rounded-xl overflow-hidden border border-gray-100 shadow-inner">
      <MapContainer center={center} zoom={2} style={{ height: '100%', width: '100%' }}>
        <TileLayer 
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {history.map((item, i) => {
          const loc = (item.geo_locations && item.geo_locations[0]) || 'global';
          const position = COORDS[loc.toLowerCase()] || [20 + (Math.random() * 10), 0 + (Math.random() * 40)];
          const label = item.bert_prediction || item.prediction || 'N/A';
          const color = getMarkerColor(label);

          return (
            <Marker key={i} position={position}>
              <Popup>
                <div className="p-2 min-w-[150px]">
                  <div className={`text-[10px] font-bold uppercase mb-1 ${color === 'red' ? 'text-red-500' : 'text-emerald-500'}`}>
                    {label} Verification
                  </div>
                  <div className="text-xs font-semibold text-gray-800 line-clamp-2 mb-2">
                    {item.input_text?.slice(0, 60)}...
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-gray-400">
                    <span>Trust: {Math.round(item.trust_score)}%</span>
                    <span>{item.date || 'Today'}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default Heatmap;