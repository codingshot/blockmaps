
import { ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MapZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
}

const MapZoomControls = ({ onZoomIn, onZoomOut }: MapZoomControlsProps) => {
  return (
    <div className="flex flex-col space-y-1">
      <Button
        onClick={onZoomIn}
        size="sm"
        className="w-10 h-10 p-0 bg-white/90 backdrop-blur-sm hover:bg-white border border-white/20 text-gray-700 hover:text-gray-900 shadow-lg"
        variant="outline"
      >
        <ZoomIn className="w-4 h-4" />
      </Button>
      <Button
        onClick={onZoomOut}
        size="sm"
        className="w-10 h-10 p-0 bg-white/90 backdrop-blur-sm hover:bg-white border border-white/20 text-gray-700 hover:text-gray-900 shadow-lg"
        variant="outline"
      >
        <ZoomOut className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default MapZoomControls;
