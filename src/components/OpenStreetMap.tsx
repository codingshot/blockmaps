
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

  useEffect(() => {
    let mounted = true;
    let leafletMap: any = null;

    const loadLeaflet = async () => {
      try {
        console.log('Loading Leaflet library...');
        
        // Check if container exists
        if (!mapRef.current) {
          console.log('No map container found');
          return;
        }

        // Dynamically import Leaflet
        const leafletModule = await import('leaflet');
        const L = leafletModule.default;
        
        // Import CSS
        await import('leaflet/dist/leaflet.css');

        if (!mounted) {
          console.log('Component unmounted during loading');
          return;
        }

        console.log('Creating map instance with center:', center);

        // Fix for default markers
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        });

        // Create map with retry logic
        try {
          leafletMap = L.map(mapRef.current, {
            center: [center.lat, center.lng],
            zoom: zoom,
            zoomControl: true,
            attributionControl: true,
            preferCanvas: true
          });

          console.log('Map instance created successfully');

          // Add OpenStreetMap tiles with multiple fallback servers
          const tileUrls = [
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            'https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png'
          ];

          let tileLayer;
          for (const url of tileUrls) {
            try {
              tileLayer = L.tileLayer(url, {
                attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19,
                minZoom: 1,
                timeout: 10000
              });
              break;
            } catch (tileError) {
              console.warn('Failed to load tiles from:', url);
            }
          }

          if (tileLayer) {
            tileLayer.addTo(leafletMap);
            
            // Set loading to false after tiles start loading
            setTimeout(() => {
              if (mounted) {
                console.log('Map loaded successfully');
                setIsLoading(false);
                setError(null);
              }
            }, 1500);
          }

          // Handle map clicks
          if (onMapClick) {
            leafletMap.on('click', (e: any) => {
              console.log('Map clicked at:', e.latlng.lat, e.latlng.lng);
              onMapClick(e.latlng.lat, e.latlng.lng);
            });
          }

          if (mounted) {
            setMapInstance(leafletMap);
          }

        } catch (mapError) {
          console.error('Error creating map:', mapError);
          if (mounted) {
            setError('Failed to initialize map');
            setIsLoading(false);
          }
        }

      } catch (error) {
        console.error('Error loading Leaflet:', error);
        if (mounted) {
          setError('Failed to load map library');
          setIsLoading(false);
        }
      }
    };

    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(loadLeaflet, 100);

    return () => {
      mounted = false;
      clearTimeout(timer);
      if (leafletMap) {
        console.log('Cleaning up map instance');
        leafletMap.remove();
      }
    };
  }, [center.lat, center.lng, zoom]);

  // Update markers when they change
  useEffect(() => {
    if (!mapInstance) return;

    console.log('Updating markers:', markers.length);

    // Clear existing custom markers
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
        const L = (window as any).L;
        if (!L) return;

        const customIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `
            <div class="flex flex-col items-center group">
              <div class="bg-white rounded-full p-2 shadow-lg border-2 border-white hover:scale-110 transition-transform cursor-pointer">
                <span class="text-xl">${marker.emoji}</span>
              </div>
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 40],
        });

        const markerInstance = L.marker([marker.lat, marker.lng], { 
          icon: customIcon
        });
        
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
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <MapPin className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-semibold">Failed to load map</p>
          <p className="text-gray-600 text-sm">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
        <div className="text-center">
          <div className="relative mb-4">
            <Loader className="w-8 h-8 animate-spin text-blue-500 mx-auto" />
          </div>
          <p className="text-gray-600 font-medium">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};

export default OpenStreetMap;
