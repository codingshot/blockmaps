
import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { MapPin, Loader, RefreshCw } from 'lucide-react';

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

// Declare global Leaflet
declare global {
  interface Window {
    L: any;
  }
}

const OpenStreetMap = forwardRef<any, OpenStreetMapProps>(({ center, zoom = 13, markers = [], onMapClick }, ref) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useImperativeHandle(ref, () => ({
    getMapInstance: () => mapInstance
  }));

  const loadLeafletResources = async () => {
    try {
      // Remove existing elements if they exist
      const existingCss = document.querySelector('link[href*="leaflet"]');
      const existingScript = document.querySelector('script[src*="leaflet"]');
      
      if (existingCss) existingCss.remove();
      if (existingScript) existingScript.remove();

      console.log('Loading Leaflet resources...');

      // Load CSS
      const cssPromise = new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        link.onload = resolve;
        link.onerror = reject;
        document.head.appendChild(link);
      });

      await cssPromise;

      // Load JavaScript
      const jsPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });

      await jsPromise;

      // Wait a bit for Leaflet to initialize
      await new Promise(resolve => setTimeout(resolve, 500));

      if (!window.L) {
        throw new Error('Leaflet failed to load');
      }

      console.log('Leaflet loaded successfully');
      return window.L;
    } catch (error) {
      console.error('Failed to load Leaflet:', error);
      throw new Error('Failed to load map library');
    }
  };

  const initializeMap = async () => {
    if (!mapRef.current) return;

    try {
      setIsLoading(true);
      setError(null);

      const L = await loadLeafletResources();

      // Clear the container
      mapRef.current.innerHTML = '';

      // Fix default markers
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      // Create map instance
      const mapOptions = {
        center: [center.lat, center.lng],
        zoom: zoom,
        zoomControl: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        dragging: true,
        touchZoom: true,
        boxZoom: true,
        keyboard: true,
        maxZoom: 19,
        minZoom: 1
      };

      console.log('Creating map with options:', mapOptions);
      const map = L.map(mapRef.current, mapOptions);

      // Add tile layer
      const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
        crossOrigin: true
      });

      tileLayer.addTo(map);

      // Add click handler
      if (onMapClick) {
        map.on('click', (e: any) => {
          onMapClick(e.latlng.lat, e.latlng.lng);
        });
      }

      // Wait for tiles to load
      await new Promise(resolve => {
        let tilesLoaded = 0;
        const totalTiles = 9; // Approximate tiles in view
        
        tileLayer.on('tileload', () => {
          tilesLoaded++;
          if (tilesLoaded >= 3) { // Wait for at least 3 tiles
            resolve(true);
          }
        });

        // Fallback timeout
        setTimeout(resolve, 3000);
      });

      setMapInstance(map);
      setIsLoading(false);
      console.log('Map initialized successfully');

    } catch (err) {
      console.error('Map initialization failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to load map');
      setIsLoading(false);
    }
  };

  const retryMapLoad = () => {
    setRetryCount(prev => prev + 1);
    setError(null);
    initializeMap();
  };

  useEffect(() => {
    initializeMap();

    return () => {
      if (mapInstance) {
        try {
          mapInstance.remove();
        } catch (e) {
          console.warn('Error cleaning up map:', e);
        }
      }
    };
  }, [retryCount]);

  // Update map view
  useEffect(() => {
    if (mapInstance && mapInstance.setView) {
      mapInstance.setView([center.lat, center.lng], zoom, { animate: true });
    }
  }, [center.lat, center.lng, zoom, mapInstance]);

  // Update markers
  useEffect(() => {
    if (!mapInstance || !window.L) return;

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
        <div className="text-center p-6 max-w-md">
          <MapPin className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-semibold mb-2">Map Loading Error</p>
          <p className="text-gray-600 text-sm mb-4">{error}</p>
          <div className="space-y-2">
            <button 
              onClick={retryMapLoad}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry ({retryCount + 1})</span>
            </button>
            <p className="text-xs text-gray-500">
              Check your internet connection and try again
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center p-6">
          <Loader className="w-10 h-10 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-700 font-medium">Loading Interactive Map...</p>
          <p className="text-gray-500 text-sm mt-2">This may take a moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div 
        ref={mapRef} 
        className="w-full h-full rounded-lg"
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
          transition: transform 0.2s ease;
        }
        .custom-marker .marker-content:hover {
          transform: translate(-50%, -50%) scale(1.1);
        }
        .leaflet-container {
          background: #e3f2fd;
        }
      `}</style>
    </div>
  );
});

OpenStreetMap.displayName = 'OpenStreetMap';

export default OpenStreetMap;
