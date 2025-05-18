// components/AttractionMap.jsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default icon issue
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

function AttractionMap({ attractions }) {
  if (!attractions.length) return null;

  const center = [attractions[0].Lat, attractions[0].Lon];

  return (
    <div className="map-wrapper" style={{ height: '400px', margin: '30px 0', borderRadius: '12px', overflow: 'hidden' }}>
      <MapContainer center={center} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {attractions.map((a) => (
          <Marker key={a.Attraction_id} position={[a.Lat, a.Lon]}>
            <Popup>
              <strong>{a.Name}</strong><br />
              {a.Description || '—'}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default AttractionMap;
