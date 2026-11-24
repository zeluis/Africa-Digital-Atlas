import React, { createContext, useContext, useState, useEffect } from 'react';
import { readStorageJson, writeStorageJson } from '../utils/storageCache';

interface SavedEntitiesContextType {
  savedCountries: string[];
  savedRegions: string[];
  savedPlates: string[];
  recentSearches: string[];
  toggleSaveCountry: (countryId: string) => void;
  isCountrySaved: (countryId: string) => boolean;
  toggleSaveRegion: (region: string) => void;
  isRegionSaved: (region: string) => boolean;
  toggleSavePlate: (plateId: string) => void;
  isPlateSaved: (plateId: string) => boolean;
  addRecentSearch: (term: string) => void;
  clearRecentSearches: () => void;
}

const SavedEntitiesContext = createContext<SavedEntitiesContextType | undefined>(undefined);

const DEFAULT_SAVED_COUNTRIES = ['NGA', 'ZAF', 'KEN', 'EGY', 'ETH'];
const DEFAULT_SAVED_PLATES = ['danville-1749', 'arrows-1802'];
const DEFAULT_RECENT_SEARCHES = ['Nigeria', 'GDP', 'Serengeti', 'Kenya'];

export const SavedEntitiesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedCountries, setSavedCountries] = useState<string[]>(() => {
    const parsed = readStorageJson<unknown>('atlas_saved_countries', DEFAULT_SAVED_COUNTRIES);
    return Array.isArray(parsed) ? parsed : DEFAULT_SAVED_COUNTRIES;
  });

  const [savedRegions, setSavedRegions] = useState<string[]>(() => {
    const parsed = readStorageJson<unknown>('atlas_saved_regions', []);
    return Array.isArray(parsed) ? parsed : [];
  });

  const [savedPlates, setSavedPlates] = useState<string[]>(() => {
    const parsed = readStorageJson<unknown>('atlas_saved_plates', DEFAULT_SAVED_PLATES);
    return Array.isArray(parsed) ? parsed : DEFAULT_SAVED_PLATES;
  });

  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const parsed = readStorageJson<unknown>('atlas_recent_searches', DEFAULT_RECENT_SEARCHES);
    return Array.isArray(parsed) ? parsed : DEFAULT_RECENT_SEARCHES;
  });

  useEffect(() => {
    writeStorageJson('atlas_saved_countries', savedCountries);
  }, [savedCountries]);

  useEffect(() => {
    writeStorageJson('atlas_saved_regions', savedRegions);
  }, [savedRegions]);

  useEffect(() => {
    writeStorageJson('atlas_saved_plates', savedPlates);
  }, [savedPlates]);

  useEffect(() => {
    writeStorageJson('atlas_recent_searches', recentSearches);
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

  const toggleSavePlate = (plateId: string) => {
    setSavedPlates(prev =>
      prev.includes(plateId) ? prev.filter(p => p !== plateId) : [...prev, plateId]
    );
  };

  const isPlateSaved = (plateId: string): boolean => {
    return savedPlates.includes(plateId);
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
        savedPlates,
        recentSearches,
        toggleSaveCountry,
        isCountrySaved,
        toggleSaveRegion,
        isRegionSaved,
        toggleSavePlate,
        isPlateSaved,
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
