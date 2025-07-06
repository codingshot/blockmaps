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
  const initializationRef = useRef<boolean>(false);

  useImperativeHandle(ref, () => ({
    getMapInstance: () => mapInstance
  }));

  useEffect(() => {
    if (initializationRef.current) return;
    initializationRef.current = true;

    let mounted = true;
    let leafletMap: any = null;

    const initializeMap = async () => {
      try {
        console.log('Starting map initialization...');
        
        const container = mapRef.current;
        if (!container) {
          throw new Error('Map container element not found');
        }

        container.style.width = '100%';
        container.style.height = '100%';
        container.style.minHeight = '400px';
        container.style.display = 'block';
        container.style.position = 'relative';

        await new Promise(resolve => {
          const checkSize = () => {
            if (container.offsetWidth > 0 && container.offsetHeight > 0) {
              resolve(true);
            } else {
              setTimeout(checkSize, 50);
            }
          };
          checkSize();
        });

        const [leafletModule] = await Promise.all([
          import('leaflet'),
          import('leaflet/dist/leaflet.css')
        ]);
        
        const L = leafletModule.default;
        leafletRef.current = L;

        if (!mounted) return;

        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        });

        leafletMap = L.map(container, {
          center: [center.lat, center.lng],
          zoom: zoom,
          zoomControl: true,
          attributionControl: true,
        });

        const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
        });

        tileLayer.addTo(leafletMap);

        if (onMapClick) {
          leafletMap.on('click', (e: any) => {
            onMapClick(e.latlng.lat, e.latlng.lng);
          });
        }

        await new Promise(resolve => setTimeout(resolve, 500));

        if (mounted) {
          setMapInstance(leafletMap);
          setIsLoading(false);
          setError(null);
        }

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

  useEffect(() => {
    if (mapInstance && leafletRef.current) {
      console.log('Updating map center to:', center, 'zoom:', zoom);
      mapInstance.setView([center.lat, center.lng], zoom);
    }
  }, [center.lat, center.lng, zoom, mapInstance]);

  useEffect(() => {
    if (!mapInstance || !leafletRef.current || !markers.length) {
      return;
    }

    console.log('Adding markers:', markers.length);

    markersRef.current.forEach(marker => {
      try {
        mapInstance.removeLayer(marker);
      } catch (e) {
        console.warn('Error removing marker:', e);
      }
    });
    markersRef.current = [];

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
              initializationRef.current = false;
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
          position: 'relative'
        }}
      />
    </div>
  );
});

OpenStreetMap.displayName = 'OpenStreetMap';

export default OpenStreetMap;
