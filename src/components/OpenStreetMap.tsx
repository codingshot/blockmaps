
import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
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

const OpenStreetMap = forwardRef<any, OpenStreetMapProps>(({ center, zoom = 13, markers = [], onMapClick }, ref) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useImperativeHandle(ref, () => ({
    getMapInstance: () => mapInstance
  }));

  useEffect(() => {
    const initializeMap = async () => {
      if (!mapRef.current) return;

      try {
        console.log('Starting map initialization...');
        
        // Load Leaflet CSS
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const cssLink = document.createElement('link');
          cssLink.rel = 'stylesheet';
          cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          cssLink.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
          cssLink.crossOrigin = '';
          document.head.appendChild(cssLink);
          
          // Wait for CSS to load
          await new Promise((resolve) => {
            cssLink.onload = resolve;
            setTimeout(resolve, 1000); // Fallback timeout
          });
        }

        // Load Leaflet JS
        if (!window.L) {
          console.log('Loading Leaflet JavaScript...');
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
          script.crossOrigin = '';
          
          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = () => reject(new Error('Failed to load Leaflet'));
            document.head.appendChild(script);
          });
        }

        if (!window.L) {
          throw new Error('Leaflet failed to load');
        }

        console.log('Leaflet loaded, creating map...');

        // Clear any existing content
        mapRef.current.innerHTML = '';

        // Fix Leaflet default marker icons
        delete (window.L.Icon.Default.prototype as any)._getIconUrl;
        window.L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        });

        // Create the map
        const map = window.L.map(mapRef.current, {
          center: [center.lat, center.lng],
          zoom: zoom,
          zoomControl: true,
          attributionControl: true,
        });

        // Add tile layer
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        // Add click handler
        if (onMapClick) {
          map.on('click', (e: any) => {
            onMapClick(e.latlng.lat, e.latlng.lng);
          });
        }

        setMapInstance(map);
        setIsLoading(false);
        setError(null);
        console.log('Map created successfully');

      } catch (error) {
        console.error('Map initialization failed:', error);
        setError('Failed to load map. Please refresh the page.');
        setIsLoading(false);
      }
    };

    initializeMap();

    return () => {
      if (mapInstance) {
        try {
          mapInstance.remove();
          console.log('Map cleaned up');
        } catch (e) {
          console.warn('Error during map cleanup:', e);
        }
      }
    };
  }, [center.lat, center.lng, zoom]);

  // Update markers when they change
  useEffect(() => {
    if (!mapInstance || !window.L || !markers.length) return;

    console.log('Updating markers:', markers.length);

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
          className: 'custom-marker-icon',
          html: `
            <div style="
              background: white;
              border-radius: 50%;
              padding: 8px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.3);
              border: 3px solid white;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              transition: all 0.2s ease;
              font-size: 20px;
            ">
              ${marker.emoji}
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 20],
        });

        const markerInstance = window.L.marker([marker.lat, marker.lng], { 
          icon: customIcon 
        }).addTo(mapInstance);
        
        markerInstance.bindPopup(`
          <div style="text-align: center; padding: 12px; min-width: 140px;">
            <div style="font-size: 28px; margin-bottom: 8px;">${marker.emoji}</div>
            <div style="font-weight: bold; margin-bottom: 6px; font-size: 16px;">${marker.label}</div>
            <div style="font-size: 13px; color: #666; text-transform: capitalize; background: #f3f4f6; padding: 4px 8px; border-radius: 12px;">${marker.type.replace('-', ' ')}</div>
          </div>
        `, {
          maxWidth: 200,
          className: 'custom-popup'
        });

      } catch (error) {
        console.error('Error adding marker:', error);
      }
    });
  }, [markers, mapInstance]);

  // Update map center when props change
  useEffect(() => {
    if (mapInstance) {
      mapInstance.setView([center.lat, center.lng], zoom);
    }
  }, [center.lat, center.lng, zoom, mapInstance]);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 min-h-[400px]">
        <div className="text-center p-6">
          <MapPin className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-semibold mb-2">Map Loading Error</p>
          <p className="text-gray-600 text-sm mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 min-h-[400px]">
        <div className="text-center p-6">
          <Loader className="w-10 h-10 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-700 font-medium text-lg">Loading Culture Map...</p>
          <p className="text-gray-500 text-sm mt-2">Initializing OpenStreetMap</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[400px]">
      <div 
        ref={mapRef} 
        className="w-full h-full rounded-lg"
        style={{ 
          minHeight: '400px', 
          width: '100%', 
          height: '100%',
          position: 'relative',
          zIndex: 1
        }}
      />
      <style>{`
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
        .custom-marker-icon:hover div {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(0,0,0,0.4);
        }
      `}</style>
    </div>
  );
});

OpenStreetMap.displayName = 'OpenStreetMap';

export default OpenStreetMap;
