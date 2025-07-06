
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
  const leafletLoadedRef = useRef(false);

  useImperativeHandle(ref, () => ({
    getMapInstance: () => mapInstance
  }));

  // Load Leaflet libraries
  const loadLeaflet = async () => {
    if (leafletLoadedRef.current || window.L) {
      return window.L;
    }

    try {
      console.log('Loading Leaflet CSS...');
      // Load CSS first
      const cssLink = document.createElement('link');
      cssLink.rel = 'stylesheet';
      cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      cssLink.crossOrigin = '';
      document.head.appendChild(cssLink);

      // Wait for CSS to load
      await new Promise((resolve, reject) => {
        cssLink.onload = resolve;
        cssLink.onerror = reject;
        setTimeout(resolve, 2000); // Fallback
      });

      console.log('Loading Leaflet JS...');
      // Load JavaScript
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.crossOrigin = '';
      document.head.appendChild(script);

      await new Promise((resolve, reject) => {
        script.onload = () => {
          console.log('Leaflet loaded successfully');
          leafletLoadedRef.current = true;
          resolve(true);
        };
        script.onerror = reject;
      });

      return window.L;
    } catch (error) {
      console.error('Failed to load Leaflet:', error);
      throw error;
    }
  };

  useEffect(() => {
    let mounted = true;
    let currentMap: any = null;

    const initMap = async () => {
      if (!mapRef.current || !mounted) return;

      try {
        setIsLoading(true);
        setError(null);

        const L = await loadLeaflet();
        if (!L || !mounted) return;

        console.log('Initializing map with center:', center);

        // Clear container
        mapRef.current.innerHTML = '';

        // Fix icon paths
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        });

        // Create map
        currentMap = L.map(mapRef.current, {
          center: [center.lat, center.lng],
          zoom: zoom,
          zoomControl: true,
          scrollWheelZoom: true,
          doubleClickZoom: true,
          boxZoom: true,
          keyboard: true,
          dragging: true,
          touchZoom: true
        });

        // Add tile layer with error handling
        const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
          errorTileUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PC9zdmc+'
        });

        tileLayer.addTo(currentMap);

        // Add click handler
        if (onMapClick) {
          currentMap.on('click', (e: any) => {
            onMapClick(e.latlng.lat, e.latlng.lng);
          });
        }

        // Set map instance
        if (mounted) {
          setMapInstance(currentMap);
          setIsLoading(false);
          console.log('Map initialized successfully');
        }

      } catch (err) {
        console.error('Map initialization error:', err);
        if (mounted) {
          setError('Failed to load map. Please refresh.');
          setIsLoading(false);
        }
      }
    };

    initMap();

    return () => {
      mounted = false;
      if (currentMap) {
        try {
          currentMap.remove();
        } catch (e) {
          console.warn('Error cleaning up map:', e);
        }
      }
    };
  }, []);

  // Update center and zoom
  useEffect(() => {
    if (mapInstance && mapInstance.setView) {
      console.log('Updating map view:', center, zoom);
      mapInstance.setView([center.lat, center.lng], zoom, { animate: true });
    }
  }, [center.lat, center.lng, zoom, mapInstance]);

  // Update markers
  useEffect(() => {
    if (!mapInstance || !window.L) return;

    console.log('Adding markers:', markers.length);

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
          className: 'custom-marker',
          html: `<div class="marker-content">${marker.emoji}</div>`,
          iconSize: [40, 40],
          iconAnchor: [20, 20],
        });

        const markerInstance = window.L.marker([marker.lat, marker.lng], { 
          icon: customIcon 
        }).addTo(mapInstance);
        
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
  }, [markers, mapInstance]);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center p-6">
          <MapPin className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-semibold mb-2">Map Error</p>
          <p className="text-gray-600 text-sm mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Reload
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
          <p className="text-gray-700 font-medium">Loading Map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div 
        ref={mapRef} 
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      />
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
        }
        .custom-marker .marker-content:hover {
          transform: translate(-50%, -50%) scale(1.1);
        }
      `}</style>
    </div>
  );
});

OpenStreetMap.displayName = 'OpenStreetMap';

export default OpenStreetMap;
