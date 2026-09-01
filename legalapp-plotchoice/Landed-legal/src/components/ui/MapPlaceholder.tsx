import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Compass, Loader2 } from 'lucide-react';

interface MapPlaceholderProps {
  onLocationSelect?: (coords: { lat: number; lng: number; address: string }) => void;
  height?: string;
  className?: string;
}

declare global {
  interface Window {
    L: any;
  }
}

export const MapPlaceholder: React.FC<MapPlaceholderProps> = ({
  onLocationSelect,
  height = 'h-80 sm:h-96',
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [locationName, setLocationName] = useState('Survey No. 142/3B, T. Nagar, Chennai, Tamil Nadu');

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerInstanceRef = useRef<any>(null);

  // Load Leaflet JS & CSS dynamically
  useEffect(() => {
    let isMounted = true;

    const loadLeaflet = async () => {
      // Inject CSS if not present
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Inject JS if not present
      if (!window.L) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.id = 'leaflet-js';
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load Leaflet script'));
          document.body.appendChild(script);
        });
      }

      if (isMounted && window.L && mapContainerRef.current && !mapInstanceRef.current) {
        initMap();
      }
    };

    loadLeaflet().catch((err) => {
      console.error('Error loading Leaflet map:', err);
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const initMap = () => {
    if (!mapContainerRef.current || !window.L) return;

    // Default center: T. Nagar, Chennai
    const defaultLat = 13.0405;
    const defaultLng = 80.2337;

    const L = window.L;
    const map = L.map(mapContainerRef.current, {
      zoomControl: false
    }).setView([defaultLat, defaultLng], 15);

    // OpenStreetMap Tile Layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Custom Red Pin Icon
    const customIcon = L.divIcon({
      className: 'custom-map-pin',
      html: `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
          <div style="width: 32px; height: 32px; background: #2563EB; border: 3px solid #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(37,99,235,0.4);">
            <div style="width: 10px; height: 10px; background: #ffffff; border-radius: 50%;"></div>
          </div>
          <div style="width: 2px; height: 12px; background: #2563EB;"></div>
        </div>
      `,
      iconSize: [32, 44],
      iconAnchor: [16, 44]
    });

    const marker = L.marker([defaultLat, defaultLng], {
      icon: customIcon,
      draggable: true
    }).addTo(map);

    markerInstanceRef.current = marker;
    mapInstanceRef.current = map;

    // Add Leaflet zoom control to bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Handle map click
    map.on('click', async (e: any) => {
      const { lat, lng } = e.latlng;
      updatePinPosition(lat, lng);
    });

    // Handle marker drag end
    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      updatePinPosition(pos.lat, pos.lng);
    });

    setMapLoaded(true);
  };

  const updatePinPosition = async (lat: number, lng: number) => {
    if (!mapInstanceRef.current || !markerInstanceRef.current || !window.L) return;

    markerInstanceRef.current.setLatLng([lat, lng]);
    mapInstanceRef.current.panTo([lat, lng]);

    // Reverse geocode via Nominatim API
    let displayAddr = `Coordinates: ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.display_name) {
          displayAddr = data.display_name;
        }
      }
    } catch (err) {
      console.error('Reverse geocode error:', err);
    }

    setLocationName(displayAddr);
    if (onLocationSelect) {
      onLocationSelect({ lat, lng, address: displayAddr });
    }
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const query = searchQuery.includes('Tamil Nadu') ? searchQuery : `${searchQuery}, Tamil Nadu, India`;
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          const firstResult = data[0];
          const lat = parseFloat(firstResult.lat);
          const lng = parseFloat(firstResult.lon);

          if (mapInstanceRef.current && markerInstanceRef.current) {
            mapInstanceRef.current.setView([lat, lng], 16);
            markerInstanceRef.current.setLatLng([lat, lng]);
          }
          setLocationName(firstResult.display_name);
          if (onLocationSelect) {
            onLocationSelect({ lat, lng, address: firstResult.display_name });
          }
        }
      }
    } catch (err) {
      console.error('Search location error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100 ${className}`}>
      {/* Search Bar Overlay */}
      <form onSubmit={handleSearchSubmit} className="absolute top-3 left-3 right-3 z-[1000] flex gap-2">
        <div className="flex-1 relative shadow-md rounded-xl overflow-hidden bg-white/95 backdrop-blur border border-slate-200/90">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search location, district or landmark (e.g. T. Nagar, Chennai)..."
            className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600">
            {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </div>
        </div>
        <button
          type="submit"
          disabled={isSearching}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
        >
          <span>Locate</span>
        </button>
      </form>

      {/* Real OpenStreetMap Leaflet Canvas */}
      <div ref={mapContainerRef} className={`w-full ${height} z-0 bg-slate-200 relative`} />

      {/* Selected Address Banner */}
      <div className="absolute bottom-3 left-3 right-14 z-[1000] bg-white/95 backdrop-blur border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 shadow-md flex items-center gap-2">
        <Compass className="w-4 h-4 text-blue-600 flex-shrink-0" />
        <span className="truncate text-slate-900 font-bold">{locationName}</span>
      </div>
    </div>
  );
};
