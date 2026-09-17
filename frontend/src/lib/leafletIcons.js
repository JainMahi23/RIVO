import L from 'leaflet';

// Vite doesn't resolve Leaflet's default marker image paths automatically,
// so point them at the CDN copies that ship with the same version.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Brand-colored pin (terracotta) used for the "dropped pin" marker in
// LocationTab, so it matches the rest of the RIVO UI instead of the
// default Leaflet blue marker.
export const pinIcon = L.divIcon({
  className: 'rivo-pin-icon',
  html: `
    <svg width="30" height="30" viewBox="0 0 24 24" fill="#C86D51" stroke="#A8563D" stroke-width="1"
      style="filter: drop-shadow(0 3px 4px rgba(24,67,47,0.35));">
      <path d="M12 22s7-7.58 7-12.5A7 7 0 0 0 5 9.5C5 14.42 12 22 12 22z"/>
      <circle cx="12" cy="9.5" r="2.6" fill="#F6F3EB"/>
    </svg>
  `,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -28],
});

export default L;
