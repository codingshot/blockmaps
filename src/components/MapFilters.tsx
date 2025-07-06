
import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MapFiltersProps {
  selectedFilters: string[];
  onFiltersChange: (filters: string[]) => void;
}

const MapFilters = ({ selectedFilters, onFiltersChange }: MapFiltersProps) => {
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

  const quickFilters = [
    { id: 'nightlife', emoji: '🍸' },
    { id: 'food', emoji: '🍽️' },
    { id: 'safety', emoji: '🛡️' },
    { id: 'wealth', emoji: '💰' },
    { id: 'nomad', emoji: '💻' },
    { id: 'authentic', emoji: '💎' },
  ];

  return (
    <div className="absolute bottom-4 left-4 z-40 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-white/20 w-80 max-w-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="font-semibold text-gray-800">Map Filters</span>
            {selectedFilters.length > 0 && (
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                {selectedFilters.length}
              </span>
            )}
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2 mb-3">
          {quickFilters.map(filter => {
            const filterData = allFilters.find(f => f.id === filter.id);
            if (!filterData) return null;
            
            return (
              <button
                key={filter.id}
                onClick={() => toggleFilter(filter.id)}
                className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium transition-all ${
                  selectedFilters.includes(filter.id)
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <span className="text-sm">{filter.emoji}</span>
                <span className="hidden sm:inline">{filterData.label}</span>
              </button>
            );
          })}
        </div>

        {/* Clear Filters Button */}
        {selectedFilters.length > 0 && (
          <Button
            onClick={clearAll}
            variant="outline"
            size="sm"
            className="w-full flex items-center justify-center space-x-2 text-xs"
          >
            <X className="w-3 h-3" />
            <span>Clear All ({selectedFilters.length})</span>
          </Button>
        )}
      </div>

      {/* All Categories with Scroll */}
      <ScrollArea className="h-80">
        <div className="p-4 space-y-4">
          {categories.map(category => (
            <div key={category} className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-700">{category}</h4>
              <div className="grid grid-cols-1 gap-2">
                {allFilters.filter(f => f.category === category).map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => toggleFilter(filter.id)}
                    className={`flex items-center space-x-2 p-2 rounded-lg text-xs font-medium transition-all ${
                      selectedFilters.includes(filter.id)
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
                    }`}
                  >
                    <span className="text-sm">{filter.emoji}</span>
                    <span className="truncate">{filter.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default MapFilters;
