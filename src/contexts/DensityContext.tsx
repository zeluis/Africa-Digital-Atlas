import React, { createContext, useContext, useState, useEffect } from 'react';

export type DensityMode = 'standard' | 'analytical' | 'editorial';

interface DensityContextType {
  density: DensityMode;
  setDensity: (mode: DensityMode) => void;
  cycleDensity: () => void;
}

const DensityContext = createContext<DensityContextType | undefined>(undefined);

export const DensityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [density, setDensityState] = useState<DensityMode>(() => {
    try {
      const saved = localStorage.getItem('atlas_density');
      if (saved === 'analytical' || saved === 'editorial' || saved === 'standard') {
        return saved;
      }
    } catch {
      // Ignore storage restrictions in sandboxed/private iframes
    }
    return 'standard';
  });

  const setDensity = (mode: DensityMode) => {
    setDensityState(mode);
    try {
      localStorage.setItem('atlas_density', mode);
    } catch {
      // Ignore storage restrictions
    }
  };

  const cycleDensity = () => {
    if (density === 'standard') setDensity('analytical');
    else if (density === 'analytical') setDensity('editorial');
    else setDensity('standard');
  };

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('density-standard', 'density-analytical', 'density-editorial');
    root.classList.add(`density-${density}`);
  }, [density]);

  return (
    <DensityContext.Provider value={{ density, setDensity, cycleDensity }}>
      {children}
    </DensityContext.Provider>
  );
};

export const useDensity = (): DensityContextType => {
  const context = useContext(DensityContext);
  if (!context) {
    throw new Error('useDensity must be used within a DensityProvider');
  }
  return context;
};
