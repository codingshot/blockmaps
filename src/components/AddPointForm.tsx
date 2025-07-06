
import { useState } from 'react';
import { X, MapPin, Tag, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface AddPointFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  selectedLocation?: { lat: number; lng: number };
}

const AddPointForm = ({ isOpen, onClose, onSubmit, selectedLocation }: AddPointFormProps) => {
  const [formData, setFormData] = useState({
    label: '',
    emoji: '',
    type: '',
    description: '',
    tags: '',
  });

  const cultureTypes = [
    { id: 'culture', emoji: '🎭', label: 'Culture' },
    { id: 'nightlife', emoji: '🍸', label: 'Nightlife' },
    { id: 'food', emoji: '🍽️', label: 'Food' },
    { id: 'safety', emoji: '🛡️', label: 'Safety' },
    { id: 'wealth', emoji: '💎', label: 'Wealth' },
    { id: 'lifestyle', emoji: '🏖️', label: 'Lifestyle' },
    { id: 'art', emoji: '🎨', label: 'Art' },
    { id: 'nomad', emoji: '💻', label: 'Digital Nomad' },
    { id: 'lgbtq', emoji: '🌈', label: 'LGBTQ+' },
  ];

  const emojiOptions = ['🎬', '🍾', '🥖', '🛡️', '💎', '🏖️', '🎭', '☕', '🌈', '🎨', '🍸', '🏛️', '🌟', '🔥', '💪', '🎵', '🌮', '🍕'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLocation) return;

    const newPoint = {
      id: Date.now().toString(),
      lat: selectedLocation.lat,
      lng: selectedLocation.lng,
      emoji: formData.emoji,
      label: formData.label,
      type: formData.type,
      description: formData.description,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
    };

    onSubmit(newPoint);
    setFormData({ label: '', emoji: '', type: '', description: '', tags: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header - Mobile Optimized */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b sticky top-0 bg-white rounded-t-2xl sm:rounded-t-2xl">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg sm:text-xl font-bold">Add Culture Point</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Location Display */}
          {selectedLocation && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-700">
                📍 {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
              </p>
            </div>
          )}

          {/* Emoji Selection - Mobile Grid */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Choose Emoji</Label>
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
              {emojiOptions.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, emoji }))}
                  className={`p-2 sm:p-3 text-xl sm:text-2xl rounded-lg border-2 transition-all ${
                    formData.emoji === emoji
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Culture Type - Mobile Responsive */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Culture Type</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {cultureTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: type.id }))}
                  className={`flex items-center space-x-2 p-2 sm:p-3 rounded-lg border transition-all text-left ${
                    formData.type === type.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-lg">{type.emoji}</span>
                  <span className="text-xs sm:text-sm font-medium truncate">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Label Input */}
          <div className="space-y-2">
            <Label htmlFor="label" className="text-sm font-medium">
              Place Name *
            </Label>
            <Input
              id="label"
              value={formData.label}
              onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
              placeholder="e.g., Palais des Festivals"
              required
              className="h-12 text-base"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Tell us about this place..."
              rows={3}
              className="text-base resize-none"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags" className="text-sm font-medium">
              Tags (comma-separated)
            </Label>
            <div className="flex items-center space-x-2">
              <Tag className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="luxury, tourist-friendly, expensive"
                className="h-12 text-base"
              />
            </div>
          </div>

          {/* Submit Buttons - Mobile Stack */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="order-2 sm:order-1 h-12 text-base"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!formData.label || !formData.emoji || !formData.type}
              className="order-1 sm:order-2 h-12 text-base bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Add Point
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPointForm;
