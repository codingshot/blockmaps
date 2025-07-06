
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

  useEffect(() => {
    const loadLeaflet = async () => {
      try {
        // Dynamically import Leaflet
        const L = (await import('leaflet')).default;
        await import('leaflet/dist/leaflet.css');

        if (!mapRef.current || mapInstance) return;

        // Create map
        const map = L.map(mapRef.current).setView([center.lat, center.lng], zoom);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 18,
        }).addTo(map);

        // Handle map clicks
        if (onMapClick) {
          map.on('click', (e: any) => {
            onMapClick(e.latlng.lat, e.latlng.lng);
          });
        }

        setMapInstance(map);
        setIsLoading(false);

        // Add markers
        markers.forEach((marker) => {
          const customIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `
              <div class="flex flex-col items-center">
                <div class="bg-white rounded-full p-2 shadow-lg border-2 border-white hover:scale-110 transition-transform cursor-pointer">
                  <span class="text-xl">${marker.emoji}</span>
                </div>
                <div class="bg-black text-white px-2 py-1 rounded text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  ${marker.label}
                </div>
              </div>
            `,
            iconSize: [40, 40],
            iconAnchor: [20, 40],
          });

          L.marker([marker.lat, marker.lng], { icon: customIcon })
            .addTo(map)
            .bindPopup(`
              <div class="text-center p-2">
                <div class="text-2xl mb-2">${marker.emoji}</div>
                <div class="font-semibold">${marker.label}</div>
                <div class="text-sm text-gray-600 capitalize">${marker.type}</div>
              </div>
            `);
        });

      } catch (error) {
        console.error('Error loading map:', error);
        setIsLoading(false);
      }
    };

    loadLeaflet();

    return () => {
      if (mapInstance) {
        mapInstance.remove();
        setMapInstance(null);
      }
    };
  }, [center.lat, center.lng, zoom, onMapClick]);

  // Update markers when they change
  useEffect(() => {
    if (!mapInstance) return;

    // Clear existing markers and add new ones
    mapInstance.eachLayer((layer: any) => {
      if (layer instanceof (window as any).L?.Marker) {
        mapInstance.removeLayer(layer);
      }
    });

    markers.forEach((marker) => {
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

      L.marker([marker.lat, marker.lng], { icon: customIcon })
        .addTo(mapInstance)
        .bindPopup(`
          <div class="text-center p-2">
            <div class="text-2xl mb-2">${marker.emoji}</div>
            <div class="font-semibold">${marker.label}</div>
            <div class="text-sm text-gray-600 capitalize">${marker.type}</div>
          </div>
        `);
    });
  }, [markers, mapInstance]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <Loader className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full rounded-lg" />
    </div>
  );
};

export default OpenStreetMap;
