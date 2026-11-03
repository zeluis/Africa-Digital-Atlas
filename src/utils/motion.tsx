/**
 * motion.tsx
 * Universal Motion & Tactile Animation Engine for Africa Data Atlas.
 * Provides unified, calibrated spring physics, entrance variants,
 * accessible motion tokens, and universal drop-in motion primitives.
 * Strictly respects prefers-reduced-motion.
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, Transition, Variants, HTMLMotionProps } from 'motion/react';
import { getRegionTonalPalette } from '../data/unGeoschemeColors';
import { AfricanRegion } from '../data/types';

// ============================================================================
// 1. Calibrated Canonical Spring Physics Presets
// ============================================================================

/** Tactile, zero-lag spring physics for tabs, pills, and high-frequency toggles */
export const SPRING_TACTILE: Transition = {
  type: 'spring',
  stiffness: 500,
  damping: 35,
  mass: 0.8
};

/** Snappy spring physics for cards, overlays, and drawer expansions */
export const SPRING_SNAPPY: Transition = {
  type: 'spring',
  stiffness: 450,
  damping: 32,
  mass: 0.7
};

/** Gentle spring physics for large layout morphs and view transitions */
export const SPRING_GENTLE: Transition = {
  type: 'spring',
  stiffness: 320,
  damping: 28,
  mass: 1.0
};

/** Tactile bounce spring for notification dots and attention badges */
export const SPRING_BOUNCE: Transition = {
  type: 'spring',
  stiffness: 550,
  damping: 24,
  mass: 0.6
};

// ============================================================================
// 2. Editorial Easing Curves
// ============================================================================

export const EASE_EDITORIAL = [0.16, 1, 0.3, 1] as const;

export const TRANSITION_SMOOTH: Transition = {
  duration: 0.24,
  ease: EASE_EDITORIAL
};

export const TRANSITION_FAST: Transition = {
  duration: 0.15,
  ease: EASE_EDITORIAL
};

// ============================================================================
// 3. Accessibility & Reduced Motion
// ============================================================================

export const isReducedMotionActive = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const usePrefersReducedMotion = (): boolean => {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(media.matches);

    const listener = (event: MediaQueryListEvent) => setReduced(event.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  return reduced;
};

// ============================================================================
// 4. Standard Reusable Framer Motion Variants
// ============================================================================

export const VARIANTS_SECTION_ENTRANCE: Variants = {
  hidden: {
    opacity: 0,
    y: 12
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.28,
      ease: EASE_EDITORIAL
    }
  }
};

export const VARIANTS_TAB_PANEL: Variants = {
  initial: {
    opacity: 0,
    y: 8
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: EASE_EDITORIAL
    }
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: {
      duration: 0.14,
      ease: EASE_EDITORIAL
    }
  }
};

export const VARIANTS_STAGGER_GRID: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.015,
      delayChildren: 0.02
    }
  }
};

export const VARIANTS_STAGGER_ITEM: Variants = {
  hidden: { opacity: 0, scale: 0.98, y: 6 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 450,
      damping: 30
    }
  }
};

export const VARIANTS_FADE_SCALE: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: SPRING_SNAPPY
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: { duration: 0.12 }
  }
};

// ============================================================================
// 5. Tactile Micro-Interaction Presets
// ============================================================================

export const TACTILE_CARD_INTERACTIONS = {
  whileHover: { 
    y: -2.5, 
    transition: { type: 'spring', stiffness: 500, damping: 32 } 
  },
  whileTap: { 
    scale: 0.985, 
    transition: { type: 'spring', stiffness: 600, damping: 35 } 
  }
};

export const TACTILE_BUTTON_INTERACTIONS = {
  whileHover: { 
    scale: 1.02, 
    transition: { type: 'spring', stiffness: 500, damping: 28 } 
  },
  whileTap: { 
    scale: 0.97, 
    transition: { type: 'spring', stiffness: 600, damping: 35 } 
  }
};

// ============================================================================
// 6. Regional Tonal Dynamic Styling Presets
// ============================================================================

export interface RegionTonalMotionStyles {
  unBaseColor: string;
  lightBackground: string;
  lightBorder: string;
  hoverBackground: string;
  hoverBorder: string;
  hoverGlow: string;
  darkBackground: string;
  darkBorder: string;
}

/**
 * Returns exact regional tonal styling based on official UN M49 Geoscheme colors.
 * Used for dynamic card backgrounds, borders, and hover auras.
 */
export function getRegionCardTonalStyle(region: AfricanRegion | string): RegionTonalMotionStyles {
  const palette = getRegionTonalPalette(region);
  const hex = palette.unBaseColor;

  return {
    unBaseColor: hex,
    lightBackground: `${hex}0D`, // ~5% alpha tint
    lightBorder: `${hex}30`,     // ~19% border
    hoverBackground: `${hex}1F`, // ~12% hover tint
    hoverBorder: `${hex}80`,     // ~50% focused border
    hoverGlow: `0 8px 24px -4px ${hex}33`, // ~20% luminous aura
    darkBackground: `${hex}17`,  // ~9% dark tint
    darkBorder: `${hex}40`       // ~25% dark border
  };
}

// ============================================================================
// 7. Universal Ready-to-Use Motion Components
// ============================================================================

/**
 * AnimatedSection: Automatically animates into view when scrolled or mounted.
 */
export const AnimatedSection: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className = '', delay = 0 }) => {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return <section className={className}>{children}</section>;
  }

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-20px' }}
      variants={{
        hidden: { opacity: 0, y: 12 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.3,
            delay,
            ease: EASE_EDITORIAL
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.section>
  );
};

/**
 * SlidingPill: Drop-in sliding background pill for active tabs or segmented toggles.
 */
export const SlidingPill: React.FC<{
  layoutId: string;
  className?: string;
  style?: React.CSSProperties;
}> = ({ layoutId, className = 'absolute inset-0 rounded-xl bg-white shadow-xs', style }) => {
  return (
    <motion.div
      layoutId={layoutId}
      className={className}
      style={style}
      transition={SPRING_TACTILE}
    />
  );
};

/**
 * AnimatedTabPanel: Drop-in container for tab switching with fluid enter/exit.
 */
export const AnimatedTabPanel: React.FC<{
  tabKey: string;
  children: React.ReactNode;
  className?: string;
}> = ({ tabKey, children, className = '' }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={tabKey}
        variants={VARIANTS_TAB_PANEL}
        initial="initial"
        animate="animate"
        exit="exit"
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

/**
 * StaggerGrid: Container that staggers its direct StaggerGridItem children.
 */
export const StaggerGrid: React.FC<{
  children: React.ReactNode;
  className?: string;
  role?: string;
  'aria-label'?: string;
}> = ({ children, className = '', role, 'aria-label': ariaLabel }) => {
  return (
    <motion.div
      variants={VARIANTS_STAGGER_GRID}
      initial="hidden"
      animate="visible"
      className={className}
      role={role}
      aria-label={ariaLabel}
    >
      {children}
    </motion.div>
  );
};

/**
 * StaggerGridItem: Child element inside a StaggerGrid.
 */
export const StaggerGridItem: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <motion.div variants={VARIANTS_STAGGER_ITEM} className={className}>
      {children}
    </motion.div>
  );
};
