
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
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    let mounted = true;
    
    const initMap = async () => {
      if (!mapRef.current || !mounted) return;

      try {
        setIsLoading(true);
        setError(null);
        console.log('Starting map initialization...');

        // Check if Leaflet is already loaded
        if (!window.L) {
          console.log('Loading Leaflet CSS and JS...');
          
          // Load CSS first
          const existingCss = document.querySelector('link[href*="leaflet.css"]');
          if (!existingCss) {
            const cssLink = document.createElement('link');
            cssLink.rel = 'stylesheet';
            cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            cssLink.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
            cssLink.crossOrigin = '';
            document.head.appendChild(cssLink);
          }

          // Load JS
          const existingScript = document.querySelector('script[src*="leaflet.js"]');
          if (!existingScript) {
            await new Promise((resolve, reject) => {
              const script = document.createElement('script');
              script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
              script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
              script.crossOrigin = '';
              script.onload = () => {
                console.log('Leaflet script loaded');
                resolve(void 0);
              };
              script.onerror = () => {
                console.error('Failed to load Leaflet script');
                reject(new Error('Failed to load Leaflet'));
              };
              document.head.appendChild(script);
            });
          }

          // Wait for Leaflet to be available
          let attempts = 0;
          while (!window.L && attempts < 50) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
          }

          if (!window.L) {
            throw new Error('Leaflet failed to initialize after loading');
          }
        }

        if (!mounted) return;

        console.log('Creating map instance...');
        
        // Clear any existing content
        if (mapRef.current) {
          mapRef.current.innerHTML = '';
        }

        // Create map with better error handling
        const mapOptions = {
          center: [center.lat, center.lng] as [number, number],
          zoom: zoom,
          zoomControl: false, // We'll add our own controls
          attributionControl: true,
          scrollWheelZoom: true,
          doubleClickZoom: true,
          boxZoom: true,
          keyboard: true,
          dragging: true,
          touchZoom: true
        };

        const map = window.L.map(mapRef.current, mapOptions);
        
        console.log('Map created, adding tile layer...');

        // Add tile layer with error handling
        const tileLayer = window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
          subdomains: ['a', 'b', 'c']
        });

        tileLayer.on('tileerror', (e: any) => {
          console.warn('Tile loading error:', e);
        });

        tileLayer.addTo(map);

        // Add click handler
        if (onMapClick) {
          map.on('click', (e: any) => {
            onMapClick(e.latlng.lat, e.latlng.lng);
          });
        }

        // Store map instance
        setMapInstance(map);
        setIsLoading(false);
        console.log('Map loaded successfully!');

      } catch (err) {
        console.error('Map loading error:', err);
        if (mounted) {
          setError(`Failed to load map: ${err instanceof Error ? err.message : 'Unknown error'}`);
          setIsLoading(false);
        }
      }
    };

    initMap();

    return () => {
      mounted = false;
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
      try {
        mapInstance.setView([center.lat, center.lng], zoom);
      } catch (e) {
        console.warn('Error updating map view:', e);
      }
    }
  }, [center.lat, center.lng, zoom, mapInstance]);

  // Update markers
  useEffect(() => {
    if (!mapInstance || !window.L) return;

    try {
      // Clear existing markers
      markersRef.current.forEach(marker => {
        try {
          mapInstance.removeLayer(marker);
        } catch (e) {
          console.warn('Error removing marker:', e);
        }
      });
      markersRef.current = [];

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
          });
          
          markerInstance.addTo(mapInstance);
          markersRef.current.push(markerInstance);
          
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
    } catch (e) {
      console.error('Error updating markers:', e);
    }
  }, [markers, mapInstance]);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center p-6">
          <MapPin className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-semibold mb-2">Map Loading Error</p>
          <p className="text-gray-600 text-sm">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center p-6">
          <Loader className="w-10 h-10 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-700 font-medium">Loading Interactive Map...</p>
          <p className="text-gray-500 text-sm mt-2">This may take a moment</p>
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
