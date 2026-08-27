import React, { createContext, useContext, useState, useEffect } from 'react';

interface SavedEntitiesContextType {
  savedCountries: string[];
  savedRegions: string[];
  recentSearches: string[];
  toggleSaveCountry: (countryId: string) => void;
  isCountrySaved: (countryId: string) => boolean;
  toggleSaveRegion: (region: string) => void;
  isRegionSaved: (region: string) => boolean;
  addRecentSearch: (term: string) => void;
  clearRecentSearches: () => void;
}

const SavedEntitiesContext = createContext<SavedEntitiesContextType | undefined>(undefined);

export const SavedEntitiesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedCountries, setSavedCountries] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('atlas_saved_countries');
      return saved ? JSON.parse(saved) : ['NGA', 'ZAF', 'KEN', 'EGY', 'ETH'];
    } catch {
      return ['NGA', 'ZAF', 'KEN', 'EGY', 'ETH'];
    }
  });

  const [savedRegions, setSavedRegions] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('atlas_saved_regions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('atlas_recent_searches');
      return saved ? JSON.parse(saved) : ['Nigeria', 'GDP', 'Serengeti', 'Kenya'];
    } catch {
      return ['Nigeria', 'GDP', 'Serengeti', 'Kenya'];
    }
  });

  useEffect(() => {
    localStorage.setItem('atlas_saved_countries', JSON.stringify(savedCountries));
  }, [savedCountries]);

  useEffect(() => {
    localStorage.setItem('atlas_saved_regions', JSON.stringify(savedRegions));
  }, [savedRegions]);

  useEffect(() => {
    localStorage.setItem('atlas_recent_searches', JSON.stringify(recentSearches));
  }, [recentSearches]);

  const toggleSaveCountry = (countryId: string) => {
    const id = countryId.toUpperCase();
    setSavedCountries(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const isCountrySaved = (countryId: string): boolean => {
    return savedCountries.includes(countryId.toUpperCase());
  };

  const toggleSaveRegion = (region: string) => {
    setSavedRegions(prev => 
      prev.includes(region) ? prev.filter(r => r !== region) : [...prev, region]
    );
  };

  const isRegionSaved = (region: string): boolean => {
    return savedRegions.includes(region);
  };

  const addRecentSearch = (term: string) => {
    const clean = term.trim();
    if (!clean) return;
    setRecentSearches(prev => {
      const filtered = prev.filter(s => s.toLowerCase() !== clean.toLowerCase());
      return [clean, ...filtered].slice(0, 8);
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  return (
    <SavedEntitiesContext.Provider
      value={{
        savedCountries,
        savedRegions,
        recentSearches,
        toggleSaveCountry,
        isCountrySaved,
        toggleSaveRegion,
        isRegionSaved,
        addRecentSearch,
        clearRecentSearches
      }}
    >
      {children}
    </SavedEntitiesContext.Provider>
  );
};

export const useSavedEntities = (): SavedEntitiesContextType => {
  const context = useContext(SavedEntitiesContext);
  if (!context) {
    throw new Error('useSavedEntities must be used within a SavedEntitiesProvider');
  }
  return context;
};
