import React from 'react';
import { Icon as IconifyIcon } from '@iconify/react';
import { LucideIcon, HelpCircle } from 'lucide-react';

export interface DynamicIconProps {
  /**
   * Can be an Iconify icon string (e.g. "lucide:dna", "ph:scales-bold", "gis:africa-alt", "carbon:document"),
   * a Lucide icon component, or a standard icon identifier.
   */
  icon?: string | LucideIcon | null;
  className?: string;
  size?: number | string;
  color?: string;
  title?: string;
  fallbackIcon?: LucideIcon;
}

/**
 * Dynamic universal icon renderer supporting both standard Lucide icons and
 * any Iconify icon name (from Phosphor, Carbon, Material, Tabler, GIS, etc.).
 */
export const DynamicIcon: React.FC<DynamicIconProps> = ({
  icon,
  className = 'w-5 h-5',
  size,
  color,
  title,
  fallbackIcon: Fallback = HelpCircle
}) => {
  if (!icon) {
    return <Fallback className={className} size={size} color={color} />;
  }

  // If a React / Lucide component is passed directly
  if (typeof icon === 'function' || (typeof icon === 'object' && icon && 'render' in (icon as Record<string, unknown>))) {
    const Component = icon as LucideIcon;
    return <Component className={className} size={size} color={color} />;
  }

  if (typeof icon === 'string') {
    // Normalise icon string format if provided without prefix
    let iconName = icon.trim();
    if (!iconName.includes(':') && !iconName.includes('-') && /^[A-Z]/.test(iconName)) {
      // CamelCase to kebab-case lucide (e.g. "BookOpen" -> "lucide:book-open")
      const kebab = iconName
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .toLowerCase();
      iconName = `lucide:${kebab}`;
    }

    const iconElement = (
      <IconifyIcon
        icon={iconName}
        className={className}
        width={size}
        height={size}
        color={color}
      />
    );

    if (title) {
      return (
        <span title={title} className="inline-flex items-center justify-center">
          {iconElement}
        </span>
      );
    }

    return iconElement;
  }

  return <Fallback className={className} size={size} color={color} />;
};

export default DynamicIcon;
