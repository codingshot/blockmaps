
import { useEffect, useRef, useState } from 'react';
import { MapPin, Loader } from 'lucide-react';

interface OpenStreetMapProps {
  center: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{
    id: string;
    lat: number;
    lng: number;
    emoji: string;
    label: string;
    type: string;
  }>;
  onMapClick?: (lat: number, lng: number) => void;
}

declare global {
  interface Window {
    L: any;
  }
}

const OpenStreetMap = ({ center, zoom = 13, markers = [], onMapClick }: OpenStreetMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current) return;

      try {
        setIsLoading(true);
        setError(null);

        // Load Leaflet if not already loaded
        if (!window.L) {
          // Add CSS
          const cssLink = document.createElement('link');
          cssLink.rel = 'stylesheet';
          cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(cssLink);

          // Add JS
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          document.body.appendChild(script);

          // Wait for script to load
          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
          });

          // Wait a bit more for Leaflet to initialize
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        if (!window.L) {
          throw new Error('Leaflet failed to load');
        }

        // Clear container
        mapRef.current.innerHTML = '';

        // Create map
        const map = window.L.map(mapRef.current, {
          center: [center.lat, center.lng],
          zoom: zoom,
          zoomControl: true
        });

        // Add tile layer
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Add click handler
        if (onMapClick) {
          map.on('click', (e: any) => {
            onMapClick(e.latlng.lat, e.latlng.lng);
          });
        }

        setMapInstance(map);
        setIsLoading(false);
        console.log('Map loaded successfully');

      } catch (err) {
        console.error('Map loading error:', err);
        setError('Failed to load map');
        setIsLoading(false);
      }
    };

    initMap();

    return () => {
      if (mapInstance) {
        try {
          mapInstance.remove();
        } catch (e) {
          console.warn('Error cleaning up map:', e);
        }
      }
    };
  }, []);

  // Update map view when center/zoom changes
  useEffect(() => {
    if (mapInstance && window.L) {
      mapInstance.setView([center.lat, center.lng], zoom);
    }
  }, [center.lat, center.lng, zoom, mapInstance]);

  // Update markers
  useEffect(() => {
    if (!mapInstance || !window.L) return;

    // Clear existing markers
    mapInstance.eachLayer((layer: any) => {
      if (layer instanceof window.L.Marker) {
        mapInstance.removeLayer(layer);
      }
    });

    // Add new markers
    markers.forEach((marker) => {
      try {
        const customIcon = window.L.divIcon({
          className: 'custom-marker',
          html: `<div class="marker-content">${marker.emoji}</div>`,
          iconSize: [40, 40],
          iconAnchor: [20, 20],
        });

        const markerInstance = window.L.marker([marker.lat, marker.lng], { 
          icon: customIcon 
        }).addTo(mapInstance);
        
        markerInstance.bindPopup(`
          <div style="text-align: center; padding: 12px;">
            <div style="font-size: 28px; margin-bottom: 8px;">${marker.emoji}</div>
            <div style="font-weight: bold; margin-bottom: 6px;">${marker.label}</div>
            <div style="font-size: 12px; color: #666;">${marker.type.replace('-', ' ')}</div>
          </div>
        `);
      } catch (error) {
        console.error('Error adding marker:', error);
      }
    });
  }, [markers, mapInstance]);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center p-6">
          <MapPin className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-semibold mb-2">Map Loading Error</p>
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center p-6">
          <Loader className="w-10 h-10 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-700 font-medium">Loading Map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full rounded-lg" />
      <style>{`
        .custom-marker .marker-content {
          background: white;
          border-radius: 50%;
          padding: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          border: 3px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 20px;
          width: 40px;
          height: 40px;
          transform: translate(-50%, -50%);
          transition: transform 0.2s ease;
        }
        .custom-marker .marker-content:hover {
          transform: translate(-50%, -50%) scale(1.1);
        }
      `}</style>
    </div>
  );
};

export default OpenStreetMap;
