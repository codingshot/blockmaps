
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

  useEffect(() => {
    let mounted = true;

    const loadLeaflet = async () => {
      try {
        console.log('Loading Leaflet library...');
        
        // Dynamically import Leaflet
        const leafletModule = await import('leaflet');
        const L = leafletModule.default;
        
        // Import CSS
        await import('leaflet/dist/leaflet.css');

        if (!mounted || !mapRef.current) {
          console.log('Component unmounted or no map container');
          return;
        }

        console.log('Creating map instance...');

        // Fix for default markers
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        });

        // Create map
        const map = L.map(mapRef.current, {
          center: [center.lat, center.lng],
          zoom: zoom,
          zoomControl: true,
          attributionControl: true
        });

        console.log('Map created, adding tiles...');

        // Add OpenStreetMap tiles
        const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
          minZoom: 1,
        });

        tileLayer.addTo(map);

        // Wait for tiles to load
        tileLayer.on('load', () => {
          console.log('Tiles loaded successfully');
          if (mounted) {
            setIsLoading(false);
          }
        });

        // Handle tile load errors
        tileLayer.on('tileerror', (e) => {
          console.warn('Tile load error:', e);
        });

        // Handle map clicks
        if (onMapClick) {
          map.on('click', (e: any) => {
            console.log('Map clicked at:', e.latlng.lat, e.latlng.lng);
            onMapClick(e.latlng.lat, e.latlng.lng);
          });
        }

        // Set loading to false after a short delay to ensure map is rendered
        setTimeout(() => {
          if (mounted) {
            setIsLoading(false);
          }
        }, 1000);

        if (mounted) {
          setMapInstance(map);
          console.log('Map instance set');
        }

      } catch (error) {
        console.error('Error loading map:', error);
        if (mounted) {
          setError('Failed to load map');
          setIsLoading(false);
        }
      }
    };

    loadLeaflet();

    return () => {
      mounted = false;
      if (mapInstance) {
        console.log('Cleaning up map instance');
        mapInstance.remove();
        setMapInstance(null);
      }
    };
  }, [center.lat, center.lng, zoom]);

  // Update markers when they change
  useEffect(() => {
    if (!mapInstance) return;

    console.log('Updating markers:', markers.length);

    // Clear existing markers
    mapInstance.eachLayer((layer: any) => {
      if (layer.options && layer.options.isCustomMarker) {
        mapInstance.removeLayer(layer);
      }
    });

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
          icon: customIcon,
          isCustomMarker: true 
        });
        
        markerInstance.addTo(mapInstance);
        
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
          <p className="text-gray-600 text-sm">Please check your internet connection</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="relative mb-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-blue-500 border-r-purple-500 border-b-pink-500 border-l-green-500 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <img 
                src="/lovable-uploads/c685a2ad-a3fd-49c6-9887-8b20a1c7f5ee.png" 
                alt="Loading" 
                className="w-8 h-8 object-contain"
              />
            </div>
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
