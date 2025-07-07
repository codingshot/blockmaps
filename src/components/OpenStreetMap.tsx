
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface OpenStreetMapProps {
  center: { lat: number; lng: number };
  zoom: number;
  markers: Array<{
    id: string;
    lat: number;
    lng: number;
    emoji: string;
    label: string;
    type: string;
  }>;
  onMapClick?: (lat: number, lng: number) => void;
}

const OpenStreetMap: React.FC<OpenStreetMapProps> = ({
  center,
  zoom,
  markers,
  onMapClick
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;

    try {
      // Clear existing map
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      console.log('Initializing map with center:', center, 'zoom:', zoom);

      // Create map with better mobile settings
      const map = L.map(mapRef.current, {
        center: [center.lat, center.lng],
        zoom: zoom,
        zoomControl: false, // We have custom zoom controls
        attributionControl: true,
        scrollWheelZoom: true,
        touchZoom: true,
        doubleClickZoom: true,
        dragging: true,
        tap: true,
        tapTolerance: 15,
        maxZoom: 19,
        minZoom: 2,
      });

      // Add tile layer with better error handling
      const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
        errorTileUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      });

      tileLayer.on('loading', () => {
        console.log('Tiles loading...');
        setIsLoading(true);
      });

      tileLayer.on('load', () => {
        console.log('Tiles loaded successfully');
        setIsLoading(false);
        setError(null);
      });

      tileLayer.on('tileerror', (e) => {
        console.warn('Tile error:', e);
        // Don't set error state for individual tile failures
      });

      tileLayer.addTo(map);

      // Handle map clicks
      if (onMapClick) {
        map.on('click', (e) => {
          onMapClick(e.latlng.lat, e.latlng.lng);
        });
      }

      // Store map reference
      mapInstanceRef.current = map;

      // Set loading to false after a short delay if tiles haven't loaded
      const loadingTimeout = setTimeout(() => {
        setIsLoading(false);
      }, 3000);

      return () => {
        clearTimeout(loadingTimeout);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      };
    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Failed to load map');
      setIsLoading(false);
    }
  }, []);

  // Update map center and zoom
  useEffect(() => {
    if (mapInstanceRef.current) {
      console.log('Updating map center to:', center, 'zoom:', zoom);
      mapInstanceRef.current.setView([center.lat, center.lng], zoom);
    }
  }, [center.lat, center.lng, zoom]);

  // Update markers
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    console.log('Updating markers, count:', markers.length);

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current?.removeLayer(marker);
    });
    markersRef.current = [];

    // Add new markers
    markers.forEach(markerData => {
      try {
        // Create custom icon using emoji
        const customIcon = L.divIcon({
          html: `<div style="
            background: white;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            border: 2px solid #3b82f6;
          ">${markerData.emoji}</div>`,
          className: 'custom-emoji-marker',
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        });

        const marker = L.marker([markerData.lat, markerData.lng], {
          icon: customIcon
        }).addTo(mapInstanceRef.current!);

        // Add popup
        marker.bindPopup(`
          <div style="text-align: center; padding: 5px;">
            <div style="font-size: 20px; margin-bottom: 5px;">${markerData.emoji}</div>
            <div style="font-weight: bold; margin-bottom: 3px;">${markerData.label}</div>
            <div style="font-size: 12px; color: #666;">${markerData.type}</div>
          </div>
        `);

        markersRef.current.push(marker);
      } catch (err) {
        console.error('Error creating marker:', err, markerData);
      }
    });
  }, [markers]);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center p-4">
          <div className="text-red-500 mb-2">⚠️</div>
          <div className="text-sm text-gray-600">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div 
        ref={mapRef} 
        className="w-full h-full rounded-lg overflow-hidden touch-pan-x touch-pan-y"
        style={{ 
          minHeight: '300px',
          touchAction: 'pan-x pan-y'
        }}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <div className="text-sm text-gray-600">Loading map...</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpenStreetMap;
