
import { usePrivy } from '@privy-io/react-auth';
import { X, MapPin, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface AnnotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  annotation: {
    id: string;
    lat: number;
    lng: number;
    text: string;
    description: string;
    upvotes: number;
    hasUserUpvoted: boolean;
  } | null;
  onUpvote: (annotationId: string) => void;
}

const AnnotationModal = ({ 
  isOpen, 
  onClose, 
  annotation, 
  onUpvote 
}: AnnotationModalProps) => {
  const { authenticated } = usePrivy();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  if (!isOpen || !annotation) return null;

  const handleUpvote = () => {
    if (!authenticated) {
      setShowAuthPrompt(true);
      return;
    }
    onUpvote(annotation.id);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-bold">{annotation.text}</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-600 text-sm">{annotation.description}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Location</h3>
            <p className="text-gray-600 text-sm">
              {annotation.lat.toFixed(6)}, {annotation.lng.toFixed(6)}
            </p>
          </div>

          {showAuthPrompt && !authenticated && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-600">
              Please connect your wallet to upvote annotations
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-2">
              <ThumbsUp className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{annotation.upvotes} upvotes</span>
            </div>
            
            <Button
              onClick={handleUpvote}
              variant={annotation.hasUserUpvoted ? "default" : "outline"}
              size="sm"
              className={`flex items-center space-x-2 ${
                annotation.hasUserUpvoted 
                  ? "bg-blue-500 text-white" 
                  : "border-blue-500 text-blue-500 hover:bg-blue-50"
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
              <span>{annotation.hasUserUpvoted ? 'Upvoted' : 'Upvote'}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnotationModal;
