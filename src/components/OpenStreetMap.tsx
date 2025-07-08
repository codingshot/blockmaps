import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import AnnotationModal from './AnnotationModal';
import { usePrivy } from '@privy-io/react-auth';

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
  const { authenticated, user } = usePrivy();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const heatmapLayersRef = useRef<L.LayerGroup[]>([]);
  const textAnnotationsRef = useRef<L.LayerGroup | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnnotation, setSelectedAnnotation] = useState<any>(null);
  const [showAnnotationModal, setShowAnnotationModal] = useState(false);

  // Heatmap types that should be displayed as overlays
  const heatmapTypes = ['crime-rate', 'safety', 'property-value', 'wealth', 'noise', 'air-quality'];

    // Enhanced text annotations with upvote data
    const [textAnnotations, setTextAnnotations] = useState([
      { 
        id: 'old-town',
        lat: 43.5520, 
        lng: 7.0170, 
        text: 'Old Town', 
        description: 'Historic district with charming cobblestone streets and traditional French architecture',
        minZoom: 14,
        upvotes: 12,
        upvotedBy: [] as string[]
      },
      { 
        id: 'nightlife',
        lat: 43.5510, 
        lng: 7.0160, 
        text: 'Nightlife District', 
        description: 'Vibrant area with bars, clubs, and late-night entertainment venues',
        minZoom: 15,
        upvotes: 8,
        upvotedBy: [] as string[]
      },
      { 
        id: 'shopping',
        lat: 43.5540, 
        lng: 7.0180, 
        text: 'Shopping Area', 
        description: 'Premium shopping district with luxury boutiques and designer stores',
        minZoom: 14,
        upvotes: 15,
        upvotedBy: [] as string[]
      },
      { 
        id: 'beach',
        lat: 43.5500, 
        lng: 7.0150, 
        text: 'Beach Promenade', 
        description: 'Beautiful waterfront promenade perfect for walking and beach activities',
        minZoom: 13,
        upvotes: 20,
        upvotedBy: [] as string[]
      },
      { 
        id: 'cultural',
        lat: 43.5530, 
        lng: 7.0165, 
        text: 'Cultural Quarter', 
        description: 'Area rich in museums, galleries, and cultural attractions',
        minZoom: 15,
        upvotes: 6,
        upvotedBy: [] as string[]
      },
      { 
        id: 'luxury',
        lat: 43.5485, 
        lng: 7.0155, 
        text: 'Luxury District', 
        description: 'Exclusive area with high-end hotels, restaurants, and luxury services',
        minZoom: 14,
        upvotes: 18,
        upvotedBy: [] as string[]
      },
      { 
        id: 'marina',
        lat: 43.5525, 
        lng: 7.0185, 
        text: 'Marina', 
        description: 'Prestigious marina with luxury yachts and waterfront dining',
        minZoom: 14,
        upvotes: 10,
        upvotedBy: [] as string[]
      },
    ]);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;

    try {
      // Clear existing map
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      console.log('Initializing map with center:', center, 'zoom:', zoom);

      // Create map with better mobile settings and higher z-index for controls
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

      // Initialize text annotations layer
      textAnnotationsRef.current = L.layerGroup().addTo(map);

      // Handle zoom changes for text annotations
      map.on('zoomend', () => {
        updateTextAnnotations();
      });

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

  // Update text annotations based on zoom level with upvote styling
  const updateTextAnnotations = () => {
    if (!mapInstanceRef.current || !textAnnotationsRef.current) return;

    const currentZoom = mapInstanceRef.current.getZoom();
    textAnnotationsRef.current.clearLayers();

    textAnnotations.forEach(annotation => {
      if (currentZoom >= annotation.minZoom) {
        // Calculate font size based on upvotes (base size 12px, +1px per 5 upvotes, max 20px)
        const fontSize = Math.min(12 + Math.floor(annotation.upvotes / 5), 20);
        
        const textMarker = L.marker([annotation.lat, annotation.lng], {
          icon: L.divIcon({
            html: `<div style="
              font-family: Calibri, sans-serif;
              color: white;
              font-size: ${fontSize}px;
              font-weight: bold;
              text-shadow: 1px 1px 0 black, -1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black;
              white-space: nowrap;
              cursor: pointer;
              z-index: 500;
              padding: 2px 4px;
              background: rgba(59, 130, 246, 0.1);
              border-radius: 4px;
              backdrop-filter: blur(2px);
            ">${annotation.text}</div>`,
            className: 'text-annotation clickable-annotation',
            iconSize: [0, 0],
            iconAnchor: [0, 0],
          }),
          zIndexOffset: 500
        });

        // Add click handler for text annotations
        textMarker.on('click', () => {
          const hasUserUpvoted = user?.id ? annotation.upvotedBy.includes(user.id) : false;
          setSelectedAnnotation({
            ...annotation,
            hasUserUpvoted
          });
          setShowAnnotationModal(true);
        });

        textAnnotationsRef.current!.addLayer(textMarker);
      }
    });
  };

  const handleUpvote = (annotationId: string) => {
    if (!authenticated || !user?.id) return;

    setTextAnnotations(prev => prev.map(annotation => {
      if (annotation.id === annotationId) {
        const hasUpvoted = annotation.upvotedBy.includes(user.id);
        if (hasUpvoted) {
          // Remove upvote
          return {
            ...annotation,
            upvotes: annotation.upvotes - 1,
            upvotedBy: annotation.upvotedBy.filter(id => id !== user.id)
          };
        } else {
          // Add upvote
          return {
            ...annotation,
            upvotes: annotation.upvotes + 1,
            upvotedBy: [...annotation.upvotedBy, user.id]
          };
        }
      }
      return annotation;
    }));

    // Update the selected annotation for the modal
    const updatedAnnotation = textAnnotations.find(a => a.id === annotationId);
    if (updatedAnnotation && user?.id) {
      const hasUpvoted = updatedAnnotation.upvotedBy.includes(user.id);
      setSelectedAnnotation({
        ...updatedAnnotation,
        upvotes: hasUpvoted ? updatedAnnotation.upvotes - 1 : updatedAnnotation.upvotes + 1,
        hasUserUpvoted: !hasUpvoted
      });
    }

    // Refresh the text annotations to update sizes
    setTimeout(() => {
      updateTextAnnotations();
    }, 100);
  };

  // Create granular heatmap overlay with much smaller grid
  const createHeatmapOverlay = (type: string, data: any[]) => {
    if (!mapInstanceRef.current) return null;

    const layerGroup = L.layerGroup();
    
    // Create much smaller, more granular grid
    const bounds = mapInstanceRef.current.getBounds();
    const gridSize = 0.0005; // Much smaller grid size for higher granularity
    
    for (let lat = bounds.getSouth(); lat < bounds.getNorth(); lat += gridSize) {
      for (let lng = bounds.getWest(); lng < bounds.getEast(); lng += gridSize) {
        // Calculate intensity based on proximity to data points
        let intensity = 0;
        data.forEach(point => {
          const distance = Math.sqrt(Math.pow(lat - point.lat, 2) + Math.pow(lng - point.lng, 2));
          if (distance < 0.003) { // Smaller influence radius for more precision
            intensity += Math.max(0, 1 - distance * 300);
          }
        });

        // Only create squares where there's actual data
        if (intensity > 0.1) { // Higher threshold to avoid too many empty squares
          const color = getHeatmapColor(type, Math.min(intensity, 1));
          const rectangle = L.rectangle(
            [[lat, lng], [lat + gridSize, lng + gridSize]],
            {
              color: color,
              fillColor: color,
              fillOpacity: Math.min(intensity * 0.5, 0.4),
              weight: 0,
              interactive: false,
              pane: 'overlayPane'
            }
          );
          // Set lower z-index for heatmap overlays to ensure they stay below markers
          (rectangle as any).options.zIndexOffset = -1000;
          layerGroup.addLayer(rectangle);
        }
      }
    }

    return layerGroup;
  };

  // Get unique color for each heatmap type and intensity
  const getHeatmapColor = (type: string, intensity: number) => {
    const colors = {
      'crime-rate': `rgb(${Math.floor(255 * intensity)}, ${Math.floor(50 * (1-intensity))}, 0)`, // Red-orange gradient
      'safety': `rgb(0, ${Math.floor(200 * intensity)}, ${Math.floor(100 * intensity)})`, // Green gradient
      'property-value': `rgb(${Math.floor(100 * intensity)}, ${Math.floor(150 * intensity)}, ${Math.floor(255 * intensity)})`, // Blue gradient
      'wealth': `rgb(${Math.floor(255 * intensity)}, ${Math.floor(200 * intensity)}, 0)`, // Gold gradient
      'noise': `rgb(${Math.floor(150 * intensity)}, 0, ${Math.floor(200 * intensity)})`, // Purple gradient
      'air-quality': `rgb(0, ${Math.floor(255 * intensity)}, ${Math.floor(200 * intensity)})`  // Cyan gradient
    };
    return colors[type as keyof typeof colors] || `rgb(128, 128, 128)`;
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

    // Create heatmap overlays first (so they render below markers)
    Object.entries(heatmapData).forEach(([type, data]) => {
      const heatmapLayer = createHeatmapOverlay(type, data);
      if (heatmapLayer) {
        heatmapLayer.addTo(mapInstanceRef.current!);
        heatmapLayersRef.current.push(heatmapLayer);
      }
    });

    // Add regular markers with high z-index to ensure they appear above heatmaps
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
            z-index: 2000;
            position: relative;
          ">${markerData.emoji}</div>`,
          className: 'custom-emoji-marker',
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        });

        const marker = L.marker([markerData.lat, markerData.lng], {
          icon: customIcon,
          zIndexOffset: 2000 // High z-index to ensure markers appear above heatmaps
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

    // Update text annotations after markers are added
    updateTextAnnotations();
  }, [markers]);

  // Add CSS for clickable annotations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .clickable-annotation:hover {
        transform: scale(1.1);
        transition: transform 0.2s ease;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

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
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <div className="text-sm text-gray-600">Loading map...</div>
          </div>
        </div>
      )}
      
      <AnnotationModal
        isOpen={showAnnotationModal}
        onClose={() => setShowAnnotationModal(false)}
        annotation={selectedAnnotation}
        onUpvote={handleUpvote}
      />
    </div>
  );
};

export default OpenStreetMap;
