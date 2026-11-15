import React from 'react';
import {
  LucideIcon,
  HelpCircle,
  Dna,
  Scale,
  BookOpen,
  Globe,
  Globe2,
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
  BarChart3,
  Sparkles,
  TreePine,
  Search,
  Download,
  Share2,
  GalleryThumbnails,
  BookImage,
  BookOpenText,
  Network,
  PanelLeft,
  PanelRightClose,
  PanelRightOpen,
  LayoutGrid,
  Grid,
  Maximize2,
  Expand,
  Map as MapIcon,
  Anchor,
} from 'lucide-react';

const LOCAL_ICON_MAP: Record<string, LucideIcon> = {
  'lucide:dna': Dna,
  'ph:dna-bold': Dna,
  'dna': Dna,
  'lucide:scale': Scale,
  'ph:scales-bold': Scale,
  'scales': Scale,
  'lucide:book-open': BookOpen,
  'lucide:book-a': BookOpen,
  'fluent-mdl2:knowledge-article': BookOpen,
  'book-open': BookOpen,
  'lucide:globe': Globe,
  'globe': Globe,
  'game-icons:africa': Globe2,
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
  'gis:search-globe': Compass,
  'compass': Compass,
  'lucide:bar-chart-2': BarChart2,
  'bar-chart-2': BarChart2,
  'lucide:bar-chart-3': BarChart3,
  'glyphs-poly:analytics': BarChart3,
  'bar-chart-3': BarChart3,
  'lucide:sparkles': Sparkles,
  'sparkles': Sparkles,
  'lucide:tree-pine': TreePine,
  'tree-pine': TreePine,
  'mdi:family-tree': Network,
  'lucide:search': Search,
  'search': Search,
  'lucide:download': Download,
  'download': Download,
  'lucide:share-2': Share2,
  'share-2': Share2,
  'lucide:gallery-thumbnails': GalleryThumbnails,
  'gallery-thumbnails': GalleryThumbnails,
  'lucide:book-image': BookImage,
  'book-image': BookImage,
  'lucide:book-open-text': BookOpenText,
  'book-open-text': BookOpenText,
  'lucide:grid': Grid,
  'grid': Grid,
  'fluent-mdl2:picture-tile': LayoutGrid,
  'fluent-mdl2:picture-center': Maximize2,
  'carbon:expand-screen': Expand,
  'codicon:layout-sidebar-right-off': PanelRightClose,
  'codicon:layout-sidebar-right': PanelRightOpen,
  'codicon:layout-sidebar-left-dock': PanelLeft,
  'lucide:map': MapIcon,
  'map': MapIcon,
  'lucide:anchor': Anchor,
  'anchor': Anchor,
};

export interface DynamicIconProps {
  /**
   * Accepts an icon identifier string (mapped locally to Lucide icons),
   * a Lucide icon component, or null/undefined.
   */
  icon?: string | LucideIcon | null;
  className?: string;
  size?: number | string;
  color?: string;
  title?: string;
  fallbackIcon?: LucideIcon;
}

/**
 * Dynamic universal icon renderer backed by tree-shaken local Lucide icons
 * for zero-latency offline reliability.
 */
export const DynamicIcon: React.FC<DynamicIconProps> = ({
  icon,
  className = 'w-5 h-5',
  size,
  color,
  title,
  fallbackIcon: Fallback = HelpCircle,
}) => {
  const renderWithTitle = (element: React.ReactElement) =>
    title ? (
      <span title={title} className="inline-flex items-center justify-center">
        {element}
      </span>
    ) : (
      element
    );

  if (!icon) {
    return renderWithTitle(<Fallback className={className} size={size} color={color} />);
  }

  if (typeof icon === 'function' || (typeof icon === 'object' && icon && 'render' in (icon as Record<string, unknown>))) {
    const Component = icon as LucideIcon;
    return renderWithTitle(<Component className={className} size={size} color={color} />);
  }

  if (typeof icon === 'string') {
    const raw = icon.trim();
    const cleanKey = raw.toLowerCase();

    if (LOCAL_ICON_MAP[cleanKey]) {
      const LocalComponent = LOCAL_ICON_MAP[cleanKey];
      return renderWithTitle(<LocalComponent className={className} size={size} color={color} />);
    }

    if (!raw.includes(':') && !raw.includes('-') && /^[A-Z]/.test(raw)) {
      const kebab = raw.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
      const prefixedKey = `lucide:${kebab}`;
      if (LOCAL_ICON_MAP[prefixedKey]) {
        const LocalComponent = LOCAL_ICON_MAP[prefixedKey];
        return renderWithTitle(<LocalComponent className={className} size={size} color={color} />);
      }
    }

    return renderWithTitle(<Fallback className={className} size={size} color={color} />);
  }

  return renderWithTitle(<Fallback className={className} size={size} color={color} />);
};

export default DynamicIcon;
