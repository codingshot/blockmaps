
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
  const markersRef = useRef<any[]>([]);
  const leafletRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    getMapInstance: () => mapInstance
  }));

  useEffect(() => {
    let mounted = true;
    let leafletMap: any = null;

    const initializeMap = async () => {
      try {
        console.log('Starting map initialization...');
        
        const container = mapRef.current;
        if (!container) {
          console.error('Map container not found');
          return;
        }

        // Clear any existing content
        container.innerHTML = '';
        
        // Set container styles
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.minHeight = '400px';

        const [leafletModule] = await Promise.all([
          import('leaflet'),
          import('leaflet/dist/leaflet.css')
        ]);
        
        const L = leafletModule.default;
        leafletRef.current = L;

        if (!mounted) return;

        // Fix default markers
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        });

        console.log('Creating map with center:', center, 'zoom:', zoom);

        leafletMap = L.map(container, {
          center: [center.lat, center.lng],
          zoom: zoom,
          zoomControl: true,
          attributionControl: true,
        });

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(leafletMap);

        // Add click handler
        if (onMapClick) {
          leafletMap.on('click', (e: any) => {
            onMapClick(e.latlng.lat, e.latlng.lng);
          });
        }

        // Wait for map to be ready
        leafletMap.whenReady(() => {
          console.log('Map is ready');
          if (mounted) {
            setMapInstance(leafletMap);
            setIsLoading(false);
            setError(null);
          }
        });

      } catch (error) {
        console.error('Error initializing map:', error);
        if (mounted) {
          setError(`Failed to load map: ${error instanceof Error ? error.message : 'Unknown error'}`);
          setIsLoading(false);
        }
      }
    };

    initializeMap();

    return () => {
      mounted = false;
      if (leafletMap) {
        try {
          leafletMap.remove();
        } catch (e) {
          console.warn('Error cleaning up map:', e);
        }
      }
    };
  }, []);

  // Update map center when props change
  useEffect(() => {
    if (mapInstance && leafletRef.current) {
      console.log('Updating map center to:', center, 'zoom:', zoom);
      mapInstance.setView([center.lat, center.lng], zoom);
    }
  }, [center.lat, center.lng, zoom, mapInstance]);

  // Add markers
  useEffect(() => {
    if (!mapInstance || !leafletRef.current || !markers.length) {
      return;
    }

    console.log('Adding markers:', markers.length);

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
        const L = leafletRef.current;
        
        // Create custom icon
        const customIcon = L.divIcon({
          className: 'custom-marker-icon',
          html: `
            <div style="
              background: white;
              border-radius: 50%;
              padding: 6px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.3);
              border: 2px solid white;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              transition: transform 0.2s;
            " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
              <span style="font-size: 18px;">${marker.emoji}</span>
            </div>
          `,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        });

        const markerInstance = L.marker([marker.lat, marker.lng], { icon: customIcon });
        markerInstance.addTo(mapInstance);
        markersRef.current.push(markerInstance);
        
        // Add popup
        markerInstance.bindPopup(`
          <div style="text-align: center; padding: 8px; min-width: 120px;">
            <div style="font-size: 24px; margin-bottom: 8px;">${marker.emoji}</div>
            <div style="font-weight: bold; margin-bottom: 4px;">${marker.label}</div>
            <div style="font-size: 12px; color: #666; text-transform: capitalize;">${marker.type.replace('-', ' ')}</div>
          </div>
        `);

        console.log('Added marker:', marker.label, 'at', marker.lat, marker.lng);
      } catch (error) {
        console.error('Error adding marker:', error);
      }
    });
  }, [markers, mapInstance]);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 min-h-[400px]">
        <div className="text-center p-6">
          <MapPin className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-semibold mb-2">Map Error</p>
          <p className="text-gray-600 text-sm mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 min-h-[400px]">
        <div className="text-center p-6">
          <Loader className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading map...</p>
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
    </div>
  );
});

OpenStreetMap.displayName = 'OpenStreetMap';

export default OpenStreetMap;
