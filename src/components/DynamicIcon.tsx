import React from 'react';
import { Icon as IconifyIcon } from '@iconify/react';
import { 
  LucideIcon, 
  HelpCircle,
  Dna,
  Scale,
  BookOpen,
  Globe,
  Activity,
  Database,
  FileText,
  TrendingUp,
  Cpu,
  MapPin,
  Landmark,
  Shield,
  Users,
  Sun,
  Layers,
  Compass,
  BarChart2,
  Sparkles,
  TreePine,
  Search,
  Download,
  Share2
} from 'lucide-react';

const LOCAL_ICON_FALLBACKS: Record<string, LucideIcon> = {
  'lucide:dna': Dna,
  'dna': Dna,
  'lucide:scale': Scale,
  'scales': Scale,
  'lucide:book-open': BookOpen,
  'book-open': BookOpen,
  'lucide:globe': Globe,
  'globe': Globe,
  'lucide:activity': Activity,
  'activity': Activity,
  'lucide:database': Database,
  'database': Database,
  'lucide:file-text': FileText,
  'file-text': FileText,
  'lucide:trending-up': TrendingUp,
  'trending-up': TrendingUp,
  'lucide:cpu': Cpu,
  'cpu': Cpu,
  'lucide:map-pin': MapPin,
  'map-pin': MapPin,
  'lucide:landmark': Landmark,
  'landmark': Landmark,
  'lucide:shield': Shield,
  'shield': Shield,
  'lucide:users': Users,
  'users': Users,
  'lucide:sun': Sun,
  'sun': Sun,
  'lucide:layers': Layers,
  'layers': Layers,
  'lucide:compass': Compass,
  'compass': Compass,
  'lucide:bar-chart-2': BarChart2,
  'bar-chart-2': BarChart2,
  'lucide:sparkles': Sparkles,
  'sparkles': Sparkles,
  'lucide:tree-pine': TreePine,
  'tree-pine': TreePine,
  'lucide:search': Search,
  'search': Search,
  'lucide:download': Download,
  'download': Download,
  'lucide:share-2': Share2,
  'share-2': Share2
};

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
 * any Iconify icon name with offline resilience.
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
    // Check local lookup first
    const cleanKey = icon.trim().toLowerCase();
    if (LOCAL_ICON_FALLBACKS[cleanKey]) {
      const LocalComponent = LOCAL_ICON_FALLBACKS[cleanKey];
      return <LocalComponent className={className} size={size} color={color} />;
    }

    // Normalise icon string format if provided without prefix
    let iconName = icon.trim();
    if (!iconName.includes(':') && !iconName.includes('-') && /^[A-Z]/.test(iconName)) {
      // CamelCase to kebab-case lucide (e.g. "BookOpen" -> "lucide:book-open")
      const kebab = iconName
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .toLowerCase();
      iconName = `lucide:${kebab}`;
    }

    // Check if transformed iconName matches local fallback
    if (LOCAL_ICON_FALLBACKS[iconName.toLowerCase()]) {
      const LocalComponent = LOCAL_ICON_FALLBACKS[iconName.toLowerCase()];
      return <LocalComponent className={className} size={size} color={color} />;
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
