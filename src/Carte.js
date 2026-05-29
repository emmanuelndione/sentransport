import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Carte.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function calculerDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function BoutonCentrer({ position }) {
  const map = useMap();
  if (!position) return null;
  return (
    <button
      className="btn-centrer"
      onClick={() => map.setView(position, 15)}
    >
      📍 Centrer sur ma position
    </button>
  );
}

function Carte() {
  const [arrets, setArrets] = useState([]);
  const [positionUtilisateur, setPositionUtilisateur] = useState(null);
  const [arretsProches, setArretsProches] = useState([]);

  const DAKAR = [14.6928, -17.4467];

  useEffect(() => {
    fetch('http://localhost:5000/arrets')
      .then(r => r.json())
      .then(data => setArrets(data))
      .catch(err => console.error('Erreur arrets:', err));
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setPositionUtilisateur([pos.coords.latitude, pos.coords.longitude]),
        () => console.log('Geolocation refusée')
      );
    }
  }, []);

  useEffect(() => {
    if (positionUtilisateur && arrets.length > 0) {
      const arretsAvecDistance = arrets.map(a => ({
        ...a,
        distance: calculerDistance(
          positionUtilisateur[0], positionUtilisateur[1],
          a.lat, a.lon
        )
      }));
      const top3 = arretsAvecDistance
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 3);
      setArretsProches(top3);
    }
  }, [positionUtilisateur, arrets]);

  const icones = ['🥇', '🥈', '🥉'];
  const couleurs = ['#e74c3c', '#e67e22', '#27ae60'];

  return (
    <div className="carte-container">
      <h2 className="carte-titre">🗺️ Carte des arrêts</h2>

      {arretsProches.length > 0 && (
        <ul className="arrets-proches-liste">
          <li className="titre-liste">📍 Les 3 arrêts les plus proches :</li>
          {arretsProches.map((a, i) => (
            <li key={a.id} style={{ color: couleurs[i], fontWeight: 'bold', padding: '2px 0' }}>
              {icones[i]} {a.nom} — {a.distance.toFixed(1)} km
              <span style={{ color: '#555', fontWeight: 'normal' }}>
                {' '}(Lignes : {a.lignes.join(', ')})
              </span>
            </li>
          ))}
        </ul>
      )}

      <MapContainer center={DAKAR} zoom={13} className="carte">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap"
        />

        <BoutonCentrer position={positionUtilisateur} />

        {arrets.map(a => (
          <Marker key={a.id} position={[a.lat, a.lon]}>
            <Popup>
              <strong>{a.nom}</strong><br />
              Lignes : {a.lignes.join(', ')}
              {arretsProches.length > 0 && arretsProches[0].id === a.id && (
                <><br /><span style={{ color: '#e74c3c' }}>⭐ Arrêt le plus proche !</span></>
              )}
            </Popup>
          </Marker>
        ))}

        {positionUtilisateur && (
          <Marker position={positionUtilisateur}>
            <Popup>📍 Vous êtes ici</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}

export default Carte;