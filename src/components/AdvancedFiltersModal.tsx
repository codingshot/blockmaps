
import { X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdvancedFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFilters: string[];
  onFiltersChange: (filters: string[]) => void;
}

const AdvancedFiltersModal = ({ isOpen, onClose, selectedFilters, onFiltersChange }: AdvancedFiltersModalProps) => {
  if (!isOpen) return null;

  const filterCategories = [
    {
      title: 'City Status',
      filters: [
        { id: 'active', label: 'Live Maps Only', icon: '🟢' },
        { id: 'coming-soon', label: 'Coming Soon', icon: '⏳' },
      ]
    },
    {
      title: 'Culture & Lifestyle',
      filters: [
        { id: 'luxury', label: 'Luxury Areas', icon: '💎' },
        { id: 'nightlife', label: 'Nightlife Scene', icon: '🍸' },
        { id: 'culture', label: 'Cultural Heritage', icon: '🎭' },
        { id: 'art', label: 'Art & Design', icon: '🎨' },
        { id: 'food', label: 'Food Scene', icon: '🍽️' },
      ]
    },
    {
      title: 'Safety & Environment',
      filters: [
        { id: 'safe', label: 'High Safety Rating', icon: '🛡️' },
        { id: 'family-friendly', label: 'Family Friendly', icon: '👨‍👩‍👧' },
        { id: 'walkable', label: 'Walkable Areas', icon: '🚶' },
      ]
    },
    {
      title: 'Geography & Climate',
      filters: [
        { id: 'beach', label: 'Beach Culture', icon: '🏖️' },
        { id: 'mountain', label: 'Mountain Areas', icon: '🏔️' },
        { id: 'urban', label: 'Urban Centers', icon: '🏙️' },
        { id: 'historic', label: 'Historic Districts', icon: '🏛️' },
      ]
    },
  ];

  const toggleFilter = (filterId: string) => {
    const newFilters = selectedFilters.includes(filterId)
      ? selectedFilters.filter(f => f !== filterId)
      : [...selectedFilters, filterId];
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    onFiltersChange([]);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold">Advanced Filters</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-6">
            {filterCategories.map((category) => (
              <div key={category.title}>
                <h3 className="text-lg font-semibold mb-3 text-gray-800">{category.title}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {category.filters.map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => toggleFilter(filter.id)}
                      className={`flex items-center space-x-2 p-3 rounded-lg text-sm font-medium transition-all ${
                        selectedFilters.includes(filter.id)
                          ? 'bg-blue-500 text-white shadow-md'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
                      }`}
                    >
                      <span>{filter.icon}</span>
                      <span>{filter.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            {selectedFilters.length} filter{selectedFilters.length !== 1 ? 's' : ''} selected
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={clearAllFilters}>
              Clear All
            </Button>
            <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700">
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFiltersModal;
