
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

const OpenStreetMap = ({ center, zoom = 13, markers = [], onMapClick }: OpenStreetMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const markersRef = useRef<any[]>([]);
  const leafletRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;
    let leafletMap: any = null;

    const initializeMap = async () => {
      try {
        console.log('Starting map initialization...');
        console.log('Center coordinates:', center);
        
        // Ensure container exists
        const container = mapRef.current;
        if (!container) {
          console.error('Map container not found');
          if (mounted) {
            setError('Map container not available');
            setIsLoading(false);
          }
          return;
        }

        console.log('Container found, setting up dimensions...');
        
        // Ensure container has proper dimensions
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.minHeight = '400px';
        container.style.position = 'relative';

        // Wait a moment for container to be properly sized
        await new Promise(resolve => setTimeout(resolve, 100));

        console.log('Container dimensions after setup:', {
          width: container.offsetWidth,
          height: container.offsetHeight,
          clientWidth: container.clientWidth,
          clientHeight: container.clientHeight
        });

        if (container.offsetWidth === 0 || container.offsetHeight === 0) {
          console.warn('Container has zero dimensions, forcing size...');
          container.style.width = '100%';
          container.style.height = '400px';
          container.style.display = 'block';
          
          // Wait again after forcing dimensions
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        console.log('Loading Leaflet...');
        
        // Import Leaflet dynamically
        const [leafletModule] = await Promise.all([
          import('leaflet'),
          import('leaflet/dist/leaflet.css')
        ]);
        
        const L = leafletModule.default;
        leafletRef.current = L;

        if (!mounted) {
          console.log('Component unmounted, aborting...');
          return;
        }

        console.log('Leaflet loaded, fixing marker icons...');

        // Fix default marker icons
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        });

        console.log('Creating Leaflet map instance...');

        // Create the map
        leafletMap = L.map(container, {
          center: [center.lat, center.lng],
          zoom: zoom,
          zoomControl: true,
          attributionControl: true,
          preferCanvas: false
        });

        console.log('Map instance created, adding tile layer...');

        // Add OpenStreetMap tiles
        const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
        });

        tileLayer.addTo(leafletMap);

        console.log('Tile layer added, setting up click handler...');

        // Add click handler
        if (onMapClick) {
          leafletMap.on('click', (e: any) => {
            console.log('Map clicked at:', e.latlng);
            onMapClick(e.latlng.lat, e.latlng.lng);
          });
        }

        // Wait for tiles to start loading
        await new Promise(resolve => setTimeout(resolve, 500));

        if (mounted) {
          console.log('Map initialization complete!');
          setMapInstance(leafletMap);
          setIsLoading(false);
          setError(null);
        }

      } catch (error) {
        console.error('Error initializing map:', error);
        if (mounted) {
          setError(`Map initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
          setIsLoading(false);
        }
      }
    };

    // Start initialization with a slight delay to ensure DOM is ready
    const initTimer = setTimeout(initializeMap, 200);

    return () => {
      mounted = false;
      clearTimeout(initTimer);
      if (leafletMap) {
        try {
          console.log('Cleaning up map instance...');
          leafletMap.remove();
        } catch (e) {
          console.warn('Error cleaning up map:', e);
        }
      }
    };
  }, [center.lat, center.lng, zoom, onMapClick]);

  // Handle markers
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
        const customIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `
            <div class="flex flex-col items-center">
              <div class="bg-white rounded-full p-2 shadow-lg border-2 border-white hover:scale-110 transition-transform cursor-pointer">
                <span class="text-xl">${marker.emoji}</span>
              </div>
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 40],
        });

        const markerInstance = L.marker([marker.lat, marker.lng], { icon: customIcon });
        markerInstance.addTo(mapInstance);
        markersRef.current.push(markerInstance);
        
        markerInstance.bindPopup(`
          <div class="text-center p-2">
            <div class="text-2xl mb-2">${marker.emoji}</div>
            <div class="font-semibold">${marker.label}</div>
            <div class="text-sm text-gray-600 capitalize">${marker.type}</div>
          </div>
        `);
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
            onClick={() => {
              setError(null);
              setIsLoading(true);
              window.location.reload();
            }} 
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
          zIndex: 0
        }}
      />
    </div>
  );
};

export default OpenStreetMap;
