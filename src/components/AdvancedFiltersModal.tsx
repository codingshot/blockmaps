
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdvancedFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFilters: string[];
  onFiltersChange: (filters: string[]) => void;
}

const AdvancedFiltersModal = ({ isOpen, onClose, selectedFilters, onFiltersChange }: AdvancedFiltersModalProps) => {
  if (!isOpen) return null;

  const allFilters = [
    // Safety & Security
    { id: 'crime-rate', label: 'Crime Rate', emoji: '🔥', category: 'Safety' },
    { id: 'gang-territory', label: 'Gang Territory', emoji: '🔫', category: 'Safety' },
    { id: 'red-light', label: 'Red Light District', emoji: '💋', category: 'Safety' },
    { id: 'safety', label: 'Safety Score', emoji: '🛡️', category: 'Safety' },
    
    // Lifestyle & Entertainment
    { id: 'nightlife', label: 'Nightlife', emoji: '🍸', category: 'Lifestyle' },
    { id: 'lgbtq', label: 'LGBTQ+ Friendly', emoji: '🏳️‍🌈', category: 'Lifestyle' },
    { id: 'food', label: 'Food Scene', emoji: '🍽️', category: 'Lifestyle' },
    { id: 'girls', label: 'Where Girls Are', emoji: '👯‍♀️', category: 'Lifestyle' },
    
    // Economic
    { id: 'wealth', label: 'Wealth Distribution', emoji: '💰', category: 'Economic' },
    { id: 'property-value', label: 'Property Values', emoji: '🏘️', category: 'Economic' },
    { id: 'celebrity', label: 'Celebrity Hotspots', emoji: '⭐', category: 'Economic' },
    
    // Digital Nomad
    { id: 'nomad', label: 'Nomad Clusters', emoji: '💻', category: 'Digital Nomad' },
    { id: 'workspaces', label: 'Work-Friendly Cafes', emoji: '☕', category: 'Digital Nomad' },
    { id: 'vegan', label: 'Vegan & Health Food', emoji: '🥗', category: 'Digital Nomad' },
    
    // Travel & Accessibility
    { id: 'tourist-local', label: 'Tourist vs Local', emoji: '🧳', category: 'Travel' },
    { id: 'authentic', label: 'Authentic Experience', emoji: '💎', category: 'Travel' },
    { id: 'walkability', label: 'Walkability', emoji: '👣', category: 'Travel' },
    { id: 'transit', label: 'Transit Access', emoji: '🚇', category: 'Travel' },
    { id: 'parking', label: 'Parking Difficulty', emoji: '🅿️', category: 'Travel' },
    
    // Cultural
    { id: 'street-art', label: 'Street Art', emoji: '🎨', category: 'Culture' },
    { id: 'cultural-landmarks', label: 'Cultural Landmarks', emoji: '🏛️', category: 'Culture' },
    { id: 'local-events', label: 'Local Events', emoji: '📅', category: 'Culture' },
    { id: 'food-specialties', label: 'Food Specialties', emoji: '🍲', category: 'Culture' },
  ];

  const categories = [...new Set(allFilters.map(f => f.category))];

  const toggleFilter = (filterId: string) => {
    const newFilters = selectedFilters.includes(filterId)
      ? selectedFilters.filter(f => f !== filterId)
      : [...selectedFilters, filterId];
    onFiltersChange(newFilters);
  };

  const clearAll = () => {
    onFiltersChange([]);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold">Advanced Filters</h2>
            <p className="text-gray-600 text-sm">Select the cultural aspects you want to explore</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {categories.map(category => (
            <div key={category} className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">{category}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {allFilters.filter(f => f.category === category).map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => toggleFilter(filter.id)}
                    className={`flex items-center space-x-2 p-3 rounded-lg text-sm font-medium transition-all ${
                      selectedFilters.includes(filter.id)
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
                    }`}
                  >
                    <span className="text-lg">{filter.emoji}</span>
                    <span className="truncate">{filter.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            {selectedFilters.length} filters selected
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={clearAll}>
              Clear All
            </Button>
            <Button onClick={onClose}>
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFiltersModal;
