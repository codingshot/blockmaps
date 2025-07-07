
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
  onLocationClick?: () => void;
}

const OpenStreetMap: React.FC<OpenStreetMapProps> = ({
  center,
  zoom,
  markers,
  onMapClick,
  onLocationClick
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const heatmapLayersRef = useRef<L.LayerGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Heatmap types that should be displayed as overlays
  const heatmapTypes = ['crime-rate', 'safety', 'property-value', 'wealth', 'noise', 'air-quality'];

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
        zoomControl: false,
        attributionControl: true,
        scrollWheelZoom: true,
        touchZoom: true,
        doubleClickZoom: true,
        dragging: true,
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

  // Create heatmap overlay
  const createHeatmapOverlay = (type: string, data: any[]) => {
    if (!mapInstanceRef.current) return null;

    const layerGroup = L.layerGroup();
    
    // Create grid of colored rectangles to simulate heatmap
    const bounds = mapInstanceRef.current.getBounds();
    const gridSize = 0.005; // Size of each grid cell
    
    for (let lat = bounds.getSouth(); lat < bounds.getNorth(); lat += gridSize) {
      for (let lng = bounds.getWest(); lng < bounds.getEast(); lng += gridSize) {
        // Calculate intensity based on proximity to data points
        let intensity = 0;
        data.forEach(point => {
          const distance = Math.sqrt(Math.pow(lat - point.lat, 2) + Math.pow(lng - point.lng, 2));
          if (distance < 0.01) {
            intensity += Math.max(0, 1 - distance * 100);
          }
        });

        if (intensity > 0.1) {
          const color = getHeatmapColor(type, Math.min(intensity, 1));
          const rectangle = L.rectangle(
            [[lat, lng], [lat + gridSize, lng + gridSize]],
            {
              color: color,
              fillColor: color,
              fillOpacity: Math.min(intensity * 0.6, 0.4),
              weight: 0
            }
          );
          layerGroup.addLayer(rectangle);
        }
      }
    }

    return layerGroup;
  };

  // Get color for heatmap based on type and intensity
  const getHeatmapColor = (type: string, intensity: number) => {
    const colors = {
      'crime-rate': `rgba(255, ${Math.floor((1-intensity) * 100)}, 0, ${intensity})`,
      'safety': `rgba(0, ${Math.floor(intensity * 255)}, 0, ${intensity})`,
      'property-value': `rgba(0, 100, ${Math.floor(intensity * 255)}, ${intensity})`,
      'wealth': `rgba(255, ${Math.floor(intensity * 215)}, 0, ${intensity})`,
      'noise': `rgba(128, 0, ${Math.floor(intensity * 128)}, ${intensity})`,
      'air-quality': `rgba(${Math.floor((1-intensity) * 255)}, 255, ${Math.floor((1-intensity) * 255)}, ${intensity})`
    };
    return colors[type as keyof typeof colors] || `rgba(100, 100, 100, ${intensity})`;
  };

  // Update markers and heatmaps
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    console.log('Updating markers, count:', markers.length);

    // Clear existing markers and heatmaps
    markersRef.current.forEach(marker => {
      mapInstanceRef.current?.removeLayer(marker);
    });
    markersRef.current = [];

    heatmapLayersRef.current.forEach(layer => {
      mapInstanceRef.current?.removeLayer(layer);
    });
    heatmapLayersRef.current = [];

    // Separate heatmap data from regular markers
    const heatmapData: { [key: string]: any[] } = {};
    const regularMarkers: any[] = [];

    markers.forEach(markerData => {
      if (heatmapTypes.includes(markerData.type)) {
        if (!heatmapData[markerData.type]) {
          heatmapData[markerData.type] = [];
        }
        heatmapData[markerData.type].push(markerData);
      } else {
        regularMarkers.push(markerData);
      }
    });

    // Create heatmap overlays
    Object.entries(heatmapData).forEach(([type, data]) => {
      const heatmapLayer = createHeatmapOverlay(type, data);
      if (heatmapLayer) {
        heatmapLayer.addTo(mapInstanceRef.current!);
        heatmapLayersRef.current.push(heatmapLayer);
      }
    });

    // Add regular markers
    regularMarkers.forEach(markerData => {
      try {
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
        className="w-full h-full rounded-lg overflow-hidden"
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
